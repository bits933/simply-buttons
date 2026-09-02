import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { GENERATE_BUTTON_META, GENERATE_BUTTON_SNIPPETS } from "./generate-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));
const CANONICAL_SHA =
  "e99ab802a1e1f1a7b1444727e26197c43f8cfe328ca6e2cd45b6fbb3bce694c6";

test("Generate button is the ThreeUI RectangleButtons variant from the registered source", () => {
  const source = readFileSync(join(dir, "generate-button.source.html"));
  assert.equal(createHash("sha256").update(source).digest("hex"), CANONICAL_SHA);

  const html = source.toString("utf8");
  assert.match(html, /aria-label="Generate"/);
  assert.match(html, /class="btn-wrapper"/);
  assert.match(html, /--highlight-color-hue: 210deg/);
  assert.match(html, /--button-color: #101010/);
  assert.match(html, /letter-anim/);
  assert.match(html, /focused-letter-anim/);
  assert.match(html, /appear-anim/);
  assert.match(html, /flicker/);
  assert.match(html, /<div class="txt-2">/);
  assert.match(html, /<span class="btn-letter">i<\/span>/);
  assert.match(html, /M9\.813 15\.904/);

  const css = readFileSync(join(dir, "generate-button.css"), "utf8");
  assert.match(css, /--generate-cta: 1/);
  assert.match(css, /--button-color: #101010/);
  assert.match(css, /#111318/);
  assert.match(css, /generate-letter-anim/);
  assert.match(css, /generate-focused-letter-anim/);
  assert.match(css, /generate-appear-anim/);
  assert.match(css, /generate-flicker/);
  assert.match(css, /hsl\(var\(--highlight-color-hue\), 100%, 70%\)/);
  assert.match(css, /\.generate-root\[data-mode="light"\]/);

  const jsx = readFileSync(join(dir, "GenerateButton.jsx"), "utf8");
  assert.match(jsx, /export function RectangleButtons/);
  assert.match(jsx, /variant = "generate-button"/);
  assert.match(jsx, /mode="dark"/);
  assert.match(jsx, /saturation=\{1/);
  assert.match(jsx, /brightness=\{1/);
  assert.match(jsx, /type="button"/);
  assert.match(jsx, /aria-label="Generate"/);
  assert.match(jsx, /"G", "e", "n", "e", "r", "a", "t", "e"/);
  assert.match(jsx, /"G", "e", "n", "e", "r", "a", "t", "i", "n", "g"/);
  assert.match(jsx, /M9\.813 15\.904/);

  for (const [stack, snippet] of Object.entries(GENERATE_BUTTON_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("--generate-cta"), `${stack} snippet missing marker`);
    assert.ok(snippet.includes("Generate"), `${stack} missing the label`);
    assert.ok(snippet.includes("--highlight-color-hue: 210deg"), `${stack} missing the hue variable`);
    assert.ok(snippet.includes("#101010"), `${stack} missing the authored plate color`);
    assert.ok(snippet.includes("btn-letter"), `${stack} missing the letter spans`);
    assert.ok(!snippet.includes("node:fs"), `${stack} must not import node:fs`);
  }
  assert.ok(GENERATE_BUTTON_SNIPPETS.node.includes("express"), "node stack serves via Express");
  assert.ok(GENERATE_BUTTON_SNIPPETS.react.includes("RectangleButtons"));
  assert.ok(GENERATE_BUTTON_SNIPPETS.react.includes('variant="generate-button"'));
  assert.ok(GENERATE_BUTTON_SNIPPETS.react.includes("<style>{CSS}</style>"));

  assert.equal(GENERATE_BUTTON_META.id, "generate-button");
  assert.ok(GENERATE_BUTTON_META.keywords.length >= 17, "keywords contract");
  assert.ok(GENERATE_BUTTON_META.keywords.includes("animated button"));
  assert.ok(GENERATE_BUTTON_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "generate-button"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: GenerateButtonPreview/g) ?? []).length, 1);
  const play = slots.lastIndexOf('id: "liquid-metal-play"');
  const generate = slots.indexOf('id: "generate-button"');
  assert.ok(generate > play, "generate-button must append after liquid-metal-play");
});
