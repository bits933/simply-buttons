import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Chromatic rise button replicates osmo button 067 default variant", () => {
  const css = readFileSync(join(dir, "chromatic-rise-button.css"), "utf8");
  assert.match(css, /--button-067-color/);
  assert.ok(css.includes("button-067__bg-hover"));
  const jsx = readFileSync(join(dir, "ChromaticRiseButton.jsx"), "utf8");
  assert.match(jsx, /data-button-067/);
  assert.match(jsx, /export function ChromaticRiseButtonPreview\(/);
  const snippets = readFileSync(join(dir, "chromatic-rise-button.snippets.js"), "utf8");
  assert.match(snippets, /export const CHROMATIC_RISE_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "chromatic-rise"/);
});
