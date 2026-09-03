import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  GRIGOLETTI_PROJECTS_META,
  GRIGOLETTI_PROJECTS_SNIPPETS,
} from "./grigoletti-projects-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Grigoletti projects has distinctive marker, accessible button contracts, and meta contracts", () => {
  const css = readFileSync(join(dir, "grigoletti-projects-button.css"), "utf8");
  assert.match(css, /\.gp-root/);
  assert.match(css, /\.gp-proj-btn/);
  assert.match(css, /\.gp-layer-rest/);
  assert.match(css, /\.gp-layer-hover/);
  assert.match(css, /PP Neue Corp Tight Ultrabold/);
  assert.match(css, /scale\(0\.6\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const jsx = readFileSync(join(dir, "GrigolettiProjectsButton.jsx"), "utf8");
  assert.match(jsx, /data-grigoletti-projects/);
  assert.match(jsx, /gp-proj-btn/);
  assert.match(jsx, /gp-layer-rest/);
  assert.match(jsx, /gp-layer-hover/);
  assert.match(jsx, /type="button"/);

  for (const [stack, snippet] of Object.entries(GRIGOLETTI_PROJECTS_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("gp-proj-btn"), `${stack} missing marker gp-proj-btn`);
  }

  assert.equal(GRIGOLETTI_PROJECTS_META.id, "grigoletti-projects");
  assert.ok(GRIGOLETTI_PROJECTS_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(GRIGOLETTI_PROJECTS_META.keywords.includes("animated button"));
  assert.ok(GRIGOLETTI_PROJECTS_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "grigoletti-projects"/g) ?? []).length, 1);
  assert.equal(
    (slots.match(/preview: GrigolettiProjectsButtonPreview/g) ?? []).length,
    1,
  );
});
