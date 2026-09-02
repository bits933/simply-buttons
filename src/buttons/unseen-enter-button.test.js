import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { UNSEEN_ENTER_META, UNSEEN_ENTER_SNIPPETS } from "./unseen-enter-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Unseen enter button sweeps a fill up while the label rolls", () => {
  const css = readFileSync(join(dir, "unseen-enter-button.css"), "utf8");
  assert.match(css, /--aw-enter-sweep: 1/);
  assert.match(css, /\.ue-fill\s*\{[\s\S]*?translateY\(102%\)/);
  assert.match(css, /:hover \.ue-fill,\s*\n\.btn-unseen-enter:focus-visible \.ue-fill\s*\{\s*transform: translateY\(0\)/);
  assert.match(css, /cubic-bezier\(0\.65, 0, 0\.35, 1\)/);
  assert.match(css, /700ms/);
  assert.match(css, /\.ue-label:not\(\.ue-label--clone\)/);
  assert.match(css, /\.ue-label--clone\s*\{[\s\S]*?color: #edc1cb/);
  assert.match(css, /:focus-visible \.ue-label:not\(\.ue-label--clone\)\s*\{[\s\S]*?color: #edc1cb/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /#edc1cb/);
  const jsx = readFileSync(join(dir, "UnseenEnterButton.jsx"), "utf8");
  assert.match(jsx, /data-unseen-enter/);
  assert.match(jsx, /ue-label--clone/);
  assert.match(jsx, /type="button"/);
  for (const [stack, snippet] of Object.entries(UNSEEN_ENTER_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-enter-sweep"), `${stack} snippet missing marker`);
  }
  assert.equal(UNSEEN_ENTER_META.id, "aw-unseen-enter");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-unseen-enter"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: UnseenEnterButtonPreview/g) ?? []).length, 1);
});
