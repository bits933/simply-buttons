import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  ARJUN_SOCIAL_META,
  ARJUN_SOCIAL_SNIPPETS,
} from "./arjun-social-buttons.snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("Arjun social stamp buttons have spinning dashed ring, neighbor wave, and meta contracts", () => {
  const css = readFileSync(join(dir, "arjun-social-buttons.css"), "utf8");
  assert.match(css, /\.arjun-social-root/);
  assert.match(css, /\.as-cluster/);
  assert.match(css, /\.as-stamp-btn/);
  assert.match(css, /\.as-ring/);
  assert.match(css, /\.as-icon/);
  assert.match(css, /@keyframes as-ring-spin/);
  assert.match(css, /@keyframes as-stamp-pop/);
  assert.match(css, /prefers-reduced-motion: reduce/);

  const jsx = readFileSync(join(dir, "ArjunSocialButtons.jsx"), "utf8");
  assert.match(jsx, /data-arjun-social/);
  assert.match(jsx, /as-cluster/);
  assert.match(jsx, /as-stamp-btn/);
  assert.match(jsx, /type="button"/);
  assert.match(jsx, /LinkedIn/);
  assert.match(jsx, /GitHub/);
  assert.match(jsx, /Email/);
  assert.match(jsx, /Twitter/);

  for (const [stack, snippet] of Object.entries(ARJUN_SOCIAL_SNIPPETS)) {
    assert.ok(snippet.includes("<button"), `${stack} needs a button element`);
    assert.ok(snippet.includes("as-stamp-btn"), `${stack} missing as-stamp-btn`);
    assert.ok(snippet.includes("LinkedIn"), `${stack} missing LinkedIn`);
    assert.ok(snippet.includes("GitHub"), `${stack} missing GitHub`);
    assert.ok(snippet.includes("Email"), `${stack} missing Email`);
    assert.ok(snippet.includes("Twitter"), `${stack} missing Twitter`);
  }

  assert.equal(ARJUN_SOCIAL_META.id, "arjun-social");
  assert.ok(ARJUN_SOCIAL_META.keywords.length >= 17, "keywords contract (>= 17)");
  assert.ok(ARJUN_SOCIAL_META.keywords.includes("animated button"));
  assert.ok(ARJUN_SOCIAL_META.keywords.includes("interactive button"));

  const slots = readFileSync(join(dir, "..", "slots.js"), "utf8");
  assert.equal((slots.match(/id: "arjun-social"/g) ?? []).length, 1);
  assert.equal(
    (slots.match(/preview: ArjunSocialButtonsPreview/g) ?? []).length,
    1,
  );
});
