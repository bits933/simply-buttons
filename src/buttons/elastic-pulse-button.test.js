import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Elastic pulse button replicates osmo button 045 default variant", () => {
  const css = readFileSync(join(dir, "elastic-pulse-button.css"), "utf8");
  assert.match(css, /--button-045-color/);
  assert.ok(css.includes("--button-045-color-background: #FFAA32"));
  const jsx = readFileSync(join(dir, "ElasticPulseButton.jsx"), "utf8");
  assert.match(jsx, /data-button-045/);
  assert.match(jsx, /export function ElasticPulseButtonPreview\(/);
  const snippets = readFileSync(join(dir, "elastic-pulse-button.snippets.js"), "utf8");
  assert.match(snippets, /export const ELASTIC_PULSE_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "elastic-pulse"/);
});
