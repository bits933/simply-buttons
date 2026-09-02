import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  LIQUID_METAL_BUTTON_META,
  LIQUID_METAL_BUTTON_SNIPPETS,
} from "./liquid-metal-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));
const shaders = join(dir, "..", "shaders", "liquid-metal-button");

test("Liquid metal play uses the exact ThreeUI Play Circle source", () => {
  const tsx = readFileSync(join(shaders, "LiquidMetalButton.tsx"), "utf8");
  const html = readFileSync(join(shaders, "liquid-metal-button.html"), "utf8");
  const css = readFileSync(join(dir, "liquid-metal-button.css"), "utf8");
  const preview = readFileSync(join(dir, "LiquidMetalPlayButton.jsx"), "utf8");

  assert.equal(
    createHash("sha256").update(readFileSync(join(shaders, "LiquidMetalButton.tsx"))).digest("hex"),
    "89b940bab445f17fafb444a7833b3c785d24c86a28156d8ad231e18de9503e11",
  );
  assert.equal(
    createHash("sha256").update(readFileSync(join(shaders, "liquid-metal-button.html"))).digest("hex"),
    "76624e881a3aecbd79b473d9c51f53c7157d47052abd0f9dc28fefd223b0a819",
  );

  assert.match(tsx, /from "\.\/liquid-metal-button\.html\?raw"/);
  assert.match(html, /getContext\('webgl2'/);
  assert.match(html, /pointerenter/);
  assert.match(html, /pointerdown/);
  assert.match(html, /addRipple/);

  assert.match(preview, /from "\.\.\/shaders\/liquid-metal-button\/LiquidMetalButton\.tsx"/);
  assert.match(preview, /import "\.\.\/shaders\/threeui\.css"/);
  assert.match(preview, /variant="play"/);
  assert.match(preview, /rendering="colored"/);
  assert.match(preview, /diameter=\{88\}/);
  assert.match(preview, /strokeWidth=\{3\.0\}/);
  assert.match(preview, /text="Play"/);
  assert.doesNotMatch(preview, /getContext\(/);
  assert.doesNotMatch(preview, /gl\.createShader/);

  assert.match(css, /--lmp-play: 1/);
  assert.match(css, /\.shader-frame/);
  assert.match(css, /#070708/);
  assert.match(css, /\.slot:has\(\.liquid-metal-play-root\) \.slot-index/);

  for (const [stack, snippet] of Object.entries(LIQUID_METAL_BUTTON_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("webgl2"), `${stack} must keep WebGL 2`);
    assert.ok(snippet.includes("playStrokeWidth"), `${stack} must keep play stroke config`);
    assert.ok(snippet.includes("liquidMetalPlayButton"), `${stack} must keep the play bridge`);
    assert.ok(snippet.includes("M15.5 10.75"), `${stack} must use the play glyph`);
    assert.ok(snippet.includes("--h:88px"), `${stack} diameter stays 88px`);
    assert.ok(!snippet.includes("node:fs"), `${stack} must not import node:fs`);
  }
  assert.ok(LIQUID_METAL_BUTTON_SNIPPETS.react.includes('variant="play"'));
  assert.ok(LIQUID_METAL_BUTTON_SNIPPETS.react.includes("sandbox=\"allow-scripts\"") || LIQUID_METAL_BUTTON_SNIPPETS.react.includes('sandbox="allow-scripts"'));
  assert.ok(LIQUID_METAL_BUTTON_SNIPPETS.node.includes("express"), "node stack serves via Express");

  assert.equal(LIQUID_METAL_BUTTON_META.id, "liquid-metal-play");
  assert.equal(LIQUID_METAL_BUTTON_META.name, "Liquid metal play");
  assert.ok(LIQUID_METAL_BUTTON_META.keywords.length >= 17, "keywords contract");
  assert.ok(LIQUID_METAL_BUTTON_META.keywords.includes("animated button"));
  assert.ok(LIQUID_METAL_BUTTON_META.keywords.includes("interactive button"));
  assert.ok(LIQUID_METAL_BUTTON_META.states.includes("hover"));
  assert.ok(LIQUID_METAL_BUTTON_META.states.includes("focus-visible"));
  assert.ok(LIQUID_METAL_BUTTON_META.states.includes("ripple"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "liquid-metal-play"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: LiquidMetalPlayButtonPreview/g) ?? []).length, 1);
  const border = slots.lastIndexOf('id: "dot-border"');
  const play = slots.indexOf('id: "liquid-metal-play"');
  assert.ok(play > border, "liquid-metal-play must append after dot-border");
});
