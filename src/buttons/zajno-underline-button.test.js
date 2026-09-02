import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { ZAJNO_UNDERLINE_META, ZAJNO_UNDERLINE_SNIPPETS } from "./zajno-underline-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Zajno underline button wipes its two-half line across on hover", () => {
  const css = readFileSync(join(dir, "zajno-underline-button.css"), "utf8");
  assert.match(css, /--aw-line-wipe: 1/);
  assert.match(css, /translate3d\(-102%, 0, 0\)/);
  assert.match(css, /#ff2a85/);
  assert.match(css, /--zajno-ink:/);
  assert.match(css, /800ms cubic-bezier\(0\.77, 0, 0\.18, 1\)/);
  assert.match(css, /text-transform: lowercase/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  const jsx = readFileSync(join(dir, "ZajnoUnderlineButton.jsx"), "utf8");
  assert.match(jsx, /data-zajno-underline/);
  assert.match(jsx, /type="button"/);
  for (const [stack, snippet] of Object.entries(ZAJNO_UNDERLINE_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `html/react/node ${stack} needs a button`);
    assert.ok(snippet.includes("--aw-line-wipe"), `${stack} snippet missing marker`);
  }
  assert.equal(ZAJNO_UNDERLINE_META.id, "aw-zajno-underline");
  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "aw-zajno-underline"/g) ?? []).length, 1);
  assert.equal((slots.match(/preview: ZajnoUnderlineButtonPreview/g) ?? []).length, 1);
});
