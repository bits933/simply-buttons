import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Explore now button slides into its black offset block on click", () => {
  const css = readFileSync(join(dir, "explore-now-button.css"), "utf8");
  assert.match(css, /#ffd23f/);
  assert.match(css, /translate: 8px 10px/);
  assert.match(css, /is--pressed/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "ExploreNowButton.jsx"), "utf8");
  assert.match(jsx, /data-explore-now/);
  assert.match(jsx, /setTimeout\(\(\) => setPressed\(false\), 220\)/);
  assert.match(jsx, /export function ExploreNowButtonPreview\(/);
  const snippets = readFileSync(join(dir, "explore-now-button.snippets.js"), "utf8");
  assert.match(snippets, /export const EXPLORE_NOW_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "explore-now"/);
});
