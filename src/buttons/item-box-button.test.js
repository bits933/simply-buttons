import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Item box button replicates osmo button 068 default variant", () => {
  const css = readFileSync(join(dir, "item-box-button.css"), "utf8");
  assert.match(css, /--button-068-color/);
  assert.ok(css.includes("--button-068-height: calc(1lh + 0.75em + 0.75em)"));
  const jsx = readFileSync(join(dir, "ItemBoxButton.jsx"), "utf8");
  assert.match(jsx, /data-button-068/);
  assert.match(jsx, /export function ItemBoxButtonPreview\(/);
  const snippets = readFileSync(join(dir, "item-box-button.snippets.js"), "utf8");
  assert.match(snippets, /export const ITEM_BOX_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "item-box"/);
});
