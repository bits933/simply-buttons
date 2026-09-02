import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("filled slots expose a fullscreen preview that reuses copy and excludes the code modal", async () => {
  const slot = await readFile(new URL("./Slot.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("./index.css", import.meta.url), "utf8");
  const modal = await readFile(new URL("./PreviewModal.jsx", import.meta.url), "utf8");

  assert.match(slot, /CornersOut/);
  assert.match(slot, /className="slot-expand"/);
  assert.match(slot, /setPreviewOpen\(true\)/);
  assert.match(slot, /setPreviewOpen\(false\)/);
  assert.match(slot, /setOpen\(null\)/);
  assert.match(slot, /<PreviewModal/);
  assert.match(slot, /onCopy=\{copyComponent\}/);
  assert.match(slot, /formatButtonCopy/);
  assert.match(slot, /Copy prompt and code/);
  assert.match(slot, /<slot\.preview \/>/);
  assert.match(modal, /aria-label="Close \(Escape\)"/);
  assert.match(modal, /<kbd>Esc<\/kbd>/);
  assert.match(modal, /<CopyButton/);
  assert.match(modal, /event\.key === "Escape"/);
  assert.match(css, /\.slot-expand/);
  assert.match(css, /\.preview-modal/);
  assert.match(css, /\.preview-modal-close/);
  assert.doesNotMatch(slot, /transform:\s*scale/);
});
