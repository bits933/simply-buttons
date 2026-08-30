import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("Online status button morphs dot to cross on click", () => {
  const css = readFileSync(join(dir, "online-status-button.css"), "utf8");
  assert.match(css, /--accent/);
  assert.match(css, /btn-online-status-pulse/);
  assert.match(css, /stroke-dashoffset: 100/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "OnlineStatusButton.jsx"), "utf8");
  assert.match(jsx, /data-online-status/);
  assert.match(jsx, /aria-checked/);
  assert.match(jsx, /is--offline/);
  assert.match(jsx, /export function OnlineStatusButtonPreview\(/);
  const snippets = readFileSync(join(dir, "online-status-button.snippets.js"), "utf8");
  assert.match(snippets, /export const ONLINE_STATUS_SNIPPETS = \{/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /id: "online-status"/);
});
