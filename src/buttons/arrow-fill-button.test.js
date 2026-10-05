import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ARROW_FILL_META, ARROW_FILL_SNIPPETS } from "./arrow-fill-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Arrow fill button has distinctive marker, accessible button contracts, and meta contracts", () => {
  const css = readFileSync(join(dir, "arrow-fill-button.css"), "utf8");
  assert.match(css, /\.arrow-fill-root/);
  assert.match(css, /\.hpx-afb/);
  assert.match(css, /--hpx-afb-marker/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /#ff5f00/);
  assert.match(css, /clip-path/);
  assert.match(css, /450ms/);

  const jsx = readFileSync(join(dir, "ArrowFillButton.jsx"), "utf8");
  assert.match(jsx, /data-hpx-afb/);
  assert.match(jsx, /hpx-afb/);
  assert.match(jsx, /type="button"/);
  assert.match(jsx, /ArrowFillButtonPreview/);

  for (const [stack, snippet] of Object.entries(ARROW_FILL_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("hpx-afb"), `${stack} missing marker hpx-afb`);
    assert.ok(snippet.includes("--hpx-afb-marker"), `${stack} missing marker --hpx-afb-marker`);
  }

  assert.ok(ARROW_FILL_SNIPPETS.html.includes('type="button"'));
  assert.ok(ARROW_FILL_SNIPPETS.react.includes('type="button"'));
  assert.ok(ARROW_FILL_SNIPPETS.node.includes("createServer"));
  assert.ok(ARROW_FILL_SNIPPETS.node.includes("node:http"));

  assert.equal(ARROW_FILL_META.id, "arrow-fill");
  assert.equal(ARROW_FILL_META.name, "Arrow fill");
  assert.ok(ARROW_FILL_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(ARROW_FILL_META.keywords.includes("animated button"));
  assert.ok(ARROW_FILL_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "arrow-fill"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: ArrowFillButtonPreview/g) ?? []).length, 1);
});
