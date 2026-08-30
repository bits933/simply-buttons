import assert from "node:assert/strict";
import test from "node:test";
import {
  STAR_BUTTON,
  STAR_LOTTIE_FILE,
  STAR_PATH,
  buildStarButtonCss,
} from "./star-button.tokens.js";

test("star button tokens match the Dribbble split pill", () => {
  assert.equal(STAR_BUTTON.label, "Star");
  assert.equal(STAR_BUTTON.labelOn, "Starred");
  assert.equal(STAR_BUTTON.countOn, STAR_BUTTON.countOff + 1);
  assert.equal(STAR_BUTTON.plus, "+1");
  assert.equal(STAR_BUTTON.gold, "rgb(232, 168, 12)");
  assert.equal(STAR_BUTTON.inactiveInk, "#545454");
  assert.equal(STAR_BUTTON.hoverMs, "280ms");
  assert.equal(STAR_LOTTIE_FILE, "wired-flat-237-star-hover-pinch.json");
  assert.ok(STAR_PATH.includes("M12"));
});

test("built CSS scales the pill, insets the face, and keeps glow on the root", () => {
  const css = buildStarButtonCss();
  assert.ok(css.includes(STAR_BUTTON.gold));
  assert.ok(css.includes("scale(1.03)"));
  assert.ok(css.includes("transform-origin: 50% 50%"));
  assert.ok(css.includes("btn-star-line"));
  assert.ok(css.includes("Starred") || css.includes("btn-star-swap"));
  assert.ok(css.includes(STAR_BUTTON.popMs));
  assert.ok(!css.includes("rotateY"));
  assert.ok(!css.includes("btn-star-yaw"));
  assert.ok(!css.includes("background-position"));
});

test("gallery snippets and slot registration ship the star button", async () => {
  const { STAR_BUTTON_SNIPPETS, STAR_BUTTON_META } = await import(
    "./star-button.snippets.js"
  );
  const { readFileSync } = await import("node:fs");
  const { fileURLToPath } = await import("node:url");
  const { dirname, join } = await import("node:path");
  const slots = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../slots.js"),
    "utf8",
  );
  assert.ok(slots.includes("StarPreview"));
  assert.ok(slots.includes('id: "star-button"'));
  assert.equal(STAR_BUTTON_META.id, "star-button");
  for (const key of ["html", "react", "node"]) {
    const text = STAR_BUTTON_SNIPPETS[key];
    assert.equal(typeof text, "string");
    assert.ok(text.includes("Starred"));
    assert.ok(text.includes("+1"));
    assert.ok(text.includes("aria-pressed"));
    assert.ok(text.includes(STAR_LOTTIE_FILE));
    assert.ok(text.includes("btn-star-line"));
    assert.ok(!text.includes("btn-star-yaw"));
    assert.ok(!text.includes("mailto:"));
  }
  assert.ok(STAR_BUTTON_SNIPPETS.html.includes("lottie-web"));
  assert.ok(STAR_BUTTON_SNIPPETS.react.includes("lottie-react"));
});
