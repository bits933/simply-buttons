import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { WATER_RIPPLE_META, WATER_RIPPLE_SNIPPETS } from "./water-ripple-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Water ripple button ports jquery.ripples onto the Qwen teal water pill", () => {
  const webgl = readFileSync(join(dir, "water-ripple-webgl.js"), "utf8");
  assert.match(webgl, /makeWaterTexture/);
  assert.match(webgl, /#2e7387/);
  assert.match(webgl, /jquery\.ripples 0\.6\.3/);
  assert.match(webgl, /samplerBackground/);
  assert.match(webgl, /DROP_FRAG|UPDATE_FRAG/);
  assert.match(webgl, /OES_texture_float/);
  assert.match(webgl, /0\.5 - cos\(drop \* PI\) \* 0\.5/);
  assert.match(webgl, /info\.g \+= \(average - info\.r\) \* 2\.0/);
  assert.match(webgl, /info\.g \*= 0\.995/);
  assert.match(webgl, /mousemove/);
  assert.match(webgl, /coord \* size/);
  assert.match(webgl, /length\(pixel - center\)/);
  assert.match(webgl, /abs\(dist - radius\) \/ ringWidth/);
  assert.match(webgl, /dir \* mag \/ size/);
  assert.match(webgl, /1\.0 \/ size/);
  assert.match(webgl, /function splash/);
  assert.match(webgl, /drop\(x, y, 14, 0\.9, 5\)/);
  assert.match(webgl, /addEventListener\("click", onClick\)/);
  assert.match(webgl, /getContext\("webgl"/);
  assert.match(webgl, /destroy\(\)/);
  assert.doesNotMatch(webgl, /velocity \+= \(average - height\) \* 1\.8/);
  assert.doesNotMatch(webgl, /height \*= 0\.97/);

  const css = readFileSync(join(dir, "water-ripple-button.css"), "utf8");
  assert.match(css, /--wr-splash: 1/);
  assert.match(css, /\.btn-water-ripple/);
  assert.match(css, /\.wr-label/);
  assert.match(css, /\.btn-water-ripple\s*\{[^}]*overflow: hidden;/);
  assert.doesNotMatch(css, /\.water-ripple-root\s*\{[^}]*background:/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /rgba\(255, 255, 255, 0\.1\)/);
  assert.doesNotMatch(css, /\.btn-water-ripple\s*\{[^}]*rgba\(255, 255, 255, 0\.3\)/);

  const jsx = readFileSync(join(dir, "WaterRippleButton.jsx"), "utf8");
  assert.match(jsx, /data-water-ripple/);
  assert.match(jsx, /makeWaterTexture/);
  assert.match(jsx, /initWaterRipple/);
  assert.match(jsx, /if \(api\) api\.destroy\(\)/); // StrictMode cleanup
  assert.match(jsx, /type="button"/);
  assert.match(jsx, /resolution: 160/);
  assert.match(jsx, /dropRadius: 25/);
  assert.match(jsx, /perturbance: 0\.08/);
  assert.match(jsx, /const btnRef = useRef\(null\)/);
  assert.match(jsx, /<button[\s\S]*<span className="wr-label"/);

  for (const [stack, snippet] of Object.entries(WATER_RIPPLE_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("--wr-splash"), `${stack} snippet missing marker`);
    assert.ok(snippet.includes("rgba(255, 255, 255, 0.1)"), `${stack} stroke must be 10% opacity`);
    assert.ok(snippet.includes("makeWaterTexture"), `${stack} must embed the water PNG`);
    assert.ok(snippet.includes("samplerBackground"), `${stack} must refract the water texture`);
    assert.ok(snippet.includes("function splash"), `${stack} needs a circular click splash`);
    assert.ok(snippet.includes("length(pixel - center)"), `${stack} drops must stay circular in pixels`);
    assert.ok(snippet.includes("mousemove"), `${stack} must ripple under the pointer`);
    assert.ok(snippet.includes("splash(p.x, p.y)"), `${stack} needs click splash listeners`);
    assert.ok(!snippet.includes("jquery.min.js"), `${stack} is a vanilla port, not a CDN copy`);
    assert.ok(!snippet.includes("node:fs"), `${stack} must not import node:fs`);
  }
  assert.ok(WATER_RIPPLE_SNIPPETS.node.includes("express"), "node stack serves via Express");

  assert.equal(WATER_RIPPLE_META.id, "water-ripple");
  assert.ok(WATER_RIPPLE_META.keywords.length >= 17, "keywords contract");

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "water-ripple"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: WaterRippleButtonPreview/g) ?? []).length, 1);
});
