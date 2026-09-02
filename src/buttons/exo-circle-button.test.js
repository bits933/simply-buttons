import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { EXO_CIRCLE_META, EXO_CIRCLE_SNIPPETS } from "./exo-circle-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Exo circle button fills its glyph circle on hover", () => {
  const css = readFileSync(join(dir, "exo-circle-button.css"), "utf8");
  assert.match(css, /--aw-circle-fill: 1/);
  assert.match(css, /\.ec-fill\s*\{[\s\S]*?transform: scale\(0\)/);
  assert.match(css, /:hover \.ec-fill,\s*\n\.btn-exo-circle:focus-visible \.ec-fill/);
  assert.match(css, /transform: scaleX\(0\)/);
  assert.match(css, /transform-origin: left/);
  assert.match(css, /#0d0e13/);
  assert.match(css, /450ms/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /background: transparent/);
  assert.doesNotMatch(css, /background: #ffffff/);
  assert.match(css, /\[data-theme="dark"\]/);
  assert.match(css, /--ec-ink: #eceef1/);
  assert.match(css, /\.ec-label \{[\s\S]*?height: 44px/);
  assert.match(css, /\.ec-circle \{[\s\S]*?height: 44px/);
  const jsx = readFileSync(join(dir, "ExoCircleButton.jsx"), "utf8");
  assert.match(jsx, /data-exo-circle/);
  assert.match(jsx, /ec-ring/);
  assert.match(jsx, /ec-fill/);
  assert.match(jsx, /ec-underline/);
  for (const [stack, snippet] of Object.entries(EXO_CIRCLE_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-circle-fill"), `${stack} snippet missing marker`);
    assert.ok(snippet.includes("background: transparent"), `${stack} must drop the white well`);
    assert.ok(snippet.includes("--ec-ink: #eceef1"), `${stack} must invert in dark`);
    assert.ok(snippet.includes("height: 44px"), `${stack} must share the 44px center line`);
  }
  assert.equal(EXO_CIRCLE_META.id, "aw-exo-circle");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-exo-circle"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: ExoCircleButtonPreview/g) ?? []).length, 1);
});
