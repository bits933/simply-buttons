import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

test("starlight button ships a generating state, two stars, and gallery snippets", async () => {
  const { STARLIGHT_GENERATE_META, STARLIGHT_GENERATE_SNIPPETS } = await import("./starlight-generate.snippets.js");
  const directory = dirname(fileURLToPath(import.meta.url));
  const css = readFileSync(join(directory, "starlight-generate.css"), "utf8");
  const component = readFileSync(join(directory, "StarlightGenerateButton.jsx"), "utf8");
  const slots = readFileSync(join(directory, "../slots.js"), "utf8");

  assert.equal(STARLIGHT_GENERATE_META.id, "starlight-generate");
  assert.ok(css.includes("cubic-bezier(.65, 0, .35, 1)"));
  assert.ok(!css.includes("width: min(250px, calc(100vw - 64px))"));
  assert.ok(css.includes("height: 62px"));
  assert.ok(css.includes("padding: 0 18px"));
  assert.ok(css.includes("min-width: 12ch"));
  assert.ok(css.includes("transform: translateX(10.75px)"));
  assert.ok(css.includes("starlight-orbit"));
  assert.ok(css.includes("@property --starlight-orbit"));
  assert.ok(!css.includes("transparent 0 8%"));
  assert.ok(css.includes("starlight-twinkle"));
  assert.match(
    css,
    /\.btn-starlight-btn\.is-active \.btn-starlight-star\s*\{\s*animation:\s*starlight-twinkle/
  );
  assert.doesNotMatch(
    css,
    /\.btn-starlight-btn:hover:not\(:disabled\) \.btn-starlight-star\s*\{\s*animation:\s*starlight-twinkle/
  );
  assert.ok(!css.includes("starlight-load-dot"));
  assert.ok(css.includes(".btn-starlight-btn.is-active .btn-starlight-label"));
  assert.ok(css.includes("background: linear-gradient(135deg, #7935ff 0%, #401078 100%)"));
  assert.ok(css.includes("prefers-reduced-motion"));
  assert.equal((component.match(/<StarFour/g) ?? []).length, 2);
  assert.ok(!component.includes("star--three"));
  assert.ok(component.includes("setActive(true)"));
  assert.ok(component.includes("setTimeout(() => setActive(false), 3000)"));
  assert.ok(component.includes("aria-busy={active}"));
  assert.ok(!component.includes("btn-starlight-dot"));
  assert.ok(slots.includes("StarlightGeneratePreview"));
  for (const key of ["html", "react", "node"]) {
    assert.ok(STARLIGHT_GENERATE_SNIPPETS[key].includes("Generate Site"));
    assert.ok(STARLIGHT_GENERATE_SNIPPETS[key].includes("Generating"));
    assert.ok(STARLIGHT_GENERATE_SNIPPETS[key].includes("aria-pressed"));
    assert.ok(STARLIGHT_GENERATE_SNIPPETS[key].includes("aria-busy"));
    assert.ok(STARLIGHT_GENERATE_SNIPPETS[key].includes("3000"));
    assert.ok(!STARLIGHT_GENERATE_SNIPPETS[key].includes("width:250px"));
    assert.ok(STARLIGHT_GENERATE_SNIPPETS[key].includes("padding:0 18px"));
    assert.ok(STARLIGHT_GENERATE_SNIPPETS[key].includes("min-width:12ch"));
    assert.ok(!STARLIGHT_GENERATE_SNIPPETS[key].includes("btn-starlight-dot"));
    assert.ok(!STARLIGHT_GENERATE_SNIPPETS[key].includes("star--three"));
  }
});
