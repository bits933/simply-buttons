import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("gallery is flat and the top bar exposes a search control", async () => {
  const app = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("./index.css", import.meta.url), "utf8");
  const slots = await readFile(new URL("./slots.js", import.meta.url), "utf8");

  assert.match(slots, /export const SLOTS = CATEGORIES\.flatMap/);
  assert.match(app, /MagnifyingGlass/);
  assert.match(app, /aria-label="Search specimens"/);
  assert.match(app, /useState/);
  assert.match(app, /placeholder="Search for your button"/);
  assert.match(app, /aria-expanded=\{searchOpen\}/);
  assert.match(app, /<button[\s\S]*?<input/);
  assert.match(app, /useRef/);
  assert.match(app, /searchInputRef\.current\?\.focus\(\)/);
  assert.match(app, /onBlur=/);
  assert.match(app, /setSearchOpen\(false\)/);
  assert.match(app, /event\.key === "Escape"/);
  assert.match(app, /filterSlots/);
  assert.match(app, /visible\.map/);
  assert.match(app, /Seo/);
  assert.doesNotMatch(app, /top-nav/);
  assert.doesNotMatch(app, /family-head/);
  assert.match(css, /\.search-button/);
  assert.match(css, /\.search\.is-open \.search-input/);
  assert.doesNotMatch(css, /\.family-head\s*\{/);
});
