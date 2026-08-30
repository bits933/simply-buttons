import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

test("orano push cta button component, css, snippets, and registration conform to specs", async () => {
  const { ORANO_PUSH_CTA_META, ORANO_PUSH_CTA_SNIPPETS } = await import("./orano-push-cta.snippets.js");
  const directory = dirname(fileURLToPath(import.meta.url));
  const css = readFileSync(join(directory, "orano-push-cta.css"), "utf8");
  const component = readFileSync(join(directory, "OranoPushCtaButton.jsx"), "utf8");
  const slots = readFileSync(join(directory, "../slots.js"), "utf8");

  assert.equal(ORANO_PUSH_CTA_META.id, "orano-push-cta");
  assert.equal(ORANO_PUSH_CTA_META.name, "Color slide in");

  // Check CSS classes and key properties
  assert.ok(css.includes("btn-orano-btn"));
  assert.ok(css.includes("btn-orano-overflow"));
  assert.ok(css.includes("btn-orano-bg"));
  assert.ok(css.includes("btn-orano-hover"));
  assert.ok(css.includes("btn-orano-hover-inner"));
  assert.ok(css.includes("btn-orano-noise"));
  assert.ok(css.includes("btn-orano-rgb"));
  assert.ok(css.includes("btn-orano-stroke"));
  assert.ok(css.includes("btn-orano-label"));
  assert.ok(css.includes("#ffe600"));
  assert.ok(css.includes("cubic-bezier(0.75, 0, 0.25, 1)"));
  assert.ok(css.includes("@keyframes btn-orano-noise"));

  // Check Component DOM
  assert.ok(component.includes("btn-orano-btn"));
  assert.ok(component.includes("btn-orano-rgb red"));
  assert.ok(component.includes("btn-orano-rgb green"));
  assert.ok(component.includes("btn-orano-noise"));
  assert.ok(component.includes("btn-orano-stroke"));

  // Check Slots Registration
  assert.ok(slots.includes("OranoPushCtaPreview"));
  assert.ok(slots.includes("ORANO_PUSH_CTA_META"));

  // Check Snippets
  for (const key of ["html", "react", "node"]) {
    assert.ok(ORANO_PUSH_CTA_SNIPPETS[key].includes("btn-orano-btn"));
    assert.ok(ORANO_PUSH_CTA_SNIPPETS[key].includes("btn-orano-noise"));
    assert.ok(ORANO_PUSH_CTA_SNIPPETS[key].includes("#ffe600"));
  }
});
