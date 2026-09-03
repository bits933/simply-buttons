import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  GRIGOLETTI_FRAMER_META,
  GRIGOLETTI_FRAMER_SNIPPETS,
} from "./grigoletti-framer-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Grigoletti Framer badge has distinctive marker, accessible button contracts, and meta contracts", () => {
  const css = readFileSync(join(dir, "grigoletti-framer-button.css"), "utf8");
  assert.match(css, /\.gfb-root/);
  assert.match(css, /\.gfb-framer-btn/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const jsx = readFileSync(join(dir, "GrigolettiFramerButton.jsx"), "utf8");
  assert.match(jsx, /data-grigoletti-framer/);
  assert.match(jsx, /gfb-framer-btn/);
  assert.match(jsx, /type="button"/);

  for (const [stack, snippet] of Object.entries(GRIGOLETTI_FRAMER_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("gfb-framer-btn"), `${stack} missing marker gfb-framer-btn`);
  }

  assert.equal(GRIGOLETTI_FRAMER_META.id, "grigoletti-framer");
  assert.ok(GRIGOLETTI_FRAMER_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(GRIGOLETTI_FRAMER_META.keywords.includes("animated button"));
  assert.ok(GRIGOLETTI_FRAMER_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "grigoletti-framer"/g) ?? []).length, 1);
  assert.equal(
    (slots.match(/preview: GrigolettiFramerButtonPreview/g) ?? []).length,
    1,
  );
});
