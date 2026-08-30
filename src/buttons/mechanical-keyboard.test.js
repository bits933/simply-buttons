import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  MECHANICAL_KEYBOARD_META,
  MECHANICAL_KEYBOARD_SNIPPETS,
} from "./mechanical-keyboard.snippets.js";

const directory = dirname(fileURLToPath(import.meta.url));
const assetDirectory = join(directory, "mechanical-key");

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();
}

test("ships the exact fixed base and single pressed-key artwork", () => {
  const assets = {
    "base.svg": "96251B8C65DA07B00D3791BC160A1D4ACC66FCB4A31CBBFCA19ED4BE8FEDFEAD",
    "clicked.svg": "2CEB669F320CFDFA135E726FD55CB777A9FA83A48F8825932DA9F1DEF73C6061",
    "click.mp3": "E94EFBDD81D156C56E677403BB899C37D0F559BC0E3582FDB25A48B350A9F213",
  };

  for (const [name, hash] of Object.entries(assets)) {
    const path = join(assetDirectory, name);
    assert.ok(existsSync(path), `missing ${name}`);
    assert.equal(sha256(path), hash, `${name} must stay byte-exact`);
  }
});

test("treats Space and Enter as mechanical press keys only", async () => {
  const { isMechanicalPressKey } = await import("./mechanical-keyboard.js");

  assert.equal(isMechanicalPressKey(" "), true);
  assert.equal(isMechanicalPressKey("Enter"), true);
  assert.equal(isMechanicalPressKey("Space"), false);
  assert.equal(isMechanicalPressKey("Escape"), false);
});

test("keeps one base fixed while translating one keycap", () => {
  const component = readFileSync(join(directory, "MechanicalKeyboardButton.jsx"), "utf8");
  const css = readFileSync(join(directory, "mechanical-keyboard.css"), "utf8");
  const snippets = Object.values(MECHANICAL_KEYBOARD_SNIPPETS).join("\n");

  assert.match(component, /<button\b[\s\S]*?type="button"/);
  for (const handler of [
    "onPointerUp",
    "onPointerCancel",
    "onLostPointerCapture",
    "onKeyUp",
    "onBlur",
  ]) {
    assert.match(component, new RegExp(`${handler}=`));
  }
  assert.match(component, /useEffect\([\s\S]*?if \(disabled\) \{?[\s\S]*?endPress/);
  assert.match(component, /function handleClick\(event\)[\s\S]*?playMechanicalClick\(\);[\s\S]*?onClick\?\.\(event\);/);
  assert.equal((component.match(/playMechanicalClick\(\)/g) ?? []).length, 1);
  assert.match(component, /import base from "\.\/mechanical-key\/base\.svg";/);
  assert.match(component, /import clicked from "\.\/mechanical-key\/clicked\.svg";/);
  assert.equal((component.match(/<img\b/g) ?? []).length, 2);
  assert.match(component, /btn-mechanical-keyboard-layer--base[\s\S]*?src=\{base\}/);
  assert.match(component, /btn-mechanical-keyboard-layer--keycap[\s\S]*?src=\{clicked\}/);
  assert.doesNotMatch(component, /inactiveButton|pressedButton/);
  assert.doesNotMatch(component, /aria-pressed/);
  assert.doesNotMatch(component, /\.click\(/);

  assert.match(css, /width:\s*176px/);
  assert.match(css, /height:\s*152px/);
  assert.match(css, /btn-mechanical-keyboard-layer--base[\s\S]*?top:\s*30\.2969px[\s\S]*?width:\s*176px[\s\S]*?height:\s*122px/);
  assert.match(css, /btn-mechanical-keyboard-layer--keycap[\s\S]*?left:\s*13\.6289px[\s\S]*?top:\s*0[\s\S]*?width:\s*152px[\s\S]*?height:\s*124px[\s\S]*?transform:\s*translateY\(0\)[\s\S]*?transition:\s*transform/);
  assert.match(css, /is-pressed[\s\S]*?btn-mechanical-keyboard-layer--keycap[\s\S]*?transform:\s*translateY\(6px\)/);
  assert.match(css, /is-pressed[\s\S]*?btn-mechanical-keyboard-layer--keycap[\s\S]*?filter:\s*drop-shadow\(0 4px 6px rgba\(18, 19, 21, 0\.18\)\)/);
  assert.match(snippets, /filter:drop-shadow\(0 4px 6px rgba\(18,19,21,\.18\)\)/);
  assert.doesNotMatch(css, /btn-mechanical-keyboard-image--inactive|btn-mechanical-keyboard-image--pressed/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("serves the keyboard click sample from public sfx", () => {
  const publicClick = join(directory, "..", "..", "public", "sfx", "mechanical-keyboard-click.mp3");
  assert.ok(existsSync(publicClick), "missing public/sfx/mechanical-keyboard-click.mp3");
  assert.equal(sha256(publicClick), "E94EFBDD81D156C56E677403BB899C37D0F559BC0E3582FDB25A48B350A9F213");
});

test("ships matching native momentary snippets and registers the States specimen", () => {
  assert.equal(MECHANICAL_KEYBOARD_META.id, "mechanical-keyboard");
  assert.equal(MECHANICAL_KEYBOARD_META.name, "Mechanical keyboard");
  assert.equal(
    MECHANICAL_KEYBOARD_META.blurb,
    "Native momentary key with a fixed supplied base, one translating keycap, and a restrained mechanical click.",
  );
  assert.equal(MECHANICAL_KEYBOARD_META.states, "idle, press, focus, disabled, reduced motion");
  assert.ok(MECHANICAL_KEYBOARD_META.keywords.includes("mechanical click"));

  for (const snippet of Object.values(MECHANICAL_KEYBOARD_SNIPPETS)) {
    assert.ok(snippet.trim(), "each gallery tab needs copyable code");
    assert.match(snippet, /<button\b[\s\S]*?type=\\?["']button\\?["']/);
    assert.match(snippet, /base\.svg/);
    assert.match(snippet, /clicked\.svg/);
    assert.match(snippet, /width:\s*176px/);
    assert.match(snippet, /height:\s*152px/);
    assert.match(snippet, /top:\s*30\.2969px[\s\S]*?width:\s*176px[\s\S]*?height:\s*122px/);
    assert.match(snippet, /left:\s*13\.6289px[\s\S]*?top:\s*0[\s\S]*?width:\s*152px[\s\S]*?height:\s*124px/);
    assert.match(snippet, /translateY\(6px\)/);
    assert.doesNotMatch(snippet, /inactive-button\.svg|pressed-button\.svg/);
    assert.match(snippet, /pointercancel|onPointerCancel/);
    assert.match(snippet, /(?:key === ["'] ["']|isMechanicalPressKey\(event\.key\)|event\.key === ["']Enter["'])/);
    assert.match(snippet, /prefers-reduced-motion/);
    assert.match(snippet, /click\.mp3/);
    assert.doesNotMatch(snippet, /AudioContext|webkitAudioContext/);
    assert.equal((snippet.match(/addEventListener\((?:\\["']click\\["']|["']click["'])/g) ?? []).length + (snippet.match(/onClick=/g) ?? []).length, 1);
    assert.doesNotMatch(snippet, /aria-pressed/);
    assert.doesNotMatch(snippet, /\.click\(/);
  }

  const slots = readFileSync(join(directory, "..", "slots.js"), "utf8");
  assert.match(slots, /import \{ MechanicalKeyboardPreview \} from "\.\/buttons\/MechanicalKeyboardButton\.jsx";/);
  assert.match(slots, /MECHANICAL_KEYBOARD_META,[\s\S]*?MECHANICAL_KEYBOARD_SNIPPETS/);
  assert.match(slots, /id:\s*"mechanical-keyboard"[\s\S]*?preview:\s*MechanicalKeyboardPreview/);
});

test("clears the copied React snippet's held state when disabled during a press", () => {
  const react = MECHANICAL_KEYBOARD_SNIPPETS.react;

  assert.match(react, /import \{ useEffect, useRef, useState \} from "react";/);
  assert.match(react, /useEffect\(\(\) => \{\s*if \(disabled\) endPress\(\);\s*\}, \[disabled\]\);/);
});
