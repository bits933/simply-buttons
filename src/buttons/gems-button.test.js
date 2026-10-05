import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { GEMS_META, GEMS_SNIPPETS } from "./gems-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Gems button has distinctive marker, accessible button contracts, and meta contracts", () => {
  const css = readFileSync(join(dir, "gems-button.css"), "utf8");
  assert.match(css, /\.gems-root/);
  assert.match(css, /\.gems-btn/);
  assert.match(css, /--gems-marker/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /#ff7032/);
  assert.match(css, /#e95a37/);
  assert.match(css, /inset 1px -1px 4px/);
  assert.match(css, /box-shadow 260ms/);

  const jsx = readFileSync(join(dir, "GemsButton.jsx"), "utf8");
  assert.match(jsx, /data-gems/);
  assert.match(jsx, /gems-btn/);
  assert.match(jsx, /type="button"/);
  assert.match(jsx, /aria-label="Add"/);
  assert.match(jsx, /GemsButtonPreview/);

  for (const [stack, snippet] of Object.entries(GEMS_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("gems-btn"), `${stack} missing marker gems-btn`);
    assert.ok(snippet.includes("--gems-marker"), `${stack} missing marker --gems-marker`);
  }

  assert.ok(GEMS_SNIPPETS.html.includes('type="button"'));
  assert.ok(GEMS_SNIPPETS.react.includes('type="button"'));
  assert.ok(GEMS_SNIPPETS.node.includes("createServer"));
  assert.ok(GEMS_SNIPPETS.node.includes("node:http"));

  assert.equal(GEMS_META.id, "gems");
  assert.equal(GEMS_META.name, "Gems");
  assert.ok(GEMS_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(GEMS_META.keywords.includes("animated button"));
  assert.ok(GEMS_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "gems"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: GemsButtonPreview/g) ?? []).length, 1);
});
