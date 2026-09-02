import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  DUST,
  buildDustShaders,
  dustClickWave,
  dustQuadAlpha,
  dustSettleAmount,
  dustWaveRadius,
  stepDustClock,
} from "./dust-premium.gl.js";
import {
  DUST_PREMIUM_META,
  DUST_PREMIUM_SNIPPETS,
} from "./dust-premium-button.snippets.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const dir = dirname(fileURLToPath(import.meta.url));

test("stepDustClock advances scatter → reform → settle → rest", () => {
  const maxE = 200;
  const scatterEnd = maxE / DUST.WAVE_SPEED + DUST.SCATTER_DUR + DUST.HOLD;

  assert.deepEqual(stepDustClock(1, scatterEnd - 0.001, maxE), {
    phase: 1,
    t: scatterEnd - 0.001,
  });
  assert.deepEqual(stepDustClock(1, scatterEnd + 0.01, maxE), { phase: 2, t: 0 });
  assert.deepEqual(stepDustClock(2, DUST.REFORM_DUR + 0.01, maxE), {
    phase: 3,
    t: 0,
  });
  assert.deepEqual(stepDustClock(3, DUST.SETTLE_DUR + 0.01, maxE), {
    phase: 0,
    t: 0,
  });
  assert.deepEqual(stepDustClock(0, 1, maxE), { phase: 0, t: 1 });
});

test("dust settle, wave radius, and quad alpha match the source formulas", () => {
  assert.equal(dustSettleAmount(1, 1), 0);
  const p = 0.5;
  assert.equal(dustSettleAmount(3, p * DUST.SETTLE_DUR), p * p * (3 - 2 * p));
  assert.equal(dustWaveRadius(1, 0.2), 0.2 * DUST.WAVE_SPEED);
  assert.equal(dustWaveRadius(2, 0.2), -1000);
  assert.equal(dustQuadAlpha(0, 0.4), 1);
  assert.equal(dustQuadAlpha(1, 0.4), 1);
  assert.equal(dustQuadAlpha(2, 0.4), 0);
  assert.equal(dustQuadAlpha(3, 0.4), 0.4);
});

test("dustClickWave offsets into pad space and includes noise amplitude", () => {
  const { waveC, maxE } = dustClickWave(10, 20, DUST.BW, DUST.BH);
  assert.deepEqual(waveC, [10 + DUST.PAD, 20 + DUST.PAD]);
  const expected =
    Math.max(
      Math.hypot(10, 20),
      Math.hypot(DUST.BW - 10, 20),
      Math.hypot(10, DUST.BH - 20),
      Math.hypot(DUST.BW - 10, DUST.BH - 20),
    ) + DUST.NOISE_AMP;
  assert.equal(maxE, expected);
});

test("ships particle + quad GLSL with the live dissolve uniforms", () => {
  const { vs, fs, qvs, qfs } = buildDustShaders();
  for (const token of ["aHome", "scatterPos", "uPhase", "uWaveC", "WAVE_SPEED"]) {
    assert.ok(vs.includes(token), `particle vert missing ${token}`);
  }
  assert.ok(fs.includes("gl_PointCoord"));
  assert.ok(qvs.includes("aUV"));
  assert.ok(qfs.includes("front(vPx, uWaveC)"));
  assert.ok(qfs.includes("uWaveR"));
});

test("gallery pill is 220x64", () => {
  assert.equal(DUST.BW, 220);
  assert.equal(DUST.BH, 64);
  assert.equal(DUST.FONT, 17);
  assert.equal(DUST.RADIUS, 15);
});

test("DUST_PREMIUM_META describes the Go Premium dust pill", () => {
  assert.equal(DUST_PREMIUM_META.id, "dust-premium");
  assert.equal(DUST_PREMIUM_META.name, "Premium dust");
  assert.match(DUST_PREMIUM_META.states, /focus-visible/);
  assert.match(DUST_PREMIUM_META.states, /reduced motion/);
});

test("slots.js registers DustPremiumButtonPreview as dust-premium after claude-code", () => {
  const slots = readFileSync(join(root, "src/slots.js"), "utf8");
  assert.ok(slots.includes("DustPremiumButtonPreview"));
  assert.ok(slots.includes('id: "dust-premium"'));
  const claude = slots.lastIndexOf('id: "claude-code"');
  const dust = slots.lastIndexOf('id: "dust-premium"');
  assert.ok(claude > 0 && dust > claude, "dust-premium must append after claude-code");
});

test("live CSS uses the source gradient, size, and unique prefix", () => {
  const css = readFileSync(join(dir, "dust-premium-button.css"), "utf8");
  assert.match(css, /linear-gradient\(90deg,\s*#f2464d,\s*#f0821e\)/);
  assert.match(css, /min\(220px,\s*100%\)/);
  assert.match(css, /height:\s*64px/);
  assert.match(css, /border-radius:\s*15px/);
  assert.match(css, /font:\s*700 17px/);
  assert.match(css, /\.dust-premium-gl/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test("html/react/node snippets are complete Go Premium stacks", () => {
  const required = [
    "Go Premium",
    "dust-premium",
    "webgl",
    "#f2464d",
    "#f0821e",
    "scatterPos",
    "<button",
    "220px",
    "64px",
  ];

  for (const key of ["html", "react", "node"]) {
    assert.equal(typeof DUST_PREMIUM_SNIPPETS[key], "string");
    const snippet = DUST_PREMIUM_SNIPPETS[key];
    for (const token of required) {
      assert.ok(
        snippet.toLowerCase().includes(token.toLowerCase()) || snippet.includes(token),
        `${key} missing ${token}`,
      );
    }
  }

  assert.match(DUST_PREMIUM_SNIPPETS.html, /<!doctype html>/i);
  assert.match(DUST_PREMIUM_SNIPPETS.react, /export default function/);
  assert.match(DUST_PREMIUM_SNIPPETS.node, /createServer|listen\(3000/);
  assert.match(DUST_PREMIUM_SNIPPETS.html, /prefers-reduced-motion/);
  assert.match(DUST_PREMIUM_SNIPPETS.react, /prefers-reduced-motion/);
});
