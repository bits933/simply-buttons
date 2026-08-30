import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Random rise button replicates osmo button 072 default variant", () => {
  const css = readFileSync(join(dir, "random-rise-button.css"), "utf8");
  assert.match(css, /--button-072-color/);
  assert.ok(css.includes("button-072__split-char"));
  const jsx = readFileSync(join(dir, "RandomRiseButton.jsx"), "utf8");
  assert.match(jsx, /data-button-072/);
  assert.match(jsx, /export function RandomRiseButtonPreview\(/);
  const snippets = readFileSync(join(dir, "random-rise-button.snippets.js"), "utf8");
  assert.match(snippets, /export const RANDOM_RISE_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "random-rise"/);
});
