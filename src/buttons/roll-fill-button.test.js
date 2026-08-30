import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Roll fill button replicates osmo button 049 default variant", () => {
  const css = readFileSync(join(dir, "roll-fill-button.css"), "utf8");
  assert.match(css, /--button-049-color/);
  assert.ok(css.includes("--button-049-text-duplicate-distance"));
  const jsx = readFileSync(join(dir, "RollFillButton.jsx"), "utf8");
  assert.match(jsx, /data-button-049/);
  assert.match(jsx, /export function RollFillButtonPreview\(/);
  const snippets = readFileSync(join(dir, "roll-fill-button.snippets.js"), "utf8");
  assert.match(snippets, /export const ROLL_FILL_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "roll-fill"/);
});
