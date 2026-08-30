import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Char roll button replicates osmo button 071 default variant", () => {
  const css = readFileSync(join(dir, "char-roll-button.css"), "utf8");
  assert.match(css, /--button-071-color/);
  assert.ok(css.includes("button-071-translate"));
  const jsx = readFileSync(join(dir, "CharRollButton.jsx"), "utf8");
  assert.match(jsx, /data-button-071/);
  assert.match(jsx, /export function CharRollButtonPreview\(/);
  const snippets = readFileSync(join(dir, "char-roll-button.snippets.js"), "utf8");
  assert.match(snippets, /export const CHAR_ROLL_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "char-roll"/);
});
