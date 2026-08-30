import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("tetris stack button replicates the staggered block fill and 3d text flip", () => {
  const css = readFileSync(join(dir, "tetris-stack-button.css"), "utf8");
  assert.match(css, /--button-036-color-background:\s*#5a45e0/);
  assert.match(css, /--button-036-hover-color-background:\s*#ffd23f/);
  assert.doesNotMatch(css, /#f84131/, "must not reuse the halo red");
  assert.match(css, /scale:\s*1 0/);
  assert.match(css, /scale:\s*1 1/);
  assert.match(css, /calc\(var\(--index\) \* 0\.049s \+ 0\.05s\)/);
  assert.match(css, /transform-origin: center var\(--button-036-hover-bg-origin-y\)/);
  assert.match(css, /rotateX\(calc\(var\(--button-036-hover-text-move-y\) \* 90deg\)\)/);
  assert.match(css, /perspective\(10em\)/);
  assert.match(css, /inset:\s*-1px/);
  assert.match(css, /prefers-reduced-motion: no-preference/);
});

test("tetris stack button component renders five staggered spans", () => {
  const jsx = readFileSync(join(dir, "TetrisStackButton.jsx"), "utf8");
  assert.match(jsx, /data-button-036/);
  assert.match(jsx, /SPAN_INDEXES = \[0, 1, 2, 3, 4\]/);
  assert.match(jsx, /"--index": index/);
  assert.match(jsx, /button-036__bg-span/);
  assert.match(jsx, /export function TetrisStackButtonPreview\(/);
});

test("tetris stack button ships three self-contained snippets and one final slot", () => {
  const snippets = readFileSync(join(dir, "tetris-stack-button.snippets.js"), "utf8");
  assert.match(snippets, /export const TETRIS_STACK_SNIPPETS = \{/);
  assert.match(snippets, /html: HTML_PAGE/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  assert.match(snippets, /export const TETRIS_STACK_META = \{/);
  assert.match(snippets, /id: "tetris-stack"/);
  assert.doesNotMatch(snippets, /data-tabs-tab/, "single card, no variant toolbar");

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.match(slots, /import \{ TetrisStackButtonPreview \} from "\.\/buttons\/TetrisStackButton\.jsx"/);
  const tetris = slots.indexOf('id: "tetris-stack"');
  const osmoIcon = slots.indexOf('id: "osmo-003-icon"');
  assert.ok(osmoIcon > -1, "osmo-003-icon must exist before tetris-stack");
  assert.ok(tetris > osmoIcon, "tetris-stack must be appended after osmo-003-icon");
  assert.ok(
    slots.indexOf('id: "diagonal-reveal"') > tetris,
    "later buttons must follow tetris-stack"
  );
});
