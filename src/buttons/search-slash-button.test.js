import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { SEARCH_SLASH_META, SEARCH_SLASH_SNIPPETS } from "./search-slash-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Search slash button expands into a search bar with a slash keycap", () => {
  const css = readFileSync(join(dir, "search-slash-button.css"), "utf8");
  assert.match(css, /\.btn-search-slash\[data-open="true"\] \{[\s\S]*?width: 15em/);
  assert.match(css, /\.ss-kbd \{[\s\S]*?monospace/);
  assert.match(css, /\.ss-input \{[\s\S]*?opacity: 0/);
  assert.match(css, /transition: width 450ms/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "SearchSlashButton.jsx"), "utf8");
  assert.match(jsx, /data-search-slash/);
  assert.match(jsx, /event\.key === "\/"/);
  assert.match(jsx, /event\.key === "Escape"/);
  assert.match(jsx, /type="button"/);
  for (const [stack, snippet] of Object.entries(SEARCH_SLASH_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("--ss-open"), `${stack} snippet missing marker`);
    assert.ok(snippet.includes("Escape"), `${stack} must collapse on Escape`);
  }
  assert.equal(SEARCH_SLASH_META.id, "search-slash");
  assert.ok(SEARCH_SLASH_META.keywords.length >= 17, "keywords contract");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "search-slash"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: SearchSlashButtonPreview/g) ?? []).length, 1);
});
