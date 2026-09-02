import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const snippetsUrl = new URL("./claude-code-button.snippets.js", import.meta.url);
const cssUrl = new URL("./claude-code-button.css", import.meta.url);

test("ships a copyable Claude Code terminal button", async () => {
  assert.ok(existsSync(snippetsUrl), "missing Claude Code snippets");

  const { CLAUDE_CODE_META, CLAUDE_CODE_SNIPPETS } = await import(snippetsUrl);

  assert.equal(CLAUDE_CODE_META.id, "claude-code");
  assert.match(CLAUDE_CODE_META.states, /hover/);
  assert.match(CLAUDE_CODE_META.states, /active/);
  assert.match(CLAUDE_CODE_META.states, /focus-visible/);
  assert.match(CLAUDE_CODE_META.states, /reduced motion/);

  for (const stack of ["html", "react", "node"]) {
    const snippet = CLAUDE_CODE_SNIPPETS[stack];
    assert.match(snippet, /<button/);
    assert.match(snippet, /Ask Claude/);
    assert.match(snippet, /#cd694a/i);
    assert.match(snippet, /claude-code__mascot/);
    assert.match(snippet, /claude-code__canvas/);
    assert.match(snippet, /webgl/i);
    assert.match(snippet, /#D87757/i);
    assert.match(snippet, /#090A0A/i);
    assert.match(snippet, /animation:/);
    assert.match(snippet, /:active\s*\{\s*transform:\s*scale\(\.98\)/);
    assert.match(snippet, /:focus-visible/);
    assert.match(snippet, /prefers-reduced-motion:\s*reduce/);
  }
});

test("ships scoped themes and stops every decorative motion when reduced", async () => {
  assert.ok(existsSync(cssUrl), "missing Claude Code CSS");
  const liveCss = readFileSync(cssUrl, "utf8");
  const { CLAUDE_CODE_SNIPPETS } = await import(snippetsUrl);

  for (const [name, stylesheet] of [["live", liveCss], ...Object.entries(CLAUDE_CODE_SNIPPETS)]) {
    const button = name === "live" ? "btn-claude-code" : "claude-code";
    const escapedButton = button.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const css = stylesheet.replace(/\\"/g, '"');
    assert.match(css, new RegExp(`\\.${escapedButton}\\s*\\{[^}]*--claude-code-surface:`));
    assert.match(css, new RegExp(`\\[data-theme="dark"\\]\\s+\\.${escapedButton}\\s*\\{[^}]*--claude-code-surface:`));
    assert.match(css, new RegExp(`prefers-reduced-motion:\\s*reduce[\\s\\S]*\\.${escapedButton}[\\s\\S]*animation:\\s*none`));
  }
});

test("limits Claude motion to composited properties", async () => {
  const liveCss = readFileSync(cssUrl, "utf8");
  const { CLAUDE_CODE_SNIPPETS } = await import(snippetsUrl);

  for (const [name, stylesheet] of [["live", liveCss], ...Object.entries(CLAUDE_CODE_SNIPPETS)]) {
    const css = stylesheet.replace(/\\"/g, '"');
    const transitions = css.match(/transition(?:-property)?\s*:[^;}]+/g) ?? [];
    const keyframes = css.match(/@keyframes\s+[\w-]+\s*\{(?:[^{}]|\{[^{}]*\})*\}/g) ?? [];

    for (const transition of transitions) {
      assert.doesNotMatch(transition, /\b(?:color|border-color|filter)\b/, `${name} transitions a disallowed property`);
    }
    for (const keyframe of keyframes) {
      assert.doesNotMatch(keyframe, /\b(?:color|border-color|filter)\s*:/, `${name} animates a disallowed property`);
    }
  }
});

test("ships a dependency-free Node page server", async () => {
  const { CLAUDE_CODE_SNIPPETS } = await import(snippetsUrl);
  const node = CLAUDE_CODE_SNIPPETS.node;

  assert.match(node, /node:http/);
  assert.match(node, /createServer/);
  assert.match(node, /Content-Type.*text\/html/);
  assert.match(node, /PAGE|page/);
  assert.match(node, /3000/);
  assert.doesNotMatch(node, /express/i);
});
