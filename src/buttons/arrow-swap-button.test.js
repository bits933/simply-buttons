import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Arrow swap button replicates osmo button 052 default variant", () => {
  const css = readFileSync(join(dir, "arrow-swap-button.css"), "utf8");
  assert.match(css, /--button-052-color/);
  assert.ok(css.includes("button-052__icon-wrap"));
  const jsx = readFileSync(join(dir, "ArrowSwapButton.jsx"), "utf8");
  assert.match(jsx, /data-button-052/);
  assert.match(jsx, /export function ArrowSwapButtonPreview\(/);
  const snippets = readFileSync(join(dir, "arrow-swap-button.snippets.js"), "utf8");
  assert.match(snippets, /export const ARROW_SWAP_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "arrow-swap"/);
});
