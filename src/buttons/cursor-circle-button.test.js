import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Cursor circle button replicates osmo button 046 default variant", () => {
  const css = readFileSync(join(dir, "cursor-circle-button.css"), "utf8");
  assert.match(css, /--button-046-color/);
  assert.ok(css.includes("button-046__bg-circle"));
  const jsx = readFileSync(join(dir, "CursorCircleButton.jsx"), "utf8");
  assert.match(jsx, /data-button-046/);
  assert.match(jsx, /export function CursorCircleButtonPreview\(/);
  const snippets = readFileSync(join(dir, "cursor-circle-button.snippets.js"), "utf8");
  assert.match(snippets, /export const CURSOR_CIRCLE_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "cursor-circle"/);
});
