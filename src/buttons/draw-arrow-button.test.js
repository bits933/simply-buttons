import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Draw arrow button replicates osmo button 077 default variant", () => {
  const css = readFileSync(join(dir, "draw-arrow-button.css"), "utf8");
  assert.match(css, /--button-077-color/);
  assert.ok(css.includes("--button-077-gap: 0.375em"));
  const jsx = readFileSync(join(dir, "DrawArrowButton.jsx"), "utf8");
  assert.match(jsx, /data-button-077/);
  assert.match(jsx, /export function DrawArrowButtonPreview\(/);
  const snippets = readFileSync(join(dir, "draw-arrow-button.snippets.js"), "utf8");
  assert.match(snippets, /export const DRAW_ARROW_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "draw-arrow"/);
});
