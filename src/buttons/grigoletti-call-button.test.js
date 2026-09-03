import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  GRIGOLETTI_CALL_META,
  GRIGOLETTI_CALL_SNIPPETS,
} from "./grigoletti-call-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Grigoletti call has distinctive marker, accessible button contracts, and meta contracts", () => {
  const css = readFileSync(join(dir, "grigoletti-call-button.css"), "utf8");
  assert.match(css, /\.gc-root/);
  assert.match(css, /\.gc-call-btn/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const jsx = readFileSync(join(dir, "GrigolettiCallButton.jsx"), "utf8");
  assert.match(jsx, /data-grigoletti-call/);
  assert.match(jsx, /gc-call-btn/);
  assert.match(jsx, /type="button"/);

  for (const [stack, snippet] of Object.entries(GRIGOLETTI_CALL_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("gc-call-btn"), `${stack} missing marker gc-call-btn`);
  }

  assert.equal(GRIGOLETTI_CALL_META.id, "grigoletti-call");
  assert.ok(GRIGOLETTI_CALL_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(GRIGOLETTI_CALL_META.keywords.includes("animated button"));
  assert.ok(GRIGOLETTI_CALL_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "grigoletti-call"/g) ?? []).length, 1);
  assert.equal(
    (slots.match(/preview: GrigolettiCallButtonPreview/g) ?? []).length,
    1,
  );
});
