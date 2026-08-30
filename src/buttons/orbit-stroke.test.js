import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const componentPath = join(directory, "OrbitStrokeButton.jsx");
const cssPath = join(directory, "orbit-stroke.css");
const snippetsPath = join(directory, "orbit-stroke.snippets.js");
const shimmerPath = join(directory, "text-shimmer-wave.jsx");

test("registers the orbit stroke send button in the gallery", () => {
  const slots = readFileSync(join(directory, "..", "slots.js"), "utf8");

  assert.match(slots, /OrbitStrokePreview/);
  assert.match(slots, /ORBIT_STROKE_META/);
  assert.match(slots, /ORBIT_STROKE_SNIPPETS/);
  assert.match(slots, /id: "orbit-stroke"/);
});

test("OrbitStrokeButton implements Send -> Sending shimmer (4s) -> Sent tick -> Reset lifecycle", () => {
  assert.ok(existsSync(componentPath), "missing OrbitStrokeButton.jsx");
  const component = readFileSync(componentPath, "utf8");

  assert.match(component, /TextShimmerWave/);
  assert.match(component, /phase === "sending"/);
  assert.match(component, /phase === "sent"/);
  assert.match(component, /4000/);
  assert.match(component, /btn-orbit-stroke-tick/);
  assert.match(component, /Sending/);
  assert.match(component, /Sent/);
  assert.match(component, /Send/);
});

test("TextShimmerWave from @loading-ui is present and utilizes motion/react", () => {
  assert.ok(existsSync(shimmerPath), "missing text-shimmer-wave.jsx");
  const shimmer = readFileSync(shimmerPath, "utf8");

  assert.match(shimmer, /motion\/react/);
  assert.match(shimmer, /TextShimmerWave/);
  assert.match(shimmer, /rotateYDistance/);
  assert.match(shimmer, /translateZ/);
});

test("CSS defines smooth anti-aliased rotating gradient and preserves static stroke on hover", () => {
  assert.ok(existsSync(cssPath), "missing orbit-stroke.css");
  const css = readFileSync(cssPath, "utf8");

  assert.match(css, /\.btn-orbit-stroke/);
  assert.match(css, /\.btn-orbit-stroke\.is-sending/);
  assert.match(css, /conic-gradient/);
  assert.match(css, /border-box/);
  assert.match(css, /padding-box/);
  assert.match(css, /\.btn-orbit-stroke-tick-path/);
  assert.match(css, /@keyframes orbit-stroke-tick-draw/);
  assert.match(css, /@keyframes orbit-stroke/);
  // Stroke does not change on hover in idle state
  assert.doesNotMatch(css, /\.btn-orbit-stroke:hover[^{]*\{[^}]*border-color:\s*transparent/);
});

test("exposes complete snippets and search metadata", () => {
  assert.ok(existsSync(snippetsPath), "missing orbit-stroke.snippets.js");
  const snippets = readFileSync(snippetsPath, "utf8");

  assert.match(snippets, /id: "orbit-stroke"/);
  assert.match(snippets, /name: "Orbit stroke"/i);
  assert.match(snippets, /states: ".*sending wave.*sent tick/i);
  assert.match(snippets, /"send button"/);
  assert.match(snippets, /"text shimmer wave"/);
});
