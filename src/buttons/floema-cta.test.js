import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

test("floema gooey button component, css, snippets, and registration conform to specs", async () => {
  const { FLOEMA_CTA_META, FLOEMA_CTA_SNIPPETS } = await import("./floema-cta.snippets.js");
  const directory = dirname(fileURLToPath(import.meta.url));
  const css = readFileSync(join(directory, "floema-cta.css"), "utf8");
  const component = readFileSync(join(directory, "FloemaCtaButton.jsx"), "utf8");
  const slots = readFileSync(join(directory, "../slots.js"), "utf8");

  assert.equal(FLOEMA_CTA_META.id, "floema-cta");
  assert.ok(FLOEMA_CTA_META.name.toLowerCase().includes("floema"));
  assert.ok(css.includes("btn-floema-button"));
  assert.ok(css.includes("btn-floema-goo-layer"));
  assert.ok(css.includes("btn-floema-blob--icon"));
  assert.ok(css.includes("btn-floema-blob--label"));
  assert.ok(css.includes("btn-floema-content-layer"));
  assert.ok(css.includes("btn-floema-icon-side"));
  assert.ok(css.includes("btn-floema-label"));
  assert.ok(css.includes("filter: url(#floema-goo-effect)"));
  assert.ok(css.includes("cubic-bezier(0.175, 0.885, 0.32, 1.275)"));
  assert.ok(css.includes("cubic-bezier(0.12, 1.2, 0.16, 2.35)"));
  assert.ok(css.includes("margin-right: 14px"));
  assert.ok(css.includes("transform: scale(1.07)"));

  assert.ok(component.includes("FloemaUrbanIcon"));
  assert.ok(component.includes("floema-goo-effect"));
  assert.ok(component.includes("feGaussianBlur"));
  assert.ok(component.includes("feColorMatrix"));
  assert.ok(component.includes("feComposite"));

  assert.ok(slots.includes("FloemaCtaPreview"));
  assert.ok(slots.includes("FLOEMA_CTA_META"));

  for (const key of ["html", "react", "node"]) {
    assert.ok(FLOEMA_CTA_SNIPPETS[key].includes("SEE URBAN PRODUCTS"));
    assert.ok(FLOEMA_CTA_SNIPPETS[key].includes("btn-floema-button"));
    assert.ok(FLOEMA_CTA_SNIPPETS[key].includes("floema-goo-effect"));
  }
});
