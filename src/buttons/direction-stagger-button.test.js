import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Direction stagger button replicates osmo button 066 default variant", () => {
  const css = readFileSync(join(dir, "direction-stagger-button.css"), "utf8");
  assert.match(css, /--button-066-color/);
  assert.ok(css.includes("--button-066-char-direction"));
  const jsx = readFileSync(join(dir, "DirectionStaggerButton.jsx"), "utf8");
  assert.match(jsx, /data-button-066/);
  assert.match(jsx, /export function DirectionStaggerButtonPreview\(/);
  const snippets = readFileSync(join(dir, "direction-stagger-button.snippets.js"), "utf8");
  assert.match(snippets, /export const DIRECTION_STAGGER_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "direction-stagger"/);
});
