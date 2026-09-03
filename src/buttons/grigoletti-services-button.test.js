import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  GRIGOLETTI_SERVICES_META,
  GRIGOLETTI_SERVICES_SNIPPETS,
} from "./grigoletti-services-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Grigoletti services has distinctive marker, accessible button contracts, and meta contracts", () => {
  const css = readFileSync(join(dir, "grigoletti-services-button.css"), "utf8");
  assert.match(css, /\.gs-root/);
  assert.match(css, /\.gs-serv-btn/);
  assert.match(css, /\.gs-toggle-btn/);
  assert.match(css, /\.gs-layer-rest/);
  assert.match(css, /\.gs-layer-hover/);
  assert.match(css, /PP Neue Corp Tight Ultrabold/);
  assert.match(css, /scale\(0\.6\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const jsx = readFileSync(join(dir, "GrigolettiServicesButton.jsx"), "utf8");
  assert.match(jsx, /data-grigoletti-services/);
  assert.match(jsx, /gs-serv-btn/);
  assert.match(jsx, /gs-toggle-btn/);
  assert.match(jsx, /gs-layer-rest/);
  assert.match(jsx, /gs-layer-hover/);
  assert.match(jsx, /type="button"/);

  for (const [stack, snippet] of Object.entries(GRIGOLETTI_SERVICES_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("gs-serv-btn"), `${stack} missing marker gs-serv-btn`);
  }

  assert.equal(GRIGOLETTI_SERVICES_META.id, "grigoletti-services");
  assert.ok(GRIGOLETTI_SERVICES_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(GRIGOLETTI_SERVICES_META.keywords.includes("animated button"));
  assert.ok(GRIGOLETTI_SERVICES_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "grigoletti-services"/g) ?? []).length, 1);
  assert.equal(
    (slots.match(/preview: GrigolettiServicesButtonPreview/g) ?? []).length,
    1,
  );
});
