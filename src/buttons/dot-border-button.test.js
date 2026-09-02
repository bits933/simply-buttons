import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { DOT_BORDER_META, DOT_BORDER_SNIPPETS } from "./dot-border-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));
const CANONICAL_SHA =
  "eb3ef1de8c8af80bf3f532630c60ed4ee90f10cd645d136f284417e75bda6584";

test("Dot border is the ThreeUI RectangleButtons variant from the registered source", () => {
  const source = readFileSync(join(dir, "dot-border-button.source.html"));
  assert.equal(createHash("sha256").update(source).digest("hex"), CANONICAL_SHA);

  const html = source.toString("utf8");
  assert.match(html, /Start Creating/);
  assert.match(html, /class="btn-wrapper"/);
  assert.match(html, /--dot-size: 8px/);
  assert.match(html, /#25358b/);
  assert.match(html, /move-top-left/);
  assert.match(html, /draw-top/);

  const css = readFileSync(join(dir, "dot-border-button.css"), "utf8");
  assert.match(css, /--dot-border-cta: 1/);
  assert.match(css, /#25358b/);
  assert.match(css, /#111318/);
  assert.match(css, /dot-border-move-top-left/);
  assert.match(css, /dot-border-draw-top/);
  assert.match(css, /transformDotBorderButtonSource/);
  assert.match(css, /#111a/);

  const jsx = readFileSync(join(dir, "DotBorderButton.jsx"), "utf8");
  assert.match(jsx, /export function RectangleButtons/);
  assert.match(jsx, /variant="dot-border-button"/);
  assert.match(jsx, /mode="dark"/);
  assert.match(jsx, /saturation=\{1/);
  assert.match(jsx, /brightness=\{1/);
  assert.match(jsx, /type="button"/);
  assert.match(jsx, /Start Creating/);
  assert.match(jsx, /event\.preventDefault\(\)/);
  assert.match(jsx, /M17\.6744 11\.4075/);

  for (const [stack, snippet] of Object.entries(DOT_BORDER_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("--dot-border-cta"), `${stack} snippet missing marker`);
    assert.ok(snippet.includes("Start Creating"), `${stack} missing label`);
    assert.ok(snippet.includes("#25358b"), `${stack} missing hover fill`);
    assert.ok(snippet.includes("preventDefault"), `${stack} must keep the hash link from navigating`);
    assert.ok(!snippet.includes("node:fs"), `${stack} must not import node:fs`);
  }
  assert.ok(DOT_BORDER_SNIPPETS.node.includes("express"), "node stack serves via Express");
  assert.ok(DOT_BORDER_SNIPPETS.react.includes("RectangleButtons"));
  assert.ok(DOT_BORDER_SNIPPETS.react.includes('variant="dot-border-button"'));

  assert.equal(DOT_BORDER_META.id, "dot-border");
  assert.ok(DOT_BORDER_META.keywords.length >= 17, "keywords contract");
  assert.ok(DOT_BORDER_META.keywords.includes("animated button"));
  assert.ok(DOT_BORDER_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "dot-border"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: DotBorderButtonPreview/g) ?? []).length, 1);
  const jelly = slots.lastIndexOf('id: "jelly-switch"');
  const border = slots.indexOf('id: "dot-border"');
  assert.ok(border > jelly, "dot-border must append after jelly-switch");
});
