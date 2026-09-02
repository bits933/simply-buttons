import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { OBYS_UNDERLINE_META, OBYS_UNDERLINE_SNIPPETS } from "./obys-underline-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Obys underline button draws in from the left and collapses to the right", () => {
  const css = readFileSync(join(dir, "obys-underline-button.css"), "utf8");
  assert.match(css, /--aw-mode-ink: 1/);
  assert.match(css, /height: 1\.34px/);
  assert.match(css, /transform: scaleX\(0\)/);
  assert.match(css, /transform-origin: right/);
  assert.match(css, /\.is-on::after\s*\{[\s\S]*?transform-origin: left/);
  assert.match(css, /800ms cubic-bezier\(0\.16, 1, 0\.3, 1\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  // No stage background: the button sits on the gallery well so it inherits the theme.
  assert.ok(!css.includes("background: #f2f0eb"), "obys-stage must not paint its own background");
  assert.ok(!/obys-stage\s*\{[^}]*background/.test(css), "obys-stage must not paint its own background");
  // Theme-aware ink: black on light, white on dark, all states driven by --obys-ink.
  assert.match(css, /--obys-ink: #0e0e0e/);
  assert.match(css, /\[data-theme="dark"\] \.obys-underline-root\s*\{[\s\S]*?--obys-ink: #ffffff/);
  assert.match(css, /color: color-mix\(in srgb, var\(--obys-ink, #0e0e0e\) 40%, transparent\)/);
  assert.match(css, /background: var\(--obys-ink, #0e0e0e\)/);
  const jsx = readFileSync(join(dir, "ObysUnderlineButton.jsx"), "utf8");
  assert.match(jsx, /data-obys-underline/);
  assert.match(jsx, /aria-pressed=\{i === mode\}/);
  assert.match(jsx, /"Vertical", "Horizontal", "Grid"/);
  for (const [stack, snippet] of Object.entries(OBYS_UNDERLINE_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-mode-ink"), `${stack} snippet missing marker`);
    assert.ok(snippet.includes("--obys-ink"), `${stack} snippet missing theme ink var`);
    assert.ok(!snippet.includes("#f2f0eb"), `${stack} snippet must not paint the stage background`);
  }
  assert.equal(OBYS_UNDERLINE_META.id, "aw-obys-underline");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-obys-underline"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: ObysUnderlineButtonPreview/g) ?? []).length, 1);
});
