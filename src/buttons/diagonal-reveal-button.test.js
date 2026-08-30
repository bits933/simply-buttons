import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Diagonal reveal button replicates osmo button 035 default variant", () => {
  const css = readFileSync(join(dir, "diagonal-reveal-button.css"), "utf8");
  assert.match(css, /--button-035-color/);
  assert.ok(css.includes("clip-path: polygon(calc(50% + 1em) 0%"));
  const jsx = readFileSync(join(dir, "DiagonalRevealButton.jsx"), "utf8");
  assert.match(jsx, /data-button-035/);
  assert.match(jsx, /export function DiagonalRevealButtonPreview\(/);
  const snippets = readFileSync(join(dir, "diagonal-reveal-button.snippets.js"), "utf8");
  assert.match(snippets, /export const DIAGONAL_REVEAL_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "diagonal-reveal"/);
});
