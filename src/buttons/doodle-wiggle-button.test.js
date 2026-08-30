import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Doodle wiggle button replicates osmo button 039 default variant", () => {
  const css = readFileSync(join(dir, "doodle-wiggle-button.css"), "utf8");
  assert.match(css, /--button-039-color/);
  assert.ok(css.includes("button-039-sprite"));
  const jsx = readFileSync(join(dir, "DoodleWiggleButton.jsx"), "utf8");
  assert.match(jsx, /data-button-039/);
  assert.match(jsx, /export function DoodleWiggleButtonPreview\(/);
  const snippets = readFileSync(join(dir, "doodle-wiggle-button.snippets.js"), "utf8");
  assert.match(snippets, /export const DOODLE_WIGGLE_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "doodle-wiggle"/);
});
