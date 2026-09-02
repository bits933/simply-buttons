import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  NEXTJS_FLARE_META,
  NEXTJS_FLARE_SNIPPETS,
} from "./nextjs-flare-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Next.js flare stroke button has volumetric Three.js shader, glass rim styling, and meta contracts", () => {
  const css = readFileSync(join(dir, "nextjs-flare-button.css"), "utf8");
  assert.match(css, /\.nextjs-flare-root/);
  assert.match(css, /\.njf-wrap/);
  assert.match(css, /\.njf-canvas/);
  assert.match(css, /\.btn-nextjs-flare/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const js = readFileSync(join(dir, "nextjs-flare-webgl.js"), "utf8");
  assert.match(js, /initNextjsFlare/);
  assert.match(js, /u_pointer/);
  assert.match(js, /u_hover/);
  assert.match(js, /sdRoundedBox/);
  assert.match(js, /ShaderMaterial/);

  const jsx = readFileSync(join(dir, "NextjsFlareButton.jsx"), "utf8");
  assert.match(jsx, /data-nextjs-flare/);
  assert.match(jsx, /njf-wrap/);
  assert.match(jsx, /btn-nextjs-flare/);
  assert.match(jsx, /type="button"/);

  for (const [stack, snippet] of Object.entries(NEXTJS_FLARE_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("njf-canvas"), `${stack} missing njf-canvas`);
    assert.ok(snippet.includes("Next.js Flare"), `${stack} missing Next.js Flare text`);
  }

  assert.equal(NEXTJS_FLARE_META.id, "nextjs-flare");
  assert.ok(NEXTJS_FLARE_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(NEXTJS_FLARE_META.keywords.includes("animated button"));
  assert.ok(NEXTJS_FLARE_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "nextjs-flare"/g) ?? []).length, 1);
  assert.equal(
    (slots.match(/preview: NextjsFlareButtonPreview/g) ?? []).length,
    1,
  );
});
