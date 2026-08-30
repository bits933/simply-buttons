import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

test("morph button draws a centered tick before revealing Sent", async () => {
  const { MORPH_SNIPPETS } = await import("./morph.snippets.js");
  const directory = dirname(fileURLToPath(import.meta.url));
  const component = readFileSync(join(directory, "MorphButton.jsx"), "utf8");
  const css = readFileSync(join(directory, "morph.css"), "utf8");

  assert.ok(component.includes('successLabel = "Sent"'));
  assert.ok(component.includes('className="btn-morph-success"'));
  assert.ok(css.includes("btn-morph-success-in"));
  assert.match(css, /btn-morph-success-in [^;]* 0\.62s both/);
  assert.ok(css.includes("justify-content: center"));

  for (const snippet of Object.values(MORPH_SNIPPETS)) {
    assert.ok(snippet.includes("Sent"));
    assert.ok(snippet.includes("btn-morph-success"));
    assert.ok(snippet.includes("btn-morph-success-in"));
  }
});
