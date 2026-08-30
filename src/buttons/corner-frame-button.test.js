import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Corner frame button replicates osmo button 070 default variant", () => {
  const css = readFileSync(join(dir, "corner-frame-button.css"), "utf8");
  assert.match(css, /--button-070-color/);
  assert.ok(css.includes("--button-070-corner-size"));
  const jsx = readFileSync(join(dir, "CornerFrameButton.jsx"), "utf8");
  assert.match(jsx, /data-button-070/);
  assert.match(jsx, /export function CornerFrameButtonPreview\(/);
  const snippets = readFileSync(join(dir, "corner-frame-button.snippets.js"), "utf8");
  assert.match(snippets, /export const CORNER_FRAME_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "corner-frame"/);
});
