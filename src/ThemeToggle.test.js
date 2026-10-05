import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("theme toggle morphs a sun/moon icon and reveals the next theme from the control", async () => {
  const jsx = await readFile(new URL("./ThemeToggle.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("./index.css", import.meta.url), "utf8");

  assert.match(jsx, /startViewTransition/);
  assert.match(jsx, /flushSync/);
  assert.match(jsx, /theme-icon-snap/);
  assert.match(css, /theme-icon-snap/);
  assert.match(jsx, /prefers-reduced-motion: reduce/);
  assert.match(jsx, /data-icon=\{icon\}/);
  assert.match(jsx, /theme-icon-cut/);
  assert.match(jsx, /theme-icon-rays/);
  assert.match(jsx, /theme-icon-disc/);
  assert.match(jsx, /getBoundingClientRect/);
  assert.match(jsx, /aria-pressed=\{theme === "dark"\}/);
  assert.match(css, /::view-transition-new\(root\)/);
  assert.match(css, /theme-circle-reveal/);
  assert.match(css, /clip-path:\s*circle\(18px at var\(--theme-x\) var\(--theme-y\)\)/);
  assert.match(css, /clip-path:\s*circle\(var\(--theme-r\) at var\(--theme-x\) var\(--theme-y\)\)/);
  assert.match(css, /\.theme-toggle\[data-icon="moon"\] \.theme-icon-cut/);
  assert.match(css, /\.theme-toggle\[data-icon="sun"\] \.theme-icon-rays/);
  assert.match(css, /@keyframes theme-circle-reveal/);
  assert.doesNotMatch(jsx, /from "@phosphor-icons\/react"/);
});
