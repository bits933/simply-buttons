import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Dual block fill button replicates osmo button 076 default variant", () => {
  const css = readFileSync(join(dir, "dual-block-fill-button.css"), "utf8");
  assert.match(css, /--button-076-color/);
  assert.ok(css.includes("polygon(50% 100%, 50% 0%, 100% 0%"));
  const jsx = readFileSync(join(dir, "DualBlockFillButton.jsx"), "utf8");
  assert.match(jsx, /data-button-076/);
  assert.match(jsx, /export function DualBlockFillButtonPreview\(/);
  const snippets = readFileSync(join(dir, "dual-block-fill-button.snippets.js"), "utf8");
  assert.match(snippets, /export const DUAL_BLOCK_FILL_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "dual-block-fill"/);
});
