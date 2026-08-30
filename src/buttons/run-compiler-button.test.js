import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Run compiler button ships terminal typing, block loader, and compiled states", () => {
  const css = readFileSync(join(dir, "run-compiler-button.css"), "utf8");
  assert.match(css, /btn-run-compiler-blink/);
  assert.match(css, /IBM Plex Mono/);
  assert.match(css, /--i\) \* 110ms/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "RunCompilerButton.jsx"), "utf8");
  assert.match(jsx, /data-run-compiler/);
  assert.match(jsx, /is--loading/);
  assert.match(jsx, /is--texted/);
  assert.match(jsx, /export function RunCompilerButtonPreview\(/);
  const snippets = readFileSync(join(dir, "run-compiler-button.snippets.js"), "utf8");
  assert.match(snippets, /export const RUN_COMPILER_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "run-compiler"/);
});
