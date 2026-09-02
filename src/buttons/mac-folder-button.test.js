import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Mac folder button opens with reversible spring-like motion", () => {
  const css = readFileSync(join(dir, "mac-folder-button.css"), "utf8");
  assert.match(css, /perspective: 600px/);
  assert.match(css, /rotateX\(-10deg\)/);
  assert.match(css, /--dx/);
  assert.match(css, /--dy/);
  assert.match(css, /--rot/);
  assert.match(css, /transition: transform var\(--d, 560ms\) cubic-bezier\(0.34, 1.3, 0.64, 1\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "MacFolderButton.jsx"), "utf8");
  assert.match(jsx, /data-mac-folder/);
  assert.match(jsx, /data-phase=\{phase\}/);
  assert.match(jsx, /aria-expanded=\{phase === "open"\}/);
  assert.match(jsx, /setPhase\(\(p\) => \(p === "open" \? "closed" : "open"\)\)/);
  assert.match(jsx, /className="mf-paper"/);
  assert.match(jsx, /#0a67d6/);
  const snippets = readFileSync(join(dir, "mac-folder-button.snippets.js"), "utf8");
  assert.match(snippets, /export const MAC_FOLDER_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  assert.match(snippets, /id: "mac-folder"/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "mac-folder"/);
});
