import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { PLASMA_BUTTON_META, PLASMA_BUTTON_SNIPPETS } from "./plasma-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));
const CANONICAL_SHA =
  "eea617fe0e37a79be7aee44f00a53ec3ae41e006e771a8aad53acce3648147e0";

test("Plasma drive is the ThreeUI ShaderButtons variant from the registered source", () => {
  const source = readFileSync(join(dir, "aetheris-labs.source.html"));
  assert.equal(createHash("sha256").update(source).digest("hex"), CANONICAL_SHA);

  const html = source.toString("utf8");
  assert.match(html, /AETHER DRIVE/);
  assert.match(html, /id="btn"/);
  assert.match(html, /u_heat/);
  assert.match(html, /u_flash/);
  assert.match(html, /hyper jump/);
  assert.match(html, /c4 = vec3\(0\.7, 0\.9, 1\.0\)/);
  assert.match(html, /col \+= vec3\(0\.82, 0\.94, 1\.0\) \* u_flash/);
  assert.match(html, /#050b1a/);
  assert.match(html, /#00d2ff/);

  const css = readFileSync(join(dir, "plasma-button.css"), "utf8");
  assert.match(css, /--plasma-drive: 1/);
  assert.match(css, /#020614/);
  assert.match(css, /#050b1a/);
  assert.match(css, /width: 250px/);
  assert.match(css, /height: 70px/);
  assert.match(css, /border-radius: 16px/);
  assert.match(css, /radial-gradient\(130% 170% at 50% 118%, #61d3ff 0%, #33a7ff 24%, #084c8e 56%, #050a19 88%\)/);
  assert.match(css, /\.aetheris-root\[data-mode="light"\]/);
  assert.match(css, /invert\(1\) hue-rotate\(180deg\)/);

  const webgl = readFileSync(join(dir, "aetheris-webgl.js"), "utf8");
  assert.match(webgl, /export function initAetherisDrive/);
  assert.match(webgl, /u_heat/);
  assert.match(webgl, /u_flash/);
  assert.match(webgl, /heat \+= \(heatTarget - heat\) \* Math\.min\(1, dt \* 6\)/);
  assert.match(webgl, /erupt \*= Math\.exp\(-3\.2 \* dt\)/);
  assert.match(webgl, /churn \+= dt \* \(0\.35 \+ heat \* 1\.1 \+ erupt \* 2\.2\)/);
  assert.match(webgl, /reduced \? 6\.0 : churn/);
  assert.match(webgl, /0 30px 60px rgba\(0, 150, 220, 0\.35\)/);
  assert.match(webgl, /0 24px 48px rgba\(4, 98, 126, 0\.2\)/);
  assert.match(webgl, /destroy\(\)/);

  const jsx = readFileSync(join(dir, "PlasmaButton.jsx"), "utf8");
  assert.match(jsx, /export function ShaderButtons/);
  assert.match(jsx, /variant = "plasma-button"/);
  assert.match(jsx, /mode="dark"/);
  assert.match(jsx, /saturation=\{1/);
  assert.match(jsx, /brightness=\{1/);
  assert.match(jsx, /type="button"/);
  assert.match(jsx, /aria-label="Aether Drive"/);
  assert.match(jsx, /AETHER DRIVE/);
  assert.match(jsx, /initAetherisDrive/);
  assert.match(jsx, /api\.destroy\(\)/);

  for (const [stack, snippet] of Object.entries(PLASMA_BUTTON_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("--plasma-drive"), `${stack} snippet missing marker`);
    assert.ok(snippet.includes("AETHER DRIVE"), `${stack} missing label`);
    assert.ok(snippet.includes("u_heat"), `${stack} missing the heat uniform`);
    assert.ok(snippet.includes("u_flash"), `${stack} missing the flash uniform`);
    assert.ok(snippet.includes(".getContext("), `${stack} must keep raw WebGL`);
    assert.ok(snippet.includes("#020614"), `${stack} missing the cosmic ground`);
    assert.ok(!snippet.includes("node:fs"), `${stack} must not import node:fs`);
  }
  assert.ok(PLASMA_BUTTON_SNIPPETS.node.includes("express"), "node stack serves via Express");
  assert.ok(PLASMA_BUTTON_SNIPPETS.react.includes("ShaderButtons"));
  assert.ok(PLASMA_BUTTON_SNIPPETS.react.includes('variant="plasma-button"'));

  assert.equal(PLASMA_BUTTON_META.id, "plasma-button");
  assert.ok(PLASMA_BUTTON_META.keywords.length >= 17, "keywords contract");
  assert.ok(PLASMA_BUTTON_META.keywords.includes("animated button"));
  assert.ok(PLASMA_BUTTON_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "plasma-button"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: PlasmaButtonPreview/g) ?? []).length, 1);
  const spinning = slots.lastIndexOf('id: "spinning-border-button"');
  const plasma = slots.indexOf('id: "plasma-button"');
  assert.ok(plasma > spinning, "plasma-button must append after spinning-border-button");
});
