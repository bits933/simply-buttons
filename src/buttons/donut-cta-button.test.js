import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Donut studio CTA floods pink and rolls its letters", () => {
  const css = readFileSync(join(dir, "donut-cta-button.css"), "utf8");
  assert.match(css, /border: 2px solid #faff18/);
  assert.match(css, /border-radius: 999px/);
  assert.match(css, /background: #fc4ba7/);
  assert.match(css, /transform: scaleY\(0\)/);
  assert.match(css, /transform: scaleY\(1\)/);
  assert.match(css, /transform-origin: bottom center/);
  assert.match(css, /transition-delay: calc\(var\(--i\) \* 24ms\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "DonutCtaButton.jsx"), "utf8");
  assert.match(jsx, /data-donut-cta/);
  assert.match(jsx, /aria-label=\{label\}/);
  assert.match(jsx, /dc-letter__copy--alt/);
  assert.match(jsx, /"--i": i/);
  const snippets = readFileSync(join(dir, "donut-cta-button.snippets.js"), "utf8");
  assert.match(snippets, /export const DONUT_CTA_SNIPPETS = \{/);
  assert.match(snippets, /name:\s*"Funky reveal"/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  assert.match(snippets, /id: "donut-cta"/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "donut-cta"/);
});
