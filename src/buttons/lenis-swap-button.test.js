import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { LENIS_SWAP_META, LENIS_SWAP_SNIPPETS } from "./lenis-swap-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Lenis swap button swaps labels with the rising fill wash", () => {
  const css = readFileSync(join(dir, "lenis-swap-button.css"), "utf8");
  assert.match(css, /--aw-lenis-wash: 1/);
  assert.doesNotMatch(css, /\.lenis-swap-root\s*\{[^}]*background:/);
  assert.match(css, /--lenis-pink: #ff98a2/);
  assert.match(css, /\.ls-wash\s*\{[\s\S]*?transform: scaleY\(0\)/);
  assert.match(css, /:hover \.ls-wash,\s*\n\.btn-lenis-swap:focus-visible \.ls-wash\s*\{[\s\S]*?transform-origin: bottom/);
  assert.match(css, /\.ls-visible\s*\{[\s\S]*?transform-origin: bottom/);
  assert.match(css, /600ms cubic-bezier\(0\.19, 1, 0\.22, 1\)/);
  assert.match(css, /border: 1px solid var\(--lenis-pink\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "LenisSwapButton.jsx"), "utf8");
  assert.match(jsx, /data-lenis-swap/);
  assert.match(jsx, /ls-visible/);
  assert.match(jsx, /ls-hidden/);
  assert.match(jsx, /ls-wash/);
  for (const [stack, snippet] of Object.entries(LENIS_SWAP_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-lenis-wash"), `${stack} snippet missing marker`);
    assert.ok(!snippet.includes("background: #121212;\n  border-radius: 8px"), `${stack} preview root must stay transparent`);
  }
  assert.equal(LENIS_SWAP_META.id, "aw-lenis-swap");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-lenis-swap"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: LenisSwapButtonPreview/g) ?? []).length, 1);
});

test("Lenis swap button inverts its monochrome surfaces in light mode", () => {
  const css = readFileSync(join(dir, "lenis-swap-button.css"), "utf8");
  assert.match(css, /\[data-theme="light"\] \.ls-base\s*\{[^}]*background: #121212;/);
  assert.match(css, /\[data-theme="light"\] \.ls-icon\s*\{[^}]*background: #f2f0ec;/);
});
