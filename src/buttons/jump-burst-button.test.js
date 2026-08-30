import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Jump burst button replicates osmo button 078 default variant", () => {
  const css = readFileSync(join(dir, "jump-burst-button.css"), "utf8");
  assert.match(css, /--button-078-color/);
  assert.ok(css.includes("button-078__spark"));
  const jsx = readFileSync(join(dir, "JumpBurstButton.jsx"), "utf8");
  assert.match(jsx, /data-button-078/);
  assert.match(jsx, /export function JumpBurstButtonPreview\(/);
  const snippets = readFileSync(join(dir, "jump-burst-button.snippets.js"), "utf8");
  assert.match(snippets, /export const JUMP_BURST_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "jump-burst"/);
});
