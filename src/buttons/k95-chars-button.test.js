import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { K95_CHARS_META, K95_CHARS_SNIPPETS } from "./k95-chars-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("K95 chars button rolls per-character columns on toggle", () => {
  const css = readFileSync(join(dir, "k95-chars-button.css"), "utf8");
  assert.match(css, /--aw-char-roll: 1/);
  assert.match(css, /backdrop-filter: blur\(10px\)/);
  assert.match(css, /border-radius: 100px/);
  assert.match(css, /height: 1em/);
  assert.match(css, /translateY\(-1em\)/);
  assert.match(css, /transition-delay: calc\(var\(--i\) \* 18ms\)/);
  assert.match(css, /350ms cubic-bezier\(0\.4, 0, 0\.2, 1\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "K95CharsButton.jsx"), "utf8");
  assert.match(jsx, /data-k95-chars/);
  assert.match(jsx, /data-phase=\{phase\}/);
  assert.match(jsx, /aria-expanded=\{phase === "open"\}/);
  assert.match(jsx, /kc-copy--alt/);
  for (const [stack, snippet] of Object.entries(K95_CHARS_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-char-roll"), `${stack} snippet missing marker`);
  }
  assert.equal(K95_CHARS_META.id, "aw-k95-chars");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-k95-chars"/g) ?? []).length, 0);
  assert.equal((slots.match(/preview: K95CharsButtonPreview/g) ?? []).length, 0);
});
