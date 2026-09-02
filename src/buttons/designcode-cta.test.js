import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  createLaunchState,
  stepLaunchFrame,
  LAUNCH_FRAG_GLSL,
  LAUNCH_VERT_GLSL,
} from "./designcode-cta.launch.js";
import {
  DESIGNCODE_CTA_META,
  DESIGNCODE_CTA_SNIPPETS,
} from "./designcode-cta.snippets.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

test("createLaunchState returns zeroed launch tokens", () => {
  assert.deepEqual(createLaunchState(), {
    warp: 0,
    warpTarget: 0,
    flash: 0,
    time: 0,
  });
});

test("stepLaunchFrame lerps warp toward hover target", () => {
  const start = { warp: 0.2, warpTarget: 0, flash: 0, time: 1 };
  const dt = 0.016;
  const next = stepLaunchFrame(start, dt, { hover: true });

  assert.equal(next.warpTarget, 1);
  assert.equal(next.warp, 0.2 + (1 - 0.2) * Math.min(1, 0.016 * 2.6));
});

test("stepLaunchFrame click resets flash, warp, and time", () => {
  const start = { warp: 0.2, warpTarget: 0, flash: 0, time: 1 };
  const next = stepLaunchFrame(start, 0, { click: true });

  assert.equal(next.flash, 1);
  assert.equal(next.warp, 0);
  assert.equal(next.time, 0);
});

test("stepLaunchFrame decays flash and advances time after lerp", () => {
  const start = { warp: 0.4, warpTarget: 0, flash: 1, time: 0 };
  const dt = 0.016;
  const next = stepLaunchFrame(start, dt, { hover: false });

  const warpAfterLerp = 0.4 + (0 - 0.4) * Math.min(1, 0.016 * 2.6);
  assert.equal(next.warp, warpAfterLerp);
  assert.equal(next.flash, 1 * Math.exp(-4.5 * 0.016));
  assert.equal(next.time, 0.016 * (0.05 + warpAfterLerp * 1.35));
});

test("ships starfield GLSL with the live uniforms and 3-ring loop", () => {
  assert.match(LAUNCH_VERT_GLSL, /attribute vec2 p/);
  for (const token of ["u_res", "u_time", "u_warp", "u_flash", "fbm"]) {
    assert.ok(LAUNCH_FRAG_GLSL.includes(token), `missing ${token}`);
  }
  assert.ok(
    LAUNCH_FRAG_GLSL.includes("for (int i = 0; i < 3; i++)"),
    "missing 3-ring star loop",
  );
});

test("DESIGNCODE_CTA_META.id is designcode-cta", () => {
  assert.equal(DESIGNCODE_CTA_META.id, "designcode-cta");
  assert.equal(DESIGNCODE_CTA_META.name, "Shooting stars");
});

test("slots.js registers DesigncodeCtaPreview as designcode-cta", () => {
  const slots = readFileSync(join(root, "src/slots.js"), "utf8");
  assert.ok(slots.includes("DesigncodeCtaPreview"));
  assert.ok(slots.includes('id: "designcode-cta"'));
});

function shippedRuleBody(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = css.match(new RegExp(`(?:^|\\n)${escaped}\\s*\\{([^}]+)\\}`));
  assert.ok(match, `missing rule ${selector}`);
  return match[1];
}

test("shipped chrome CSS uses live hero width:auto, inner padding, and nowrap label", () => {
  const css = readFileSync(
    join(root, "src/buttons/designcode-cta.css"),
    "utf8",
  );
  const chrome = shippedRuleBody(css, ".space-launch-button");
  const inner = shippedRuleBody(css, ".space-launch-button-inner");
  const label = shippedRuleBody(css, ".space-launch-button-label");

  assert.match(chrome, /^\s*width:\s*auto/m);
  assert.match(chrome, /^\s*min-width:\s*15\.5rem/m);
  assert.doesNotMatch(chrome, /^\s*width:\s*15\.5rem/m);
  assert.match(inner, /padding:\s*0\s+1\.25rem/);
  assert.match(label, /white-space:\s*nowrap/);
});

test("html/react/node snippets are strings with required launch tokens", () => {
  const required = [
    "Dive in with us",
    "space-launch-button",
    "u_warp",
    "u_flash",
    "#3a3d52",
  ];

  for (const key of ["html", "react", "node"]) {
    assert.equal(typeof DESIGNCODE_CTA_SNIPPETS[key], "string");
  }

  for (const key of ["html", "react"]) {
    const snippet = DESIGNCODE_CTA_SNIPPETS[key];
    for (const token of required) {
      assert.ok(snippet.includes(token), `${key} missing ${token}`);
    }
    assert.ok(
      snippet.includes("/pricing") || snippet.includes("onClick"),
      `${key} missing /pricing or onClick`,
    );
    assert.ok(snippet.includes("fbm"), `${key} missing fbm`);
    assert.ok(
      snippet.includes("for (int i = 0; i < 3; i++)"),
      `${key} missing 3-ring loop`,
    );
    assert.ok(snippet.includes("width: auto"), `${key} missing width: auto`);
    assert.ok(snippet.includes("padding: 0 1.25rem"), `${key} missing inner padding`);
    assert.ok(snippet.includes("white-space: nowrap"), `${key} missing nowrap`);
    const chrome = shippedRuleBody(
      snippet.replaceAll("\\n", "\n"),
      ".space-launch-button",
    );
    assert.doesNotMatch(
      chrome,
      /^\s*width:\s*15\.5rem/m,
      `${key} still uses fixed 15.5rem chrome width`,
    );
    assert.ok(
      !snippet.includes("or $99/month"),
      `${key} still has monthly caption`,
    );
    assert.ok(
      !snippet.includes("Enroll for $499 lifetime"),
      `${key} still has old enroll label`,
    );
  }
});
