import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const snippetsUrl = new URL("./grok-agent-button.snippets.js", import.meta.url);
const cssUrl = new URL("./grok-agent-button.css", import.meta.url);

test("ships a copyable Grok dot-matrix button", async () => {
  assert.ok(existsSync(snippetsUrl), "missing Grok agent snippets");

  const { GROK_AGENT_META, GROK_AGENT_SNIPPETS } = await import(snippetsUrl);

  assert.equal(GROK_AGENT_META.id, "grok-agent");

  for (const stack of ["html", "react", "node"]) {
    const snippet = GROK_AGENT_SNIPPETS[stack];
    assert.match(snippet, /<button/);
    assert.match(snippet, /Ask Grok/);
    assert.match(snippet, /(svg|dot)/i);
    assert.match(snippet, /#1a1a1a/i);
    assert.match(snippet, /#505058/i);
    assert.match(snippet, /#e0af68/i);
    assert.match(snippet, /(shimmer|scan)/i);
    assert.match(snippet, /:active\s*\{\s*transform:\s*scale\(\.98\)/);
    assert.match(snippet, /:focus-visible/);
    assert.match(snippet, /prefers-reduced-motion:\s*reduce/);
  }

  assert.match(GROK_AGENT_SNIPPETS.node, /require\(["']node:http["']\)/);
  assert.match(GROK_AGENT_SNIPPETS.node, /createServer/);
  assert.doesNotMatch(GROK_AGENT_SNIPPETS.node, /express/i);
});

test("ships stable Grok motion with scoped light and dark tokens", async () => {
  assert.ok(existsSync(cssUrl), "missing Grok agent CSS");
  const liveCss = readFileSync(cssUrl, "utf8");
  const { GROK_AGENT_SNIPPETS } = await import(snippetsUrl);

  for (const [name, stylesheet] of [["live", liveCss], ...Object.entries(GROK_AGENT_SNIPPETS)]) {
    const button = name === "live" ? "btn-grok-agent" : "grok-agent";
    const escapedButton = button.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const css = stylesheet.replace(/\\"/g, '"');
    assert.match(css, new RegExp(`\\.${escapedButton}\\s*\\{[^}]*height:\\s*48px`));
    assert.match(css, new RegExp(`\\.${escapedButton}\\s*\\{[^}]*--grok-agent-surface:\\s*#1a1a1a`));
    assert.match(css, new RegExp(`\\[data-theme="dark"\\]\\s+\\.${escapedButton}\\s*\\{[^}]*--grok-agent-surface:`));
    assert.match(css, /#2f2f33/i);
    assert.match(css, /stroke-dasharray/i);
    assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*animation:\s*none/);
    assert.doesNotMatch(css, /transition:\s*[^;}]*border-color/i);
    assert.doesNotMatch(css, /__event/);
    assert.match(css, new RegExp(`prefers-reduced-motion:\\s*reduce[\\s\\S]*\\.${escapedButton}__mark::after[\\s\\S]*animation:\\s*none`));
  }
});
