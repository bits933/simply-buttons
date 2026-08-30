import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

test("lap arrow is circular and swaps the icon left to right", () => {
  const css = readFileSync(join(dir, "lap-arrow.css"), "utf8");
  assert.match(css, /border-radius:\s*50%/);
  assert.match(css, /width:\s*58px/);
  assert.match(css, /height:\s*58px/);
  assert.match(css, /translateX\(-120%\) scale\(0\.78\)/);
  assert.match(css, /translateX\(120%\) scale\(0\.78\)/);
  assert.match(css, /cubic-bezier\(0\.92,\s*0,\s*0\.08,\s*1\)/);
  assert.match(css, /1100ms/);
  assert.match(css, /stroke-dashoffset:\s*101/);
  assert.match(css, /opacity:\s*0/);
});

test("gallery snippets append lap arrow after lap button", async () => {
  const { LAP_ARROW_SNIPPETS, LAP_ARROW_META } = await import(
    "./lap-arrow.snippets.js"
  );
  const slots = readFileSync(join(dir, "../slots.js"), "utf8");
  const jsx = readFileSync(join(dir, "LapArrowButton.jsx"), "utf8");
  assert.equal(LAP_ARROW_META.id, "lap-arrow");
  assert.equal(LAP_ARROW_META.name, "Lap arrow");
  assert.ok(slots.includes("LapArrowPreview"));
  assert.ok(slots.includes('id: "lap-arrow"'));
  assert.ok(
    slots.lastIndexOf('id: "lap-arrow"') > slots.lastIndexOf('id: "lap-button"'),
  );
  assert.match(jsx, /btn-lapa-icon--out/);
  assert.match(jsx, /<circle/);
  assert.match(jsx, /aria-label="Next"/);
  for (const key of ["html", "react", "node"]) {
    const text = LAP_ARROW_SNIPPETS[key];
    assert.equal(typeof text, "string");
    assert.match(text, /btn-lapa-btn/);
    assert.match(text, /<circle/);
    assert.match(text, /translateX\(-120%\)/);
    assert.match(text, /<button/);
  }
});
