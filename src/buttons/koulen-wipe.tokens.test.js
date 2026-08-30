import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { KOULEN_WIPE, buildKoulenWipeCss } from "./koulen-wipe.tokens.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("koulen wipe tokens match the supplied SVGs", () => {
  assert.equal(KOULEN_WIPE.label, "BUTTON");
  assert.equal(KOULEN_WIPE.fill, "#FFC800");
  assert.equal(KOULEN_WIPE.restInk, "#FFFFFF");
  assert.equal(KOULEN_WIPE.hotInk, "#000000");
  assert.equal(KOULEN_WIPE.width, "199px");
  assert.equal(KOULEN_WIPE.height, "90px");
  assert.equal(KOULEN_WIPE.fontSize, "36px");
  assert.equal(KOULEN_WIPE.font, "Koulen");
  assert.equal(KOULEN_WIPE.duration, "480ms");
  assert.equal(KOULEN_WIPE.ease, "cubic-bezier(0.22, 1, 0.36, 1)");
});

test("built CSS wipes fill with scaleX and ink with clip-path, text stays put", () => {
  const css = buildKoulenWipeCss();
  assert.ok(css.includes(KOULEN_WIPE.fill));
  assert.ok(css.includes(KOULEN_WIPE.restInk));
  assert.ok(css.includes(KOULEN_WIPE.hotInk));
  assert.ok(css.includes("font-family: Koulen"));
  assert.ok(css.includes("transform: scaleX(0)"));
  assert.ok(css.includes("transform: scaleX(1)"));
  assert.ok(css.includes("transform-origin: left center"));
  assert.ok(css.includes("clip-path: inset(0 100% 0 0)"));
  assert.ok(css.includes("clip-path: inset(0 0% 0 0)"));
  assert.ok(css.includes(KOULEN_WIPE.duration));
  assert.ok(css.includes(KOULEN_WIPE.ease));
  assert.ok(css.includes("prefers-reduced-motion"));
  assert.ok(css.includes(":disabled"));
  assert.ok(css.includes(":focus-visible"));
  assert.equal(css.includes("background-position"), false);
  assert.equal(/\bwidth\s*:[^;]*transition/.test(css), false);
  assert.equal(css.includes("scaleX(0)") && css.includes(".btn-koulen-fill"), true);
  // button itself must not scale
  assert.equal(/\.btn-koulen-btn:hover[^{]*\{[^}]*scale\(/.test(css), false);
});

test("gallery snippets and slot registration ship the koulen wipe", async () => {
  const { KOULEN_WIPE_SNIPPETS, KOULEN_WIPE_META } = await import(
    "./koulen-wipe.snippets.js"
  );
  const slots = readFileSync(join(dir, "../slots.js"), "utf8");
  const jsx = readFileSync(join(dir, "KoulenWipeButton.jsx"), "utf8");
  assert.ok(slots.includes("KoulenWipePreview"));
  assert.ok(slots.includes('id: "koulen-wipe"'));
  assert.equal(KOULEN_WIPE_META.id, "koulen-wipe");
  assert.equal(KOULEN_WIPE_META.name, "Koulen wipe");
  assert.ok(jsx.includes("btn-koulen-fill"));
  assert.ok(jsx.includes("btn-koulen-ink--rest"));
  assert.ok(jsx.includes("btn-koulen-hot"));
  assert.ok(jsx.includes(KOULEN_WIPE.label) || jsx.includes("KOULEN_WIPE.label"));
  for (const key of ["html", "react", "node"]) {
    const text = KOULEN_WIPE_SNIPPETS[key];
    assert.equal(typeof text, "string");
    assert.ok(text.includes("btn-koulen-btn"));
    assert.ok(text.includes("BUTTON"));
    assert.ok(text.includes("#FFC800"));
    assert.ok(text.includes("Koulen"));
    assert.ok(text.includes("scaleX"));
    assert.ok(text.includes("clip-path"));
    assert.ok(text.includes("<button"));
  }
});
