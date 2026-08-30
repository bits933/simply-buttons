import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

test("dot matrix compress button conforms to design specs, DotMatrixIcon, pulse, and text sliding contracts", async () => {
  const { DOT_MATRIX_COMPRESS_META, DOT_MATRIX_COMPRESS_SNIPPETS } = await import(
    "./dot-matrix-compress.snippets.js"
  );
  const directory = dirname(fileURLToPath(import.meta.url));
  const css = readFileSync(join(directory, "dot-matrix-compress.css"), "utf8");
  const component = readFileSync(join(directory, "DotMatrixCompressButton.jsx"), "utf8");
  const icon = readFileSync(join(directory, "DotMatrixIcon.jsx"), "utf8");
  const slots = readFileSync(join(directory, "../slots.js"), "utf8");

  // Metadata check
  assert.equal(DOT_MATRIX_COMPRESS_META.id, "dot-matrix-compress");
  assert.equal(DOT_MATRIX_COMPRESS_META.name, "Dot matrix compress");
  assert.ok(DOT_MATRIX_COMPRESS_META.keywords.length >= 17);
  assert.ok(DOT_MATRIX_COMPRESS_META.keywords.includes("animated button"));
  assert.ok(DOT_MATRIX_COMPRESS_META.keywords.includes("interactive button"));

  // CSS classes & colors
  assert.ok(css.includes(".btn-dotmatrix-btn"));
  assert.ok(css.includes(".btn-dotmatrix-fill-progress"));
  assert.ok(css.includes(".btn-dotmatrix-gauge"));
  assert.ok(css.includes(".btn-dotmatrix-wave-svg"));
  assert.ok(css.includes(".btn-dotmatrix-text-window"));
  assert.ok(css.includes(".btn-dotmatrix-slide-item"));
  assert.ok(css.includes(".btn-dotmatrix-pulse"));
  assert.ok(css.includes("#22d3ee") || css.includes("#38bdf8"));

  // Component structure
  assert.ok(component.includes("DotMatrixIcon"));
  assert.ok(component.includes("iconIndex={2}"));
  assert.ok(component.includes("size={48}"));
  assert.ok(component.includes("btn-dotmatrix-fill-progress"));
  assert.ok(component.includes("btn-dotmatrix-gauge"));
  assert.ok(component.includes("btn-dotmatrix-text-window"));
  assert.ok(component.includes("276K/500K"));
  assert.ok(component.includes("10K/500K"));
  assert.ok(icon.includes("DotMatrixIcon"));

  // Slots check
  assert.ok(slots.includes("DotMatrixCompressPreview"));
  assert.ok(slots.includes("DOT_MATRIX_COMPRESS_META"));

  // Snippet checks
  for (const key of ["html", "react", "node"]) {
    assert.ok(DOT_MATRIX_COMPRESS_SNIPPETS[key].includes("btn-dotmatrix-btn"));
    assert.ok(DOT_MATRIX_COMPRESS_SNIPPETS[key].includes("276K/500K") || DOT_MATRIX_COMPRESS_SNIPPETS[key].includes("276K"));
    assert.ok(DOT_MATRIX_COMPRESS_SNIPPETS[key].includes("10K/500K") || DOT_MATRIX_COMPRESS_SNIPPETS[key].includes("10K"));
  }
});
