import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const componentPath = join(directory, "PixelRippleButton.tsx");
const snippetsPath = join(directory, "pixel-ripple-button.snippets.js");

test("registers the pixel ripple button in the gallery", () => {
  const slots = readFileSync(join(directory, "..", "slots.js"), "utf8");

  assert.match(slots, /PixelRipplePreview/);
  assert.match(slots, /PIXEL_RIPPLE_META/);
  assert.match(slots, /PIXEL_RIPPLE_SNIPPETS/);
  assert.match(slots, /id: "pixel-ripple"/);
});

test("ships a canvas pixel pill with pointer trails and overlapping click ripples", () => {
  assert.ok(existsSync(componentPath), "missing PixelRippleButton.tsx");
  const component = readFileSync(componentPath, "utf8");

  assert.match(component, /label = "Get started"/);
  assert.match(component, /onClick\?: \(\) => void/);
  assert.match(component, /const COLUMNS = 42/);
  assert.match(component, /const ROWS = 13/);
  assert.match(component, /const RIPPLE_SPEED = 0\.48/);
  assert.match(component, /<canvas/);
  assert.match(component, /context\.roundRect/);
  assert.match(component, /context\.clip\(\)/);
  assert.match(component, /requestAnimationFrame/);
  assert.match(component, /cancelAnimationFrame/);
  assert.match(component, /cancelAnimationFrame\(frameRef\.current\);\s*frameRef\.current = 0;/);
  assert.match(component, /ResizeObserver/);
  assert.match(component, /onPointerMove/);
  assert.match(component, /onPointerDown/);
  assert.match(component, /onPointerLeave/);
  assert.match(component, /onKeyDown/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /aria-label=\{label\}/);
  assert.match(component, /onClick=\{onClick\}/);
  assert.match(component, /const TOP_CYAN = \[63, 210, 237\]/);
  assert.match(component, /const BOTTOM_CYAN = \[25, 165, 192\]/);
  assert.match(component, /background:#0e5369/);
  assert.match(component, /function addLift\(base: number\[\], amount: number\)/);
  assert.match(component, /scale\(\.98\)/);
});

test("exposes the pixel ripple component and gallery metadata", () => {
  assert.ok(existsSync(snippetsPath), "missing pixel ripple snippets");
  const snippets = readFileSync(snippetsPath, "utf8");

  assert.match(snippets, /id: "pixel-ripple"/);
  assert.match(snippets, /name: "Pixel ripple"/i);
  assert.match(snippets, /states: ".*hover trail.*click ripple.*reduced motion/i);
  assert.match(snippets, /"canvas"/);
  assert.match(snippets, /"pointer ripple"/);
  assert.match(snippets, /"cyan button"/);
  assert.match(snippets, /import REACT from "\.\/PixelRippleButton\.tsx\?raw"/);
  assert.match(snippets, /react: REACT/);
});
