import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Clip fill button replicates osmo button 050 default variant", () => {
  const css = readFileSync(join(dir, "clip-fill-button.css"), "utf8");
  assert.match(css, /--button-050-color/);
  assert.ok(css.includes("clip-path: inset(100% 0.75em 0% 0.75em round 0em)"));
  const jsx = readFileSync(join(dir, "ClipFillButton.jsx"), "utf8");
  assert.match(jsx, /data-button-050/);
  assert.match(jsx, /export function ClipFillButtonPreview\(/);
  const snippets = readFileSync(join(dir, "clip-fill-button.snippets.js"), "utf8");
  assert.match(snippets, /export const CLIP_FILL_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "clip-fill"/);
});
