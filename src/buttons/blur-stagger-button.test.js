import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Blur stagger button replicates osmo button 041 default variant", () => {
  const css = readFileSync(join(dir, "blur-stagger-button.css"), "utf8");
  assert.match(css, /--button-041-color/);
  assert.ok(css.includes("--char"));
  const jsx = readFileSync(join(dir, "BlurStaggerButton.jsx"), "utf8");
  assert.match(jsx, /data-button-041/);
  assert.match(jsx, /export function BlurStaggerButtonPreview\(/);
  const snippets = readFileSync(join(dir, "blur-stagger-button.snippets.js"), "utf8");
  assert.match(snippets, /export const BLUR_STAGGER_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "blur-stagger"/);
});
