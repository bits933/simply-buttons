import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..", "..");
const previewPath = join(dir, "ThreeUiLiquidMetalPillPreview.jsx");
const snippetsPath = join(dir, "threeui-liquid-metal-pill.snippets.js");
const generatorPath = join(root, "plans", "threeui-liquid-metal-pill-snippets-gen.mjs");
const slotsPath = join(root, "src", "slots.js");

test("ThreeUI liquid metal pill registers the canonical Sign up button", async () => {
  assert.ok(existsSync(previewPath), "missing pill preview");
  assert.ok(existsSync(snippetsPath), "missing pill snippets");
  assert.ok(existsSync(generatorPath), "missing pill snippets generator");

  const preview = readFileSync(previewPath, "utf8");
  const slots = readFileSync(slotsPath, "utf8");
  const {
    THREEUI_LIQUID_METAL_PILL_META,
    THREEUI_LIQUID_METAL_PILL_SNIPPETS,
  } = await import("./threeui-liquid-metal-pill.snippets.js");

  assert.match(preview, /from "\.\.\/shaders\/liquid-metal-button\/LiquidMetalButton\.tsx"/);
  assert.match(preview, /import "\.\.\/shaders\/threeui\.css"/);
  assert.match(preview, /<LiquidMetalButton variant="pill" \/>/);
  assert.doesNotMatch(preview, /getContext\(|createShader|<canvas/);

  assert.equal(THREEUI_LIQUID_METAL_PILL_META.id, "threeui-liquid-metal");
  assert.equal(THREEUI_LIQUID_METAL_PILL_META.name, "Liquid metal");
  assert.deepEqual(THREEUI_LIQUID_METAL_PILL_META.states, ["default", "hover", "focus-visible", "active", "ripple"]);
  const canonicalHtml = readFileSync(
    join(root, "src", "shaders", "liquid-metal-button", "liquid-metal-button.html"),
    "utf8",
  );
  assert.equal(THREEUI_LIQUID_METAL_PILL_SNIPPETS.html, canonicalHtml);
  assert.match(THREEUI_LIQUID_METAL_PILL_SNIPPETS.html, /<canvas id="fx"><\/canvas>|<canvas id="fx"\/>/);
  assert.match(THREEUI_LIQUID_METAL_PILL_SNIPPETS.react, /<LiquidMetalButton variant="pill" \/>/);
  assert.match(THREEUI_LIQUID_METAL_PILL_SNIPPETS.node, /node:http/);
  assert.ok(THREEUI_LIQUID_METAL_PILL_SNIPPETS.node.includes(JSON.stringify(canonicalHtml)));
  assert.doesNotMatch(THREEUI_LIQUID_METAL_PILL_SNIPPETS.node, /from ["']express["']|require\(["']express["']\)/);

  assert.match(slots, /import \{ ThreeUiLiquidMetalPillPreview \} from "\.\/buttons\/ThreeUiLiquidMetalPillPreview\.jsx"/);
  assert.match(slots, /THREEUI_LIQUID_METAL_PILL_META,[\s\S]*?THREEUI_LIQUID_METAL_PILL_SNIPPETS/);
  assert.equal((slots.match(/id: "threeui-liquid-metal"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: ThreeUiLiquidMetalPillPreview/g) ?? []).length, 1);
  assert.ok(slots.indexOf('id: "threeui-liquid-metal"') > slots.indexOf('id: "liquid-metal-play"'));
});
