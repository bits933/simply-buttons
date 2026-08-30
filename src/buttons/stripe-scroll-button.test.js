import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Stripe scroll button replicates osmo button 085 default variant", () => {
  const css = readFileSync(join(dir, "stripe-scroll-button.css"), "utf8");
  assert.match(css, /--button-085-color/);
  assert.ok(css.includes("button-085-background-scroll"));
  const jsx = readFileSync(join(dir, "StripeScrollButton.jsx"), "utf8");
  assert.match(jsx, /data-button-085/);
  assert.match(jsx, /export function StripeScrollButtonPreview\(/);
  const snippets = readFileSync(join(dir, "stripe-scroll-button.snippets.js"), "utf8");
  assert.match(snippets, /export const STRIPE_SCROLL_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "stripe-scroll"/);
});
