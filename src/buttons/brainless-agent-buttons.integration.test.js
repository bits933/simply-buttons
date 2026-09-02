import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  CLAUDE_CODE_META,
  CLAUDE_CODE_SNIPPETS,
} from "./claude-code-button.snippets.js";

const buttons = [
  {
    meta: CLAUDE_CODE_META,
    snippets: CLAUDE_CODE_SNIPPETS,
    label: "Ask Claude",
    preview: "ClaudeCodeButtonPreview",
    snippetsExport: "CLAUDE_CODE_SNIPPETS",
  },
];

test("registers the Brainless agent buttons as searchable gallery slots", async () => {
  assert.deepEqual(buttons.map(({ meta }) => meta.id), ["claude-code"]);
  assert.deepEqual(buttons.map(({ meta }) => meta.name), ["Claude Code"]);
  assert.equal(new Set(buttons.map(({ meta }) => meta.id)).size, buttons.length);
  assert.equal(new Set(buttons.map(({ meta }) => meta.name)).size, buttons.length);

  for (const { meta, snippets, label } of buttons) {
    assert.ok(meta.keywords.length >= 8, `${meta.name} needs at least eight search keywords`);
    for (const [stack, snippet] of Object.entries(snippets)) {
      assert.ok(snippet.includes(label), `${meta.name} ${stack} snippet is missing ${label}`);
    }
    assert.match(snippets.node, /node:http/);
    assert.doesNotMatch(snippets.node, /express/i);
  }

  const slots = await readFile(new URL("../slots.js", import.meta.url), "utf8");
  const ids = buttons.map(({ meta }) => `id: "${meta.id}"`);
  assert.deepEqual(ids.map((id) => slots.indexOf(id)), [...ids.map((id) => slots.indexOf(id))].sort((a, b) => a - b));

  for (const { meta, preview, snippetsExport } of buttons) {
    assert.equal((slots.match(new RegExp(`id: "${meta.id}"`, "g")) ?? []).length, 1);
    assert.equal((slots.match(new RegExp(`preview: ${preview}`, "g")) ?? []).length, 1);
    assert.equal((slots.match(new RegExp(`snippets: ${snippetsExport}`, "g")) ?? []).length, 1);
  }

  assert.doesNotMatch(slots, /id: "codex-agent"/);
  assert.doesNotMatch(slots, /id: "grok-agent"/);
});

test("ships the requested left marks without right-side status icons", async () => {
  const [claude, codex, grok, claudeCss, codexCss] = await Promise.all([
    readFile(new URL("./ClaudeCodeButton.jsx", import.meta.url), "utf8"),
    readFile(new URL("./CodexAgentButton.jsx", import.meta.url), "utf8"),
    readFile(new URL("./GrokAgentButton.jsx", import.meta.url), "utf8"),
    readFile(new URL("./claude-code-button.css", import.meta.url), "utf8"),
    readFile(new URL("./codex-agent-button.css", import.meta.url), "utf8"),
  ]);

  assert.match(claude, /btn-claude-code__mascot/);
  assert.match(claude, /M303\.969 378\.747L975\.937 378\.742/);
  assert.match(claude, /fill="#D87757"/);
  assert.match(claude, /fill="#090A0A"/);
  assert.match(claudeCss, /path:nth-child\(1\)/);
  assert.doesNotMatch(claude, /btn-claude-code__sparkle/);

  assert.match(codexCss, /\.btn-codex-agent__mark\s*\{[^}]*font-weight:\s*800/);
  assert.doesNotMatch(codex, /btn-codex-agent__status/);

  assert.match(grok, /<path/);
  assert.doesNotMatch(grok, /btn-grok-agent__event/);
});
