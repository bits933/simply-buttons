import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { TWITTER_50, TWITTER_50_LAST_PRIOR } from "./catalog.js";
import { TWITTER_50_SNIPPETS, TWITTER_50_METAS } from "./snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("catalog is 50 unique X posts split 25/25 with markers", () => {
  assert.equal(TWITTER_50.length, 50);
  const impression = TWITTER_50.filter((r) => r.bucket === "impression");
  const underrated = TWITTER_50.filter((r) => r.bucket === "underrated");
  assert.equal(impression.length, 25);
  assert.equal(underrated.length, 25);
  const urls = TWITTER_50.map((r) => r.url);
  assert.equal(new Set(urls).size, 50);
  const markers = TWITTER_50.map((r) => r.marker);
  assert.equal(new Set(markers).size, 50);
  const ids = TWITTER_50.map((r) => r.id);
  assert.equal(new Set(ids).size, 50);
  for (const row of TWITTER_50) {
    assert.match(row.url, /^https:\/\/(x|twitter)\.com\//);
    assert.ok(row.author);
    assert.ok(row.style_note);
    assert.ok(row.marker.startsWith("--x50-"));
    assert.ok(Number.isFinite(row.likes));
    assert.ok(Number.isFinite(row.reposts));
    assert.ok(row.metric === "views" || row.metric === "likes_reposts");
    if (row.metric === "views") {
      assert.ok(Number.isFinite(row.views) && row.views > 0);
      assert.equal(row.score, row.views);
    } else {
      assert.equal(row.views, null);
      assert.equal(row.score, row.likes + row.reposts);
    }
    assert.equal(TWITTER_50.filter((r) => r.index === row.index).length, 1);
  }
  assert.equal(TWITTER_50[0].index, 87);
  assert.equal(TWITTER_50[49].index, 136);
  assert.equal(TWITTER_50_LAST_PRIOR, "dust-premium");
});

test("each tray ships three stacks with <button> and its catalog marker", () => {
  for (const row of TWITTER_50) {
    const snippets = TWITTER_50_SNIPPETS[row.id];
    assert.ok(snippets, row.id);
    assert.ok(snippets.html && snippets.react && snippets.node, row.id);
    for (const [stack, text] of Object.entries(snippets)) {
      assert.match(text, /<button/, `${row.id} ${stack} missing <button`);
      assert.ok(text.includes(row.marker), `${row.id} ${stack} missing ${row.marker}`);
      assert.ok(text.includes(row.label) || text.includes(JSON.stringify(row.label).slice(1, -1)), `${row.id} ${stack} missing label`);
    }
    assert.match(snippets.node, /node:http/);
    assert.doesNotMatch(snippets.node, /express/i);
    assert.equal(TWITTER_50_METAS[row.id].id, row.id);
    assert.ok(TWITTER_50_METAS[row.id].keywords.length >= 8, row.id);
  }
  const markerHits = TWITTER_50.map((r) => r.marker);
  assert.equal(new Set(markerHits).size, 50);
});

const GALLERY_X50_REMOVED = new Set([
  "x50-voltage",
  "x50-loved-cta",
  "x50-cq-shimmer",
  "x50-glitch-flip",
  "x50-explore-3d",
  "x50-layer-step",
  "x50-dir-roll",
  "x50-gravity",
  "x50-syntax-glass",
  "x50-glass-mix",
  "x50-proximity",
  "x50-metallic",
  "x50-julius-glass",
  "x50-button-sets",
  "x50-hover-active",
  "x50-micro-scale",
]);

test("slots.js keeps the remaining x50 trays after dust-premium and drops the culled set", async () => {
  const slots = await readFile(join(dir, "..", "..", "slots.js"), "utf8");
  const dust = slots.lastIndexOf('id: "dust-premium"');
  assert.ok(dust > 0);
  let kept = 0;
  for (const row of TWITTER_50) {
    const hits = slots.match(new RegExp(`id: "${row.id}"`, "g")) ?? [];
    if (GALLERY_X50_REMOVED.has(row.id)) {
      assert.equal(hits.length, 0, `${row.id} must stay off the gallery`);
      continue;
    }
    const at = slots.indexOf(`id: "${row.id}"`);
    assert.ok(at > dust, `${row.id} must append after dust-premium`);
    assert.equal(hits.length, 1);
    assert.match(slots, new RegExp(`preview: TWITTER_50_PREVIEWS\\["${row.id}"\\]`));
    assert.match(slots, new RegExp(`snippets: TWITTER_50_SNIPPETS\\["${row.id}"\\]`));
    kept += 1;
  }
  assert.equal(kept, 34);
  const filled = [...slots.matchAll(/preview:\s+/g)].length;
  assert.equal(filled, 142, `expected 142 previews, got ${filled}`);
  const lastX50 = slots.lastIndexOf('id: "x50-fifteen"');
  const idsAfter = [...slots.slice(lastX50 + 1).matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
  assert.ok(idsAfter.every((id) => !id.startsWith("x50-")), "remaining x50 trays must stay contiguous after dust-premium");
});

test("five-hovers hover fill uses a dark base so white does not bleed at the corners", async () => {
  const css = await readFile(join(dir, "twitter-50.css"), "utf8");
  assert.match(css, /\.x50-five-hovers \{[^}]*background: #111827/);
  assert.match(css, /\.x50-five-hovers::before \{[^}]*background: #ffffff/);
  assert.match(css, /\.x50-five-hovers::before \{[^}]*inset: -2px/);
  assert.match(css, /mix-blend-mode: difference/);
  assert.match(css, /translate3d\(0, -105%, 0\)/);
  assert.doesNotMatch(css, /translateY\(101%\)/);
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-five-hovers"])) {
    assert.match(text, /mix-blend-mode: difference/);
    assert.match(text, /background: #111827/);
    assert.match(text, /inset: -2px/);
    assert.doesNotMatch(text, /translateY\(101%\)/);
  }
});

test("extracted specimens match their source posts, not caption inventions", () => {
  const loved = TWITTER_50.find((r) => r.id === "x50-loved-cta");
  assert.equal(loved.url, "https://x.com/avstorm/status/1724521641953071141");
  assert.equal(loved.kind, "loved-blend");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-loved-cta"])) {
    assert.match(text, /mix-blend-mode:\s*difference/);
    assert.doesNotMatch(text, /heart/);
    assert.doesNotMatch(text, /#ff5a1f/);
  }

  const spot = TWITTER_50.find((r) => r.id === "x50-blend-diff");
  assert.equal(spot.url, "https://x.com/jh3yy/status/1729546779274707150");
  assert.equal(spot.kind, "invert-spot");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-blend-diff"])) {
    assert.match(text, /\.spot/);
    assert.match(text, /--x50-invert-spot/);
    assert.match(text, /mix-blend-mode:\s*difference/);
  }
  assert.notEqual(loved.url, spot.url);

  const send = TWITTER_50.find((r) => r.id === "x50-altitude");
  assert.equal(send.url, "https://x.com/jamesm/status/1932958811868049720");
  assert.equal(send.label, "Send email");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-altitude"])) {
    assert.match(text, /Send email/);
    assert.match(text, /linear-gradient\(#f7f7f8/);
    assert.doesNotMatch(text, /35,000ft/);
    assert.doesNotMatch(text, /vapour|trail/);
  }

  const soft = TWITTER_50.find((r) => r.id === "x50-ana-soft");
  assert.equal(soft.url, "https://x.com/anatudor/status/1634909243370360834");
  assert.equal(soft.kind, "ios-yellow");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-ana-soft"])) {
    assert.match(text, /border-radius:\s*22px/);
    assert.match(text, /#ffe34d/);
    assert.doesNotMatch(text, /#f3d9e8/);
    assert.doesNotMatch(text, /neumorph/i);
  }

  const down = TWITTER_50.find((r) => r.id === "x50-button-sets");
  assert.equal(down.url, "https://x.com/anatudor/status/1902270703593775342");
  assert.equal(down.label, "DOWNLOAD NOW");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-button-sets"])) {
    assert.match(text, /DOWNLOAD NOW/);
    assert.match(text, /--x50-download-now/);
    assert.doesNotMatch(text, /class="dot"/);
  }
});

test("search pill rest state keeps the magnifier centered in the circle", async () => {
  const css = await readFile(join(dir, "twitter-50.css"), "utf8");
  assert.match(css, /overflow:\s*hidden;\s*gap:\s*0/);
  assert.match(css, /\.x50-search-pill \.lab \{[^}]*position:\s*absolute/);
  assert.match(css, /\.x50-search-pill \.mag::before/);
  assert.match(css, /\.x50-search-pill-root \{[^}]*justify-content:\s*center/);
  for (const [stack, text] of Object.entries(TWITTER_50_SNIPPETS["x50-search-pill"])) {
    assert.match(text, /gap:\s*0/, `${stack} missing rest-state gap: 0`);
    assert.match(text, /position:\s*absolute/, `${stack} rest label must leave flex flow`);
    assert.match(text, /mag::before/, `${stack} missing centered magnifier`);
  }
});

test("modern sheet eases its tracking into and out of hover", async () => {
  const css = await readFile(join(dir, "twitter-50.css"), "utf8");
  const transition = /transition:\s*letter-spacing 420ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/;
  assert.match(css, transition);
  for (const [stack, text] of Object.entries(TWITTER_50_SNIPPETS["x50-modern-sheet"])) {
    assert.match(text, transition, `${stack} missing smooth tracking transition`);
  }
});

test("blend difference turns only the text beneath the white cursor circle black", async () => {
  const css = await readFile(join(dir, "twitter-50.css"), "utf8");
  const spot = css.match(/\.x50-blend-diff \.spot\s*\{[^}]*\}/)?.[0] ?? "";
  const label = css.match(/\.x50-blend-diff \.lab\s*\{[^}]*\}/)?.[0] ?? "";
  assert.doesNotMatch(spot, /mix-blend-mode/);
  assert.match(label, /z-index:\s*2/);
  assert.match(label, /mix-blend-mode:\s*difference/);
  for (const [stack, text] of Object.entries(TWITTER_50_SNIPPETS["x50-blend-diff"])) {
    assert.match(text, /\.x50-blend-diff \.lab\s*\{[^}]*mix-blend-mode:\s*difference/, `${stack} label must invert inside the cursor circle`);
  }
});
