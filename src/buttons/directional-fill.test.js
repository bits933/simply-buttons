import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("directional fill enters below and exits above without an icon", async () => {
  const { DIRECTIONAL_FILL_META, DIRECTIONAL_FILL_SNIPPETS } = await import("./directional-fill.snippets.js");
  const css = await readFile(new URL("./directional-fill.css", import.meta.url), "utf8");
  const component = await readFile(new URL("./DirectionalFillButton.jsx", import.meta.url), "utf8");
  const slots = await readFile(new URL("../slots.js", import.meta.url), "utf8");

  assert.equal(DIRECTIONAL_FILL_META.id, "directional-fill");
  assert.match(css, /font-family:\s*"IBM Plex Sans", "Segoe UI", system-ui, sans-serif/);
  assert.match(css, /transform:\s*translateY\(102%\)/);
  assert.match(css, /transform:\s*translateY\(-102%\)/);
  assert.match(css, /cubic-bezier\(\.65, 0, \.35, 1\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(component, /onPointerEnter/);
  assert.match(component, /onPointerLeave/);
  assert.match(component, /onTransitionEnd/);
  assert.doesNotMatch(component, /svg|mark|icon/i);
  assert.match(slots, /DirectionalFillPreview/);
  for (const snippet of Object.values(DIRECTIONAL_FILL_SNIPPETS)) {
    assert.match(snippet, /translateY\(102%\)/);
    assert.match(snippet, /translateY\(-102%\)/);
    assert.doesNotMatch(snippet, /btn-rise-mark/);
  }
});

test("directional fill resets reduced-motion exits and keeps its native button type", async () => {
  const { DIRECTIONAL_FILL_SNIPPETS } = await import("./directional-fill.snippets.js");
  const component = await readFile(new URL("./DirectionalFillButton.jsx", import.meta.url), "utf8");

  for (const source of [component, DIRECTIONAL_FILL_SNIPPETS.react]) {
    assert.match(source, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches/);
    assert.match(source, /setMotion\("idle"\);\s*return;/);
    assert.match(source, /\{\.\.\.rest\}\s*type="button"/);
  }
  assert.match(DIRECTIONAL_FILL_SNIPPETS.node, /require\("node:http"\)/);
  assert.doesNotMatch(DIRECTIONAL_FILL_SNIPPETS.node, /express/);
  assert.match(DIRECTIONAL_FILL_SNIPPETS.html, /:root\[data-theme="dark"\]/);
});

test("directional fill resets idle instantly and normalizes interrupted or disabled motion", async () => {
  const { DIRECTIONAL_FILL_SNIPPETS } = await import("./directional-fill.snippets.js");
  const css = await readFile(new URL("./directional-fill.css", import.meta.url), "utf8");
  const component = await readFile(new URL("./DirectionalFillButton.jsx", import.meta.url), "utf8");

  for (const source of [css, ...Object.values(DIRECTIONAL_FILL_SNIPPETS)].map((value) => value.replaceAll('\\"', '"'))) {
    assert.match(source, /\.btn-directional-fill\s*\{[^}]*transition:\s*none;/s);
    assert.match(source, /data-motion="active"[^}]*transition:\s*transform/);
    assert.match(source, /data-motion="exiting"[^}]*transition:\s*transform/);
  }
  for (const source of [component, DIRECTIONAL_FILL_SNIPPETS.react]) {
    assert.match(source, /const renderedMotion = disabled \? "idle" : motion;/);
    assert.match(source, /motion === "exiting"/);
    assert.match(source, /requestAnimationFrame/);
    assert.match(source, /if \(disabled\) return;/);
  }
  for (const source of [DIRECTIONAL_FILL_SNIPPETS.html, DIRECTIONAL_FILL_SNIPPETS.node].map((value) => value.replaceAll('\\"', '"'))) {
    assert.match(source, /button\.disabled \? "idle" : motion/);
    assert.match(source, /if \(button\.disabled\) return;/);
    assert.match(source, /requestAnimationFrame/);
  }
});
