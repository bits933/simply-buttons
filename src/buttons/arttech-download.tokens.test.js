import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ARTTECH_DOWNLOAD,
  ARTTECH_DOWNLOAD_ICON,
  buildArttechDownloadCss,
} from "./arttech-download.tokens.js";

test("arttech download tokens match the live CTA motion and copy", () => {
  assert.equal(ARTTECH_DOWNLOAD.labelPrimary, "download");
  assert.equal(ARTTECH_DOWNLOAD.labelSecondary, "the full report");
  assert.equal(ARTTECH_DOWNLOAD.ease, "cubic-bezier(0.053, 0.001, 0.07, 0.995)");
  assert.equal(ARTTECH_DOWNLOAD.growDuration, "0.45s");
  assert.equal(ARTTECH_DOWNLOAD.colorDuration, "0.2s");
  assert.equal(ARTTECH_DOWNLOAD.downloadRadius, "9999px");
  assert.equal(ARTTECH_DOWNLOAD.reportRadius, "8px");
  assert.equal(ARTTECH_DOWNLOAD.joinOffset, "-2px");
});

test("generated CSS covers rest, hover, focus, and reduced motion", () => {
  const css = buildArttechDownloadCss();
  assert.ok(css.includes(ARTTECH_DOWNLOAD.ink));
  assert.ok(css.includes(ARTTECH_DOWNLOAD.hoverInk));
  assert.ok(css.includes("border-radius: 9999px"));
  assert.ok(css.includes("border-radius: 8px"));
  assert.ok(css.includes("margin-left: -2px"));
  assert.ok(css.includes(":hover"));
  assert.ok(css.includes(":focus-visible"));
  assert.ok(css.includes("prefers-reduced-motion"));
});

test("gallery snippets and preview are wired", async () => {
  const { ARTTECH_DOWNLOAD_SNIPPETS, ARTTECH_DOWNLOAD_META } = await import(
    "./arttech-download.snippets.js"
  );
  const slots = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../slots.js"),
    "utf8",
  );
  assert.ok(slots.includes("ArttechDownloadPreview"));
  assert.ok(slots.includes('id: "arttech-download"'));
  assert.equal(ARTTECH_DOWNLOAD_META.id, "arttech-download");
  assert.ok(ARTTECH_DOWNLOAD_ICON.includes("<svg"));
  for (const key of ["html", "react", "node"]) {
    const body = ARTTECH_DOWNLOAD_SNIPPETS[key];
    assert.equal(typeof body, "string");
    assert.ok(body.includes("btn-atr"));
    assert.ok(body.includes("download"));
    assert.ok(body.includes("the full report"));
  }
});
