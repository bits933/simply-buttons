import assert from "node:assert/strict";
import test from "node:test";
import {
  MITKO_CTA,
  buildMitkoCtaCss,
  mitkoCtaGradient,
  mitkoHoverPaint,
  mitkoRestPaint,
  mitkoRgb,
} from "./mitko-cta.tokens.js";

test("wipe tokens ship the requested plain button label", () => {
  assert.equal(MITKO_CTA.restPosition, "100% 50%");
  assert.equal(MITKO_CTA.hoverPosition, "0% 50%");
  assert.equal(MITKO_CTA.size, "201%");
  assert.equal(MITKO_CTA.duration, "0.3s");
  assert.equal(MITKO_CTA.easing, "cubic-bezier(0, 0, 0.58, 1)");
  assert.equal(MITKO_CTA.gray, "rgb(150, 150, 150)");
  assert.equal(MITKO_CTA.ink, "rgb(36, 33, 38)");
  assert.equal(MITKO_CTA.title, "this is a button");
  assert.equal(MITKO_CTA.pressedFontSize, "14px");
});

test("gallery snippets and slot registration ship the same CTA", async () => {
  const { MITKO_CTA_SNIPPETS, MITKO_CTA_META } = await import(
    "./mitko-cta.snippets.js"
  );
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const slots = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../slots.js"),
    "utf8",
  );
  assert.ok(slots.includes("MitkoCtaPreview"));
  assert.ok(slots.includes('id: "mitko-cta"'));
  assert.ok(slots.includes("MITKO_CTA_SNIPPETS"));
  assert.equal(MITKO_CTA_META.id, "mitko-cta");
  for (const key of ["html", "react", "node"]) {
    assert.equal(typeof MITKO_CTA_SNIPPETS[key], "string");
    assert.ok(MITKO_CTA_SNIPPETS[key].includes("this is a button"));
    assert.ok(MITKO_CTA_SNIPPETS[key].includes("<button"));
    assert.ok(!MITKO_CTA_SNIPPETS[key].includes("mailto:"));
    assert.ok(MITKO_CTA_SNIPPETS[key].includes("201%"));
    assert.ok(MITKO_CTA_SNIPPETS[key].includes("background-position"));
  }
});

test("gradient maps gray then ink and CSS is built from shipped tokens", () => {
  assert.equal(
    mitkoCtaGradient(),
    `linear-gradient(to left, ${MITKO_CTA.gray} 50%, ${MITKO_CTA.ink} 50%)`,
  );
  const ink = mitkoRgb(MITKO_CTA.ink);
  const gray = mitkoRgb(MITKO_CTA.gray);
  assert.equal(`rgb(${ink.r}, ${ink.g}, ${ink.b})`, MITKO_CTA.ink);
  assert.equal(`rgb(${gray.r}, ${gray.g}, ${gray.b})`, MITKO_CTA.gray);
  assert.deepEqual(mitkoRestPaint(), gray);
  assert.deepEqual(mitkoHoverPaint(), ink);
  assert.ok(ink.r < gray.r && ink.g < gray.g && ink.b < gray.b);
  const css = buildMitkoCtaCss();
  assert.ok(css.includes(mitkoCtaGradient()));
  assert.ok(css.includes(`background-size: ${MITKO_CTA.size} auto`));
  assert.ok(css.includes(`background-position: ${MITKO_CTA.restPosition}`));
  assert.ok(css.includes(`background-position: ${MITKO_CTA.hoverPosition}`));
  assert.ok(css.includes(`transition: background-position ${MITKO_CTA.duration} ${MITKO_CTA.easing}`));
  assert.ok(css.includes(`.btn-mitko-btn:active`));
  assert.ok(css.includes(`font-size: ${MITKO_CTA.pressedFontSize}`));
});
