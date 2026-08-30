import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Line bloom button replicates osmo button 054 default variant", () => {
  const css = readFileSync(join(dir, "line-bloom-button.css"), "utf8");
  assert.match(css, /--button-054-color/);
  assert.ok(css.includes("inset(calc(50% - 0.0625em) 0% calc(50% - 0.0625em) 0%)"));
  const jsx = readFileSync(join(dir, "LineBloomButton.jsx"), "utf8");
  assert.match(jsx, /data-button-054/);
  assert.match(jsx, /export function LineBloomButtonPreview\(/);
  const snippets = readFileSync(join(dir, "line-bloom-button.snippets.js"), "utf8");
  assert.match(snippets, /export const LINE_BLOOM_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "line-bloom"/);
});
