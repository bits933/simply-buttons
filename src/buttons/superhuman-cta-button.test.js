import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";

const snippetsUrl = new URL("./superhuman-cta-button.snippets.js", import.meta.url);

test("ships a copyable Superhuman CTA with a fixed arrow-tile hover interaction", async () => {
  assert.ok(existsSync(snippetsUrl), "missing Superhuman CTA snippets");

  const { SUPERHUMAN_CTA_META, SUPERHUMAN_CTA_SNIPPETS } = await import(snippetsUrl);

  assert.equal(SUPERHUMAN_CTA_META.id, "superhuman-cta");
  assert.equal(SUPERHUMAN_CTA_META.name, "Superhuman CTA");
  for (const stack of ["html", "react", "node"]) {
    assert.match(SUPERHUMAN_CTA_SNIPPETS[stack], /Get Superhuman/);
    assert.match(SUPERHUMAN_CTA_SNIPPETS[stack], /<button/);
    assert.match(SUPERHUMAN_CTA_SNIPPETS[stack], /translate:\s*4px/);
  }
  assert.match(SUPERHUMAN_CTA_SNIPPETS.html, /font-weight:\s*460/);
  assert.match(SUPERHUMAN_CTA_SNIPPETS.html, /line-height:\s*1\.2/);
});

test("the copied button scales inward only while pressed", async () => {
  const { SUPERHUMAN_CTA_META, SUPERHUMAN_CTA_SNIPPETS } = await import(snippetsUrl);

  assert.match(SUPERHUMAN_CTA_META.states, /active/);
  for (const stack of ["html", "react", "node"]) {
    assert.match(SUPERHUMAN_CTA_SNIPPETS[stack], /transition:\s*transform 120ms/);
    assert.match(SUPERHUMAN_CTA_SNIPPETS[stack], /:active\s*\{\s*transform:\s*scale\(\.98\)/);
  }
});
