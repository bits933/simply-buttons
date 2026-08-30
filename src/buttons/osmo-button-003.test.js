import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));

test("osmo button 003 replicates the dashed-circle mask and circular text swap", () => {
  const css = readFileSync(join(dir, "osmo-button-003.css"), "utf8");
  assert.match(css, /--button-003-color-background:\s*#f84131/);
  assert.doesNotMatch(css, /#f1e8da/, "cards must keep the site well background, not cream");
  assert.match(css, /stroke-dashoffset:\s*300px/);
  assert.match(css, /stroke-dashoffset:\s*110/);
  assert.match(css, /stroke-dasharray:\s*300/);
  assert.match(css, /rotate:\s*360deg/);
  assert.match(css, /rotate:\s*calc\(var\(--button-003-rotation-direction\) \* -60deg\)/);
  assert.match(css, /rotate:\s*calc\(var\(--button-003-rotation-direction\) \* 60deg\)/);
  assert.match(css, /data-button-theme='secondary'/);
  assert.match(css, /#ffce16/);
  assert.match(css, /button-003--flip/);
  assert.match(css, /button-003--pill/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(css, /osmo-tabs/, "the variant toggle must be gone");
});

test("osmo button 003 component renders one button per variant card", () => {
  const jsx = readFileSync(join(dir, "OsmoButton003.jsx"), "utf8");
  assert.match(jsx, /data-button-003/);
  assert.match(jsx, /button-003__circle-mask/);
  assert.match(jsx, /strokeDasharray="1 6"/);
  assert.match(jsx, /Long Button Label/);
  assert.match(jsx, /aria-label=\{iconOnly \? label : undefined\}/);
  assert.doesNotMatch(jsx, /osmo-tabs/, "the variant toggle must be gone");
  for (const preview of [
    "OsmoButton003DefaultPreview",
    "OsmoButton003AltPreview",
    "OsmoButton003LongPreview",
    "OsmoButton003IconCirclePreview",
    "OsmoButton003TextPreview",
    "OsmoButton003IconPreview",
  ]) {
    assert.match(jsx, new RegExp(`export function ${preview}\\(`));
  }
});

test("each osmo 003 variant ships three self-contained snippets", () => {
  const snippets = readFileSync(join(dir, "osmo-button-003.snippets.js"), "utf8");
  for (const key of ["DEFAULT", "ALT", "LONG", "ICON_CIRCLE", "TEXT", "ICON"]) {
    assert.match(snippets, new RegExp(`export const OSMO_003_${key}_SNIPPETS = `));
    assert.match(snippets, new RegExp(`export const OSMO_003_${key}_META = `));
  }
  assert.match(snippets, /data-button-003-mask|mask id=/);
  assert.match(snippets, /node: `const express = require\("express"\)/);
  assert.doesNotMatch(snippets, /data-tabs-tab/, "the variant toggle must be gone");
});

test("osmo 003 variants are appended at the end of the gallery in demo order", () => {
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  const order = [
    "osmo-003-default",
    "osmo-003-alt",
    "osmo-003-long",
    "osmo-003-icon-circle",
    "osmo-003-text",
    "osmo-003-icon",
  ];
  let prev = slots.indexOf('id: "orbit-stroke"');
  assert.ok(prev > -1, "orbit-stroke must come before the osmo variants");
  for (const id of order) {
    const at = slots.indexOf(`id: "${id}"`);
    assert.ok(at > prev, `${id} must be appended after the previous slot`);
    prev = at;
  }
});
