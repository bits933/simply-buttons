import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { JELLY_SWITCH_META, JELLY_SWITCH_SNIPPETS } from "./jelly-switch-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Jelly switch is a click-toggle gel button, not a slider rail", () => {
  const webgl = readFileSync(join(dir, "jelly-switch-webgl.js"), "utf8");
  assert.match(webgl, /SWITCH_ACCELERATION = 100/);
  assert.match(webgl, /stiffness: 1000/);
  assert.match(webgl, /stiffness: 900/);
  assert.match(webgl, /squashX\.velocity = -2/);
  assert.match(webgl, /squashZ\.velocity = 1/);
  assert.match(webgl, /squashX\.velocity = -5/);
  assert.match(webgl, /wiggleX\.velocity = -10/);
  assert.match(webgl, /No rail/);
  assert.match(webgl, /beerLambert/);
  assert.match(webgl, /fresnelSchlick/);
  assert.match(webgl, /cheapBend/);
  assert.match(webgl, /0\.08, 0\.5, 1\.0/);
  assert.match(webgl, /releaseAndToggle/);
  assert.match(webgl, /getContext\("webgl"/);
  assert.match(webgl, /alpha: true/);
  assert.match(webgl, /u_ground/);
  assert.match(webgl, /marchGround/);
  assert.match(webgl, /shadeGround/);
  assert.match(webgl, /gl_FragColor = vec4\(rgb, 1\.0\)/);
  assert.match(webgl, /no circular disc/);
  assert.match(webgl, /v_uv\.y \* 2\.0 - 1\.0/);
  assert.doesNotMatch(webgl, /-\(v_uv\.y \* 2\.0 - 1\.0\)/);
  assert.doesNotMatch(webgl, /SWITCH_RAIL_LENGTH/);
  assert.doesNotMatch(webgl, /progress - 0\.5\) \* /);
  assert.doesNotMatch(webgl, /wellCut2d/);

  const css = readFileSync(join(dir, "jelly-switch-button.css"), "utf8");
  assert.match(css, /--jelly-jiggle: 1/);
  assert.match(css, /\.jelly-canvas/);
  assert.match(css, /#121315/);
  assert.match(css, /\.slot:has\(\.jelly-switch-root\) \.slot-index/);
  assert.match(css, /z-index: 6/);
  assert.doesNotMatch(webgl, /smoothstep\(0\.40, 0\.66, radial\)/);
  assert.doesNotMatch(webgl, /u_jelly \* glow/);
  assert.doesNotMatch(css, /\.jelly-switch-root\s*\{[^}]*background:\s*#fff/);

  const jsx = readFileSync(join(dir, "JellySwitchButton.jsx"), "utf8");
  assert.match(jsx, /data-jelly-switch/);
  assert.match(jsx, /initJellySwitch/);
  assert.match(jsx, /api\.destroy\(\)/);
  assert.match(jsx, /type="button"/);
  assert.match(jsx, /aria-pressed/);
  assert.match(jsx, /pointerdown/);
  assert.match(jsx, /releaseAndToggle/);

  for (const [stack, snippet] of Object.entries(JELLY_SWITCH_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("--jelly-jiggle"), `${stack} snippet missing marker`);
    assert.ok(snippet.includes("SWITCH_ACCELERATION = 100"), `${stack} must embed the TypeGPU springs`);
    assert.ok(snippet.includes("releaseAndToggle"), `${stack} needs click toggle`);
    assert.ok(snippet.includes("alpha: true"), `${stack} canvas context stays alpha`);
    assert.ok(snippet.includes("u_ground"), `${stack} must fill the plane with the well grey`);
    assert.ok(snippet.includes("#121315"), `${stack} must use the #121315 well`);
    assert.ok(snippet.includes("marchGround"), `${stack} must restore the TypeGPU studio plane`);
    assert.ok(!snippet.includes("wellCut2d"), `${stack} must not cut a circular well disc`);
    assert.ok(!snippet.includes("SWITCH_RAIL_LENGTH"), `${stack} must not slide on a rail`);
    assert.ok(!snippet.includes("node:fs"), `${stack} must not import node:fs`);
  }
  assert.ok(JELLY_SWITCH_SNIPPETS.node.includes("express"), "node stack serves via Express");

  assert.equal(JELLY_SWITCH_META.id, "jelly-switch");
  assert.ok(JELLY_SWITCH_META.keywords.length >= 17, "keywords contract");
  assert.ok(JELLY_SWITCH_META.keywords.includes("animated button"));
  assert.ok(JELLY_SWITCH_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "jelly-switch"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: JellySwitchButtonPreview/g) ?? []).length, 1);
  const water = slots.lastIndexOf('id: "water-ripple"');
  const jelly = slots.indexOf('id: "jelly-switch"');
  assert.ok(jelly > water, "jelly-switch must append after water-ripple");
});
