import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Shine scale button replicates osmo button 079 default variant", () => {
  const css = readFileSync(join(dir, "shine-scale-button.css"), "utf8");
  assert.match(css, /--button-079-color/);
  assert.ok(css.includes("button-079-shine"));
  const jsx = readFileSync(join(dir, "ShineScaleButton.jsx"), "utf8");
  assert.match(jsx, /data-button-079/);
  assert.match(jsx, /export function ShineScaleButtonPreview\(/);
  const snippets = readFileSync(join(dir, "shine-scale-button.snippets.js"), "utf8");
  assert.match(snippets, /export const SHINE_SCALE_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "shine-scale"/);
});
