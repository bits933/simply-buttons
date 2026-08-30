import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const component = await readFile(new URL("./PixelRippleButton.tsx", import.meta.url), "utf8");

test("pixel ripple preview and wave envelope follow the refinement contract", () => {
  assert.match(component, /\.pixel-ripple-demo \{[^}]*background:transparent;/);
  assert.match(component, /hoverLift = tile\.noise \* \(pointerStrength \* 2\.0\)/);
  assert.match(component, /const RIPPLE_SPEED = 0\.48;/);

  const lifetime = component.match(/const RIPPLE_LIFETIME = (\d+);/);
  assert.ok(lifetime);
  assert.ok(Number(lifetime[1]) >= 1200);

  assert.match(component, /travelRatio = Math\.min\(1, dist \/ \(maxDist \* 0\.95\)\)/);
  assert.match(component, /distanceFade = Math\.pow\(Math\.max\(0, 1 - travelRatio\), 1\.35\)/);
});

test("pixel ripple has reduced top inner shadow white opacity", () => {
  assert.match(component, /inset 0 1\.5px 1px rgb\(255 255 255 \/ 10%\)/);
  assert.match(component, /inset 0 1\.5px 1\.5px rgb\(255 255 255 \/ 12%\)/);
  assert.match(component, /inset 0 1\.5px 1px rgb\(255 255 255 \/ 14%\)/);
});

test("pixel ripple inactive state sparkles 2% of the dots with up to +30% opacity boost", () => {
  assert.match(component, /Math\.round\(tilesRef\.current\.length \* 0\.02\)/);
  assert.match(component, /Math\.sin\(progress \* Math\.PI\)/);
  assert.match(component, /sparkleMap\.set\(sparkle\.index,\s*intensity \* 0\.30\)/);
  assert.match(component, /tile\.noise \+ sparkleBoost/);
});
