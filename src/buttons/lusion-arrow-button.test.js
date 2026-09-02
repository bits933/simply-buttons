import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { LUSION_ARROW_META, LUSION_ARROW_SNIPPETS } from "./lusion-arrow-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Lusion arrow button slides its label, collapses the dots, and glides the arrow in", () => {
  const css = readFileSync(join(dir, "lusion-arrow-button.css"), "utf8");
  assert.match(css, /--aw-glide-arrow: 1/);
  assert.match(css, /border-radius: 6\.25em/);
  assert.match(css, /translate3d\(-2\.5em, 0, 0\)/);
  assert.match(css, /translate3d\(1\.5em, 0, 0\)/);
  assert.match(css, /transform: scale\(0\)/);
  assert.match(css, /300ms cubic-bezier\(0\.4, 0, 0\.1, 1\)/);
  assert.match(css, /#5e6b78/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "LusionArrowButton.jsx"), "utf8");
  assert.match(jsx, /data-lusion-arrow/);
  assert.match(jsx, /la-dots/);
  assert.match(jsx, /la-arrow/);
  assert.match(jsx, /la-window/);
  for (const [stack, snippet] of Object.entries(LUSION_ARROW_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-glide-arrow"), `${stack} snippet missing marker`);
  }
  assert.equal(LUSION_ARROW_META.id, "aw-lusion-arrow");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-lusion-arrow"/g) ?? []).length, 0);
  assert.equal((slots.match(/preview: LusionArrowButtonPreview/g) ?? []).length, 0);
});
