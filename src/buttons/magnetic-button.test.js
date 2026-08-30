import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Magnetic button replicates osmo button 037 default variant", () => {
  const css = readFileSync(join(dir, "magnetic-button.css"), "utf8");
  assert.match(css, /--button-037-color/);
  assert.ok(css.includes("cubic-bezier(0.34, 2.27, 0.64, 1)"));
  const jsx = readFileSync(join(dir, "MagneticButton.jsx"), "utf8");
  assert.match(jsx, /data-button-037/);
  assert.match(jsx, /export function MagneticButtonPreview\(/);
  const snippets = readFileSync(join(dir, "magnetic-button.snippets.js"), "utf8");
  assert.match(snippets, /export const MAGNETIC_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "magnetic"/);
});
