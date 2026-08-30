import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Icon sweep button replicates osmo button 043 default variant", () => {
  const css = readFileSync(join(dir, "icon-sweep-button.css"), "utf8");
  assert.match(css, /--button-043-color/);
  assert.ok(css.includes("button-043__bg-hover"));
  const jsx = readFileSync(join(dir, "IconSweepButton.jsx"), "utf8");
  assert.match(jsx, /data-button-043/);
  assert.match(jsx, /export function IconSweepButtonPreview\(/);
  const snippets = readFileSync(join(dir, "icon-sweep-button.snippets.js"), "utf8");
  assert.match(snippets, /export const ICON_SWEEP_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "icon-sweep"/);
});
