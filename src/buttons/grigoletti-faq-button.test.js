import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  GRIGOLETTI_FAQ_META,
  GRIGOLETTI_FAQ_SNIPPETS,
} from "./grigoletti-faq-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Grigoletti FAQ toggle has distinctive marker, accessible button contracts, and meta contracts", () => {
  const css = readFileSync(join(dir, "grigoletti-faq-button.css"), "utf8");
  assert.match(css, /\.gfaq-root/);
  assert.match(css, /\.gfaq-toggle-btn/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const jsx = readFileSync(join(dir, "GrigolettiFaqButton.jsx"), "utf8");
  assert.match(jsx, /data-grigoletti-faq/);
  assert.match(jsx, /gfaq-toggle-btn/);
  assert.match(jsx, /type="button"/);

  for (const [stack, snippet] of Object.entries(GRIGOLETTI_FAQ_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("gfaq-toggle-btn"), `${stack} missing marker gfaq-toggle-btn`);
  }

  assert.equal(GRIGOLETTI_FAQ_META.id, "grigoletti-faq");
  assert.ok(GRIGOLETTI_FAQ_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(GRIGOLETTI_FAQ_META.keywords.includes("animated button"));
  assert.ok(GRIGOLETTI_FAQ_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "grigoletti-faq"/g) ?? []).length, 1);
  assert.equal(
    (slots.match(/preview: GrigolettiFaqButtonPreview/g) ?? []).length,
    1,
  );
});
