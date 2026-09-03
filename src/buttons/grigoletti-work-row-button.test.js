import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  GRIGOLETTI_WORK_ROW_META,
  GRIGOLETTI_WORK_ROW_SNIPPETS,
} from "./grigoletti-work-row-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Grigoletti work row has distinctive marker, accessible button contracts, and meta contracts", () => {
  const css = readFileSync(join(dir, "grigoletti-work-row-button.css"), "utf8");
  assert.match(css, /\.gwr-root/);
  assert.match(css, /\.gwr-work-btn/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const jsx = readFileSync(join(dir, "GrigolettiWorkRowButton.jsx"), "utf8");
  assert.match(jsx, /data-grigoletti-work-row/);
  assert.match(jsx, /gwr-work-btn/);
  assert.match(jsx, /type="button"/);

  for (const [stack, snippet] of Object.entries(GRIGOLETTI_WORK_ROW_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("gwr-work-btn"), `${stack} missing marker gwr-work-btn`);
  }

  assert.equal(GRIGOLETTI_WORK_ROW_META.id, "grigoletti-work-row");
  assert.ok(GRIGOLETTI_WORK_ROW_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(GRIGOLETTI_WORK_ROW_META.keywords.includes("animated button"));
  assert.ok(GRIGOLETTI_WORK_ROW_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "grigoletti-work-row"/g) ?? []).length, 1);
  assert.equal(
    (slots.match(/preview: GrigolettiWorkRowButtonPreview/g) ?? []).length,
    1,
  );
});
