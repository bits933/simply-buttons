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
const CARD_HEIGHT = 200;
const stageHeight = (buttonHeight) => buttonHeight * (1 + (2 * 900) / 516);
const readScale = (css, name) => Number(css.match(new RegExp(`--${name}:\\s*([0-9.]+)`))?.[1]);

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
  const pillScale = readScale(presentationCss, "liquid-metal-pill-scale");
  const playScale = readScale(playPresentationCss, "liquid-metal-play-scale");
  assert.ok(Math.abs(stageHeight(52) * pillScale - CARD_HEIGHT) < 0.01, "pill stage must fit the card after scaling");
  assert.ok(Math.abs(stageHeight(88) * playScale - CARD_HEIGHT) < 0.01, "Play stage must fit the card after scaling");
  assert.match(presentationCss, /\.threeui-liquid-metal-pill-preview__content\s*\{[\s\S]*?width:\s*calc\(100% \/ var\(--liquid-metal-pill-scale\)\)[\s\S]*?height:\s*calc\(100% \/ var\(--liquid-metal-pill-scale\)\)[\s\S]*?transform:\s*translate\(-50%, -50%\) scale\(var\(--liquid-metal-pill-scale\)\)/);
  assert.match(presentationCss, /\.slot:has\(\.threeui-liquid-metal-pill-preview\) \.slot-preview,[\s\S]*?padding:\s*0[\s\S]*?overflow:\s*hidden/);
  assert.match(presentationCss, /\.slot-preview-stage:has\(\.threeui-liquid-metal-pill-preview\)[\s\S]*?width:\s*100%[\s\S]*?height:\s*100%[\s\S]*?overflow:\s*visible/);
  assert.match(playPresentationCss, /\.slot:has\(\.liquid-metal-play-root\) \.slot-preview,[\s\S]*?padding:\s*0[\s\S]*?overflow:\s*hidden/);
  assert.match(playPresentationCss, /\.liquid-metal-play-root \.shader-frame\s*\{[\s\S]*?width:\s*calc\(100% \/ var\(--liquid-metal-play-scale\)\)[\s\S]*?height:\s*calc\(100% \/ var\(--liquid-metal-play-scale\)\)[\s\S]*?transform:\s*translate\(-50%, -50%\) scale\(var\(--liquid-metal-play-scale\)\)/);

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
  const raw = slots.slice(slots.indexOf("const RAW = ["), slots.indexOf("];\n\nlet nextIndex"));
  assert.equal((raw.match(/id: "threeui-liquid-metal"/g) ?? []).length, 1);
  const rawIds = [...raw.matchAll(/^ {8}id: "([^"]+)"/gm)].map((match) => match[1]);
  const liquidMetalIndex = rawIds.indexOf("threeui-liquid-metal");
  assert.equal(liquidMetalIndex + 1, 132, "Liquid metal keeps its allocated backend tray number");
  assert.deepEqual(
    rawIds.slice(liquidMetalIndex - 1, liquidMetalIndex + 4),
    ["liquid-metal-play", "threeui-liquid-metal", "generate-button", "spinning-border-button", "plasma-button"],
  );
});
