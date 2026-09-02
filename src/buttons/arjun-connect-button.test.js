import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  ARJUN_CONNECT_META,
  ARJUN_CONNECT_SNIPPETS,
} from "./arjun-connect-button.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Arjun connect button has scribble boiling loop, chalk SVG filters, and meta contracts", () => {
  const css = readFileSync(join(dir, "arjun-connect-button.css"), "utf8");
  assert.match(css, /\.arjun-connect-root/);
  assert.match(css, /\.btn-arjun-connect/);
  assert.match(css, /\.ac-stamp-wrap/);
  assert.match(css, /\.ac-scribble-1/);
  assert.match(css, /\.ac-scribble-2/);
  assert.match(css, /\.ac-scribble-3/);
  assert.match(css, /@keyframes ac-boil-1/);
  assert.match(css, /@keyframes ac-boil-2/);
  assert.match(css, /@keyframes ac-boil-3/);
  assert.match(css, /@keyframes ac-stamp-pop/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const jsx = readFileSync(join(dir, "ArjunConnectButton.jsx"), "utf8");
  assert.match(jsx, /data-arjun-connect/);
  assert.match(jsx, /filter id="ac-chalk"/);
  assert.match(jsx, /filter id="ac-text-chalk"/);
  assert.match(jsx, /filter id="ac-chalk-echo"/);
  assert.match(jsx, /btn-arjun-connect/);
  assert.match(jsx, /type="button"/);

  for (const [stack, snippet] of Object.entries(ARJUN_CONNECT_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("ac-chalk"), `${stack} missing chalk filter`);
    assert.ok(snippet.includes("ac-stamp-wrap"), `${stack} missing stamp wrap`);
    assert.ok(snippet.includes("connect"), `${stack} missing connect text`);
  }

  assert.equal(ARJUN_CONNECT_META.id, "arjun-connect");
  assert.ok(ARJUN_CONNECT_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(ARJUN_CONNECT_META.keywords.includes("animated button"));
  assert.ok(ARJUN_CONNECT_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "arjun-connect"/g) ?? []).length, 1);
  assert.equal(
    (slots.match(/preview: ArjunConnectButtonPreview/g) ?? []).length,
    1,
  );
});
