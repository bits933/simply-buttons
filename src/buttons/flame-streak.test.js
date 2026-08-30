import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { FLAME_STREAK_LABEL, FLAME_STREAK_OPTIONS } from "./flame-streak.js";
import { FLAME_STREAK_META, FLAME_STREAK_SNIPPETS } from "./flame-streak.snippets.js";

const directory = dirname(fileURLToPath(import.meta.url));

test("ships a Helvetica Great Streak button with fire on the pill", () => {
  const component = readFileSync(join(directory, "FlameStreakButton.jsx"), "utf8");
  const css = readFileSync(join(directory, "flame-streak.css"), "utf8");
  const wrap = readFileSync(join(directory, "..", "components", "canvasui", "FlameWrap.jsx"), "utf8");

  assert.equal(FLAME_STREAK_LABEL, "Great Streak!");
  assert.match(component, /<button\b[\s\S]*?type="button"/);
  assert.match(component, /🔥/);
  assert.match(component, /FlameWrap/);
  assert.match(component, /from "\.\.\/components\/canvasui\/FlameWrap\.jsx"/);
  assert.match(css, /Helvetica Neue.+Helvetica.+Arial.+sans-serif/);
  assert.match(css, /linear-gradient\(180deg, #ffe7c4/);
  assert.match(css, /canvas\[aria-hidden\][\s\S]*z-index:\s*2/);
  assert.match(css, /z-index:\s*0/);
  assert.doesNotMatch(css, /Georgia|Palatino|font-style:\s*italic/);
  assert.match(wrap, /zIndex:\s*2/);
});

test("uses Canvas UI flame wrap options and engine", () => {
  const engine = join(directory, "..", "components", "canvasui", "flame-wrap-engine.js");
  const wrap = join(directory, "..", "components", "canvasui", "FlameWrap.jsx");
  assert.ok(existsSync(engine), "missing flame-wrap-engine.js");
  assert.ok(existsSync(wrap), "missing FlameWrap.jsx");
  assert.equal(FLAME_STREAK_OPTIONS.color.length, 3);
  assert.ok(FLAME_STREAK_OPTIONS.color[0] > 0.9);
  assert.ok(FLAME_STREAK_OPTIONS.color[1] > 0.4);
  assert.match(readFileSync(engine, "utf8"), /export function createFlameWrap/);
});

test("copy-paste stacks match the preview", () => {
  assert.equal(FLAME_STREAK_META.id, "flame-streak");
  assert.equal(FLAME_STREAK_META.name, "Flame streak");
  assert.ok(FLAME_STREAK_META.keywords.length >= 17);
  assert.ok(FLAME_STREAK_META.keywords.includes("animated button"));
  assert.ok(FLAME_STREAK_META.keywords.includes("interactive button"));

  for (const snippet of Object.values(FLAME_STREAK_SNIPPETS)) {
    assert.match(snippet, /<button\b[\s\S]*?type=\\?["']button\\?["']/);
    assert.match(snippet, /Great Streak!/);
    assert.match(snippet, /🔥/);
    assert.match(snippet, /btn-fstreak-btn/);
    assert.match(snippet, /flame-wrap-engine\.js/);
    assert.match(snippet, /Helvetica Neue.+Helvetica.+Arial.+sans-serif/);
    assert.match(snippet, /z-index:2|zIndex: 2/);
    assert.match(snippet, /#ffe7c4/);
    assert.match(snippet, /createFlameWrap/);
    assert.match(snippet, /prefers-reduced-motion/);
  }
});
