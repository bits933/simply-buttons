import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  LETTER_SCRAMBLE_CHARS,
  LETTER_SCRAMBLE_LABEL,
  buildLetterScrambleFrame,
  scrambleGlyph,
} from "./letter-scramble.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("scramble pool is letters only", () => {
  assert.equal(/^[A-Z]+$/.test(LETTER_SCRAMBLE_CHARS), true);
  assert.equal(/\d/.test(LETTER_SCRAMBLE_CHARS), false);
  assert.equal(/[^A-Z]/.test(LETTER_SCRAMBLE_CHARS), false);
  for (let tick = 0; tick < 80; tick += 1) {
    assert.match(scrambleGlyph(tick, tick + 3), /^[A-Z]$/);
  }
});

test("decode locks letters from left to right and never emits digits", () => {
  const text = LETTER_SCRAMBLE_LABEL;
  const early = buildLetterScrambleFrame(text, 0.2, 9);
  assert.equal(early[0], text[0]);
  const mid = buildLetterScrambleFrame(text, 0.5, 9);
  assert.notEqual(mid, text);
  assert.match(mid, /^[A-Z]+$/);
  assert.equal(/\d/.test(mid), false);
  assert.equal(buildLetterScrambleFrame(text, 1, 4), text);
  assert.equal(buildLetterScrambleFrame(text, 0, 2).length, text.length);
});

test("gallery snippets stay letter-only and sharp-cornered", async () => {
  const { LETTER_SCRAMBLE_SNIPPETS, LETTER_SCRAMBLE_META } = await import(
    "./letter-scramble.snippets.js"
  );
  const slots = readFileSync(join(dir, "../slots.js"), "utf8");
  const css = readFileSync(join(dir, "letter-scramble.css"), "utf8");
  assert.equal(LETTER_SCRAMBLE_META.id, "letter-scramble");
  assert.ok(slots.includes("LetterScramblePreview"));
  assert.ok(slots.includes('id: "letter-scramble"'));
  assert.match(css, /border-radius:\s*0/);
  for (const key of ["html", "react", "node"]) {
    const text = LETTER_SCRAMBLE_SNIPPETS[key];
    assert.equal(typeof text, "string");
    assert.match(text, /btn-lscram-btn/);
    assert.match(text, /BUTTON/);
    assert.match(text, /<button/);
    assert.match(text, /ABCDEFGHIJKLMNOPQRSTUVWXYZ/);
    assert.doesNotMatch(text, /abcdefghijklmnopqrstuvwxyz/);
    assert.match(text, /border-radius: 0/);
    assert.match(text, /font-weight: 700/);
  }
});
