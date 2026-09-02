import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const snippetsUrl = new URL("./codex-agent-button.snippets.js", import.meta.url);
const cssUrl = new URL("./codex-agent-button.css", import.meta.url);

test("ships a copyable Codex terminal button", async () => {
  assert.ok(existsSync(snippetsUrl), "missing Codex agent snippets");

  const { CODEX_AGENT_META, CODEX_AGENT_SNIPPETS } = await import(snippetsUrl);

  assert.equal(CODEX_AGENT_META.id, "codex-agent");

  for (const stack of ["html", "react", "node"]) {
    const snippet = CODEX_AGENT_SNIPPETS[stack];
    assert.match(snippet, /<button/);
    assert.match(snippet, /Run Codex/);
    assert.match(snippet, /(?:&gt;|>)_/);
    assert.match(snippet, /#1a1a1a/i);
    assert.match(snippet, /#ededed/i);
    assert.match(snippet, /#5cc2e0/i);
    assert.match(snippet, /shimmer/i);
    assert.match(snippet, /font-weight:\s*800/);
    assert.match(snippet, /:active\s*\{\s*transform:\s*scale\(\.98\)/);
    assert.match(snippet, /:focus-visible/);
    assert.match(snippet, /prefers-reduced-motion:\s*reduce/);
  }

  assert.match(CODEX_AGENT_SNIPPETS.node, /require\(["']node:http["']\)/);
  assert.match(CODEX_AGENT_SNIPPETS.node, /createServer/);
  assert.doesNotMatch(CODEX_AGENT_SNIPPETS.node, /express/i);
});

test("ships stable Codex motion with themed command surface", async () => {
  assert.ok(existsSync(cssUrl), "missing Codex agent CSS");
  const liveCss = readFileSync(cssUrl, "utf8");
  const { CODEX_AGENT_SNIPPETS } = await import(snippetsUrl);

  for (const [name, stylesheet] of [["live", liveCss], ...Object.entries(CODEX_AGENT_SNIPPETS)]) {
    const button = name === "live" ? "btn-codex-agent" : "codex-agent";
    const escapedButton = button.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const css = stylesheet.replace(/\\"/g, '"');
    assert.match(css, new RegExp(`\\.${escapedButton}\\s*\\{[^}]*height:\\s*48px`));
    assert.match(css, new RegExp(`\\.${escapedButton}\\s*\\{[^}]*--codex-agent-surface:\\s*#1a1a1a`));
    assert.match(css, new RegExp(`\\[data-theme="dark"\\]\\s+\\.${escapedButton}\\s*\\{[^}]*--codex-agent-surface:`));
    assert.match(css, /#353535/i);
    assert.match(css, new RegExp(`prefers-reduced-motion:\\s*reduce[\\s\\S]*\\.${escapedButton}__label[\\s\\S]*animation:\\s*none`));
  }
});

test("limits Codex motion to composited properties", async () => {
  const liveCss = readFileSync(cssUrl, "utf8");
  const { CODEX_AGENT_SNIPPETS } = await import(snippetsUrl);

  for (const [name, stylesheet] of [["live", liveCss], ...Object.entries(CODEX_AGENT_SNIPPETS)]) {
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
