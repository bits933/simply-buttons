import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { RESN_ROLL_SLAB_META, RESN_ROLL_SLAB_SNIPPETS } from "./resn-roll-slab-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Resn roll slab auto-cycles its stacked label lines", () => {
  const css = readFileSync(join(dir, "resn-roll-slab-button.css"), "utf8");
  assert.match(css, /--aw-slab-roll: 1/);
  assert.match(css, /height: 1\.2em/);
  assert.match(css, /animation: aw-slab-cycle 6400ms/);
  assert.match(css, /@keyframes aw-slab-cycle/);
  assert.match(css, /animation-play-state: paused/);
  assert.match(css, /#dfff5c/);
  assert.doesNotMatch(css, /\.resn-roll-slab-root\s*\{[^}]*background:/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /animation: none/);
  const jsx = readFileSync(join(dir, "ResnRollSlabButton.jsx"), "utf8");
  assert.match(jsx, /data-resn-roll-slab/);
  assert.match(jsx, /29 manufacturing companies/);
  assert.match(jsx, /rs-column/);
  for (const [stack, snippet] of Object.entries(RESN_ROLL_SLAB_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-slab-roll"), `${stack} snippet missing marker`);
    assert.ok(!snippet.includes("background: #fafbf7"), `${stack} preview root must stay transparent`);
  }
  assert.equal(RESN_ROLL_SLAB_META.id, "aw-resn-slab");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-resn-slab"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: ResnRollSlabButtonPreview/g) ?? []).length, 1);
});
