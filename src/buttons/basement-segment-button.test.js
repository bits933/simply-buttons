import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { BASEMENT_SEGMENT_META, BASEMENT_SEGMENT_SNIPPETS } from "./basement-segment-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Basement segment button glides its indicator between the two options", () => {
  const css = readFileSync(join(dir, "basement-segment-button.css"), "utf8");
  assert.match(css, /--aw-segment-flip: 1/);
  assert.match(css, /border-radius: 999px/);
  assert.match(css, /transform: translateX\(calc\(var\(--active\) \* 100%\)\)/);
  assert.match(css, /420ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.match(css, /#ff4d00/);
  assert.match(css, /\.is-active\s*\{[\s\S]*?color: #ff4d00/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "BasementSegmentButton.jsx"), "utf8");
  assert.match(jsx, /data-basement-segment/);
  assert.match(jsx, /data-active=\{active\}/);
  assert.match(jsx, /aria-pressed=\{i === active\}/);
  assert.match(jsx, /bs-indicator/);
  assert.match(jsx, /"Human", "Machine"/);
  for (const [stack, snippet] of Object.entries(BASEMENT_SEGMENT_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-segment-flip"), `${stack} snippet missing marker`);
  }
  assert.equal(BASEMENT_SEGMENT_META.id, "aw-basement-segment");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-basement-segment"/g) ?? []).length, 0);
  assert.equal((slots.match(/preview: BasementSegmentButtonPreview/g) ?? []).length, 0);
});
