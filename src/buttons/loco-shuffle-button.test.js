import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { LOCO_SHUFFLE_META, LOCO_SHUFFLE_SNIPPETS } from "./loco-shuffle-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Loco shuffle button races Fisher–Yates rounds on hover", () => {
  const css = readFileSync(join(dir, "loco-shuffle-button.css"), "utf8");
  assert.match(css, /--aw-shuffle-race: 1/);
  assert.match(css, /min-width: 200px/);
  assert.match(css, /border-top: 1px solid #121212/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "LocoShuffleButton.jsx"), "utf8");
  assert.match(jsx, /data-loco-shuffle/);
  assert.match(jsx, /aria-label=\{label\}/);
  assert.match(jsx, /onMouseEnter=\{scramble\}/);
  assert.match(jsx, /onMouseLeave=\{restore\}/);
  assert.match(jsx, /setInterval/);
  assert.match(jsx, /clearInterval/);
  const react = LOCO_SHUFFLE_SNIPPETS.react;
  assert.match(react, /const ROUNDS = 4/);
  assert.match(react, /250 \/ 8/);
  assert.ok(LOCO_SHUFFLE_SNIPPETS.html.includes("fisherYates"));
  for (const [stack, snippet] of Object.entries(LOCO_SHUFFLE_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-shuffle-race"), `${stack} snippet missing marker`);
  }
  assert.equal(LOCO_SHUFFLE_META.id, "aw-loco-shuffle");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-loco-shuffle"/g) ?? []).length, 0);
  assert.equal((slots.match(/preview: LocoShuffleButtonPreview/g) ?? []).length, 0);
});
