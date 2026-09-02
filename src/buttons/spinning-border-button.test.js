import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { SPINNING_BORDER_META, SPINNING_BORDER_SNIPPETS } from "./spinning-border-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));
const CANONICAL_SHA =
  "d7150ca6ca4ad7975ba183c368b25a5de266e6a018c801b89720b8e8e3fab8a7";

test("Spinning border is the ThreeUI RectangleButtons variant from the registered source", () => {
  const source = readFileSync(join(dir, "spinning-border-button.source.html"));
  assert.equal(createHash("sha256").update(source).digest("hex"), CANONICAL_SHA);

  const html = source.toString("utf8");
  assert.match(html, /Request Demo/);
  assert.match(html, /animate-\[spin_3s_linear_infinite\]/);
  assert.match(html, /conic-gradient\(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ffffff_100%\)/);
  assert.match(html, /bg-zinc-800/);
  assert.match(html, /from-zinc-800/);
  assert.match(html, /to-zinc-950/);
  assert.match(html, /text-zinc-400/);
  assert.match(html, /group-hover:opacity-0/);
  assert.match(html, /group-hover:translate-x-0\.5/);
  assert.match(html, /hover:-translate-y-0\.5/);

  const css = readFileSync(join(dir, "spinning-border-button.css"), "utf8");
  assert.match(css, /--spinning-border-cta: 1/);
  assert.match(css, /#111318/);
  assert.match(css, /#27272a/);
  assert.match(css, /#09090b/);
  assert.match(css, /#a1a1aa/);
  assert.match(css, /conic-gradient\(from 90deg at 50% 50%, transparent 0%, transparent 75%, #ffffff 100%\)/);
  assert.match(css, /spinning-border-spin 3s linear infinite/);
  assert.match(css, /padding: 0\.625rem 1\.5rem/);
  assert.match(css, /\.spinning-border-root\[data-mode="light"\]/);

  const jsx = readFileSync(join(dir, "SpinningBorderButton.jsx"), "utf8");
  assert.match(jsx, /export function RectangleButtons/);
  assert.match(jsx, /variant = "spinning-border-button"/);
  assert.match(jsx, /mode="dark"/);
  assert.match(jsx, /saturation=\{1/);
  assert.match(jsx, /brightness=\{1/);
  assert.match(jsx, /type="button"/);
  assert.match(jsx, /aria-label="Request Demo"/);
  assert.match(jsx, /Request Demo/);
  assert.match(jsx, /m12 5 7 7-7 7/);

  for (const [stack, snippet] of Object.entries(SPINNING_BORDER_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("--spinning-border-cta"), `${stack} snippet missing marker`);
    assert.ok(snippet.includes("Request Demo"), `${stack} missing label`);
    assert.ok(snippet.includes("conic-gradient"), `${stack} missing the beam gradient`);
    assert.ok(snippet.includes("#27272a"), `${stack} missing the zinc ring`);
    assert.ok(!snippet.includes("node:fs"), `${stack} must not import node:fs`);
  }
  assert.ok(SPINNING_BORDER_SNIPPETS.node.includes("express"), "node stack serves via Express");
  assert.ok(SPINNING_BORDER_SNIPPETS.react.includes("RectangleButtons"));
  assert.ok(SPINNING_BORDER_SNIPPETS.react.includes('variant="spinning-border-button"'));
  assert.ok(SPINNING_BORDER_SNIPPETS.react.includes("<style>{CSS}</style>"));

  assert.equal(SPINNING_BORDER_META.id, "spinning-border-button");
  assert.ok(SPINNING_BORDER_META.keywords.length >= 17, "keywords contract");
  assert.ok(SPINNING_BORDER_META.keywords.includes("animated button"));
  assert.ok(SPINNING_BORDER_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "spinning-border-button"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: SpinningBorderButtonPreview/g) ?? []).length, 1);
  const generate = slots.lastIndexOf('id: "generate-button"');
  const spinning = slots.indexOf('id: "spinning-border-button"');
  assert.ok(spinning > generate, "spinning-border-button must append after generate-button");
});
