import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Pangeam elastic bend button replicates Sasha Martynchuk kinetic character wave", () => {
  const css = readFileSync(join(dir, "pangeam-bend-button.css"), "utf8");
  assert.match(css, /font-family:\s*"Arges"/);
  assert.match(css, /--pangeam-ink/);
  assert.match(css, /pangeam-bend__char/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const jsx = readFileSync(join(dir, "PangeamBendButton.jsx"), "utf8");
  assert.match(jsx, /data-pangeam-bend/);
  assert.match(jsx, /RADIUS_FACTOR = 1.75/);
  assert.match(jsx, /BASE_STIFFNESS = 0.135/);
  assert.match(jsx, /DAMPING = 0.8/);
  assert.match(jsx, /export function PangeamBendButtonPreview\(/);

  const snippets = readFileSync(join(dir, "pangeam-bend-button.snippets.js"), "utf8");
  assert.match(snippets, /export const PANGEAM_BEND_SNIPPETS = \{/);
  assert.match(snippets, /export const PANGEAM_BEND_META = \{/);
  assert.match(snippets, /name:\s*"Hover dynamic"/);
  assert.match(snippets, /node: `const express = require\("express"\)/);

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "pangeam-bend"/);
});
