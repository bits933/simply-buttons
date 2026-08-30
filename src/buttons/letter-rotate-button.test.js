import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Letter rotate button replicates osmo button 069 default variant", () => {
  const css = readFileSync(join(dir, "letter-rotate-button.css"), "utf8");
  assert.match(css, /--button-069-color/);
  assert.ok(css.includes("font-kerning: none"));
  const jsx = readFileSync(join(dir, "LetterRotateButton.jsx"), "utf8");
  assert.match(jsx, /data-button-069/);
  assert.match(jsx, /export function LetterRotateButtonPreview\(/);
  const snippets = readFileSync(join(dir, "letter-rotate-button.snippets.js"), "utf8");
  assert.match(snippets, /export const LETTER_ROTATE_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "letter-rotate"/);
});
