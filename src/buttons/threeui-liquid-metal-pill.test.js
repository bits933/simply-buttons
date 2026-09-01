import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));
const root = join(dir, "..", "..");
const previewPath = join(dir, "ThreeUiLiquidMetalPillPreview.jsx");
const presentationCssPath = join(dir, "threeui-liquid-metal-pill.css");
const playPresentationCssPath = join(dir, "liquid-metal-button.css");
const snippetsPath = join(dir, "threeui-liquid-metal-pill.snippets.js");
const generatorPath = join(root, "plans", "threeui-liquid-metal-pill-snippets-gen.mjs");
const slotsPath = join(root, "src", "slots.js");

test("ThreeUI liquid metal pill registers the canonical Sign up button", async () => {
  assert.ok(existsSync(previewPath), "missing pill preview");
  assert.ok(existsSync(presentationCssPath), "missing pill presentation stylesheet");
  assert.ok(existsSync(snippetsPath), "missing pill snippets");
  assert.ok(existsSync(generatorPath), "missing pill snippets generator");

  const preview = readFileSync(previewPath, "utf8");
  const presentationCss = readFileSync(presentationCssPath, "utf8");
  const playPresentationCss = readFileSync(playPresentationCssPath, "utf8");
  const slots = readFileSync(slotsPath, "utf8");
  const {
    THREEUI_LIQUID_METAL_PILL_META,
    THREEUI_LIQUID_METAL_PILL_SNIPPETS,
  } = await import("./threeui-liquid-metal-pill.snippets.js");

  assert.match(preview, /from "\.\.\/shaders\/liquid-metal-button\/LiquidMetalButton\.tsx"/);
  assert.match(preview, /import "\.\.\/shaders\/threeui\.css"/);
  assert.match(preview, /import "\.\/threeui-liquid-metal-pill\.css"/);
  assert.match(preview, /<LiquidMetalButton variant="pill" \/>/);
  assert.match(preview, /className="threeui-liquid-metal-pill-preview"/);
  assert.match(preview, /className="threeui-liquid-metal-pill-preview__content"/);
  assert.doesNotMatch(preview, /getContext\(|createShader|<canvas/);
  assert.match(presentationCss, /\.threeui-liquid-metal-pill-preview\s*\{[\s\S]*?overflow:\s*hidden[\s\S]*?background:\s*#070708/);
  assert.match(presentationCss, /\.threeui-liquid-metal-pill-preview__content\s*\{[\s\S]*?position:\s*absolute[\s\S]*?top:\s*50%[\s\S]*?left:\s*50%[\s\S]*?width:\s*111\.111%[\s\S]*?height:\s*116\.7%[\s\S]*?transform:\s*translate\(-50%, -50%\) scale\(0\.9\)[\s\S]*?transform-origin:\s*center/);
  assert.match(presentationCss, /\.slot:has\(\.threeui-liquid-metal-pill-preview\) \.slot-preview,[\s\S]*?padding:\s*0[\s\S]*?overflow:\s*hidden/);
  assert.match(presentationCss, /\.slot-preview-stage:has\(\.threeui-liquid-metal-pill-preview\)[\s\S]*?width:\s*100%[\s\S]*?height:\s*100%[\s\S]*?overflow:\s*visible/);
  assert.match(playPresentationCss, /\.slot:has\(\.liquid-metal-play-root\) \.slot-preview,[\s\S]*?padding:\s*0[\s\S]*?overflow:\s*hidden/);
  assert.match(playPresentationCss, /\.liquid-metal-play-root \.shader-frame\s*\{[\s\S]*?position:\s*absolute[\s\S]*?top:\s*50%[\s\S]*?width:\s*100%[\s\S]*?height:\s*197\.5%[\s\S]*?transform:\s*translateY\(-50%\)/);

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
  assert.doesNotMatch(THREEUI_LIQUID_METAL_PILL_SNIPPETS.react, /threeui-liquid-metal-pill-preview|scale\(0\.9\)/);
  assert.match(THREEUI_LIQUID_METAL_PILL_SNIPPETS.node, /node:http/);
  assert.ok(THREEUI_LIQUID_METAL_PILL_SNIPPETS.node.includes(JSON.stringify(canonicalHtml)));
  assert.doesNotMatch(THREEUI_LIQUID_METAL_PILL_SNIPPETS.node, /from ["']express["']|require\(["']express["']\)/);

  for (const [path, hash] of Object.entries({
    [join(root, "src", "shaders", "liquid-metal-button", "LiquidMetalButton.tsx")]: "89b940bab445f17fafb444a7833b3c785d24c86a28156d8ad231e18de9503e11",
    [join(root, "src", "shaders", "liquid-metal-button", "liquid-metal-button.html")]: "76624e881a3aecbd79b473d9c51f53c7157d47052abd0f9dc28fefd223b0a819",
    [join(root, "src", "shaders", "threeui.css")]: "efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf",
  })) {
    assert.equal(createHash("sha256").update(readFileSync(path)).digest("hex"), hash);
  }

  assert.match(slots, /import \{ ThreeUiLiquidMetalPillPreview \} from "\.\/buttons\/ThreeUiLiquidMetalPillPreview\.jsx"/);
  assert.match(slots, /THREEUI_LIQUID_METAL_PILL_META,[\s\S]*?THREEUI_LIQUID_METAL_PILL_SNIPPETS/);
  assert.equal((slots.match(/id: "threeui-liquid-metal"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: ThreeUiLiquidMetalPillPreview/g) ?? []).length, 1);
  assert.ok(slots.indexOf('id: "threeui-liquid-metal"') > slots.indexOf('id: "liquid-metal-play"'));
});
