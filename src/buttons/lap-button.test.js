import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = dirname(fileURLToPath(import.meta.url));

test("lap button CSS draws a hover lap and swaps scaled labels", () => {
  const css = readFileSync(join(dir, "lap-button.css"), "utf8");
  assert.match(css, /stroke-dashoffset:\s*101/);
  assert.match(css, /stroke-dashoffset:\s*0/);
  assert.match(css, /opacity:\s*0/);
  assert.match(css, /stroke-linecap:\s*butt/);
  assert.match(css, /translateY\(-115%\) scale\(0\.78\)/);
  assert.match(css, /translateY\(115%\) scale\(0\.78\)/);
  assert.match(css, /border-radius:\s*999px/);
  assert.match(css, /padding:\s*0 24px/);
  assert.match(css, /cubic-bezier\(0\.83,\s*0,\s*0\.17,\s*1\)/);
});

test("gallery snippets and last-tray registration ship the lap button", async () => {
  const { LAP_BUTTON_SNIPPETS, LAP_BUTTON_META } = await import(
    "./lap-button.snippets.js"
  );
  const slots = readFileSync(join(dir, "../slots.js"), "utf8");
  const jsx = readFileSync(join(dir, "LapButton.jsx"), "utf8");
  assert.equal(LAP_BUTTON_META.id, "lap-button");
  assert.equal(LAP_BUTTON_META.name, "Lap button");
  assert.ok(slots.includes("LapButtonPreview"));
  assert.ok(slots.includes('id: "lap-button"'));
  assert.ok(
    slots.lastIndexOf('id: "lap-button"') >
      slots.lastIndexOf('id: "letter-scramble"'),
  );
  assert.match(jsx, /START EXPERIENCE/);
  assert.match(jsx, /btn-lap-line--out/);
  assert.match(jsx, /btn-lap-run/);
  assert.match(jsx, /rx="28.25"/);
  assert.doesNotMatch(jsx, /rx="999"/);
  for (const key of ["html", "react", "node"]) {
    const text = LAP_BUTTON_SNIPPETS[key];
    assert.equal(typeof text, "string");
    assert.match(text, /btn-lap-btn/);
    assert.match(text, /START EXPERIENCE/);
    assert.match(text, /stroke-dashoffset/);
    assert.match(text, /<button/);
  }
});
