import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { ASCII_SCRAMBLE_MS, buildAsciiScrambleFrame } from "./ascii-scramble.js";

const directory = dirname(fileURLToPath(import.meta.url));

function assertThemeInversion(source) {
  assert.match(source, /--ascii-surface:\s*#ffffff/);
  assert.match(source, /--ascii-ink:\s*#111111/);
  assert.match(source, /--ascii-active-surface:\s*#000000/);
  assert.match(source, /--ascii-active-ink:\s*#ffffff/);
  assert.match(source, /\[data-theme="dark"\][\s\S]*?--ascii-surface:\s*#000000[\s\S]*?--ascii-ink:\s*#ffffff[\s\S]*?--ascii-active-surface:\s*#ffffff[\s\S]*?--ascii-active-ink:\s*#111111/);
}

test("builds deterministic frames while restoring the label from left to right", () => {
  assert.equal(ASCII_SCRAMBLE_MS, 720);
  assert.equal(buildAsciiScrambleFrame("WORK", 1, 9), "WORK");
  assert.equal(buildAsciiScrambleFrame("WO RK", 0, 0)[2], " ");
  assert.equal(buildAsciiScrambleFrame("WORK", 0.5, 0).slice(0, 2), "WO");
  assert.equal(buildAsciiScrambleFrame("WORK", 0, 2), buildAsciiScrambleFrame("WORK", 0, 2));
});

test("ships the accessible themed scramble button contract", () => {
  const componentPath = join(directory, "AsciiScrambleButton.jsx");
  const cssPath = join(directory, "ascii-scramble.css");

  assert.ok(existsSync(componentPath), "missing live ASCII scramble component");
  assert.ok(existsSync(cssPath), "missing ASCII scramble stylesheet");

  const component = readFileSync(componentPath, "utf8");
  const css = readFileSync(cssPath, "utf8");

  assert.match(component, /import \{ ASCII_SCRAMBLE_MS, buildAsciiScrambleFrame \} from "\.\/ascii-scramble\.js";/);
  assert.equal((component.match(/<button\b/g) ?? []).length, 1);
  assert.match(component, /<button\b[\s\S]*?type="button"/);
  assert.match(component, /aria-label=\{label\}/);
  assert.match(component, /aria-hidden="true"/);
  assert.match(component, /btn-ascii-scramble-label">\s*\{\[\.\.\.displayedLabel\]\.map\(\(character, index\) => \(/);
  assert.match(component, /key=\{index\}\s+className="btn-ascii-scramble-cell"/);
  assert.match(component, /btn-ascii-scramble-symbol[\s\S]*?\( \+ \)/);
  assert.match(component, /onPointerEnter=\{handlePointerEnter\}/);
  assert.match(component, /onPointerLeave=\{handlePointerLeave\}/);
  assert.match(component, /pointerType === "touch"/);
  assert.match(component, /onFocus=\{handleFocus\}/);
  assert.match(component, /matches\("\:focus-visible"\)/);
  assert.match(component, /onBlur=\{handleBlur\}/);
  assert.match(component, /requestAnimationFrame/);
  assert.match(component, /cancelAnimationFrame/);
  assert.match(component, /return \(\) => cancelAnimation\(\)/);
  assert.match(component, /if \(disabled\)[\s\S]*?setDisplayedLabel\(label\)/);
  assert.match(component, /if \(window\.matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches\) \{\s*setDisplayedLabel\(labelRef\.current\);\s*return;/);
  assert.match(component, /const frameInterval = 1000 \/ 30;/);
  assert.match(component, /now - lastTextUpdate >= frameInterval \|\| progress === 1/);

  assert.match(css, /\.btn-ascii-scramble-button\s*\{[\s\S]*?width:\s*172px[\s\S]*?height:\s*90px/);
  assertThemeInversion(css);
  assert.match(css, /420ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
  assert.doesNotMatch(css, /radial-gradient|background-size:\s*6px 6px|::after|ascii-scramble-dither/);
  assert.doesNotMatch(component, /useState\("idle"\)|setPhase|is-\$\{phase\}/);
  assert.match(css, /\.btn-ascii-scramble-button:focus-visible/);
  assert.match(css, /\.btn-ascii-scramble-button:disabled/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /transition:\s*none/);
  assert.match(css, /\.btn-ascii-scramble-label\s*\{[\s\S]*?display:\s*flex[\s\S]*?width:\s*4ch[\s\S]*?min-height:\s*1em[\s\S]*?white-space:\s*nowrap[\s\S]*?font-variant-ligatures:\s*none/);
  assert.match(css, /\.btn-ascii-scramble-cell\s*\{[\s\S]*?width:\s*1ch[\s\S]*?height:\s*1em[\s\S]*?line-height:\s*1[\s\S]*?text-align:\s*center/);
  assert.doesNotMatch(css, /\.btn-ascii-scramble-cell\s*\{[\s\S]*?(?:transform|animation)/);
});

test("ships matching accessible snippets and registers States slot 33", async () => {
  const { ASCII_SCRAMBLE_META, ASCII_SCRAMBLE_SNIPPETS } = await import("./ascii-scramble.snippets.js");
  assertThemeInversion(Object.values(ASCII_SCRAMBLE_SNIPPETS).join("\n"));

  assert.equal(ASCII_SCRAMBLE_META.id, "ascii-scramble");
  assert.equal(ASCII_SCRAMBLE_META.name, "ASCII scramble");
  assert.equal(ASCII_SCRAMBLE_META.blurb, "Theme-aware monochrome inversion with a smooth deterministic text scramble.");
  assert.equal(ASCII_SCRAMBLE_META.states, "idle, hover, focus, disabled, reduced motion");

  for (const snippet of Object.values(ASCII_SCRAMBLE_SNIPPETS)) {
    assert.ok(snippet.trim(), "each gallery tab needs copyable code");
    assert.match(snippet, /<button\b[\s\S]*?type=\\?["']button\\?["']/);
    assert.match(snippet, /WORK/);
    assert.match(snippet, /\( \+ \)/);
    assert.match(snippet, /#\*\?>%0/);
    assert.match(snippet, /duration = 720|duration = 720;|const duration = 720/);
    assert.match(snippet, /1000 \/ 30/);
    assert.match(snippet, /background-color 420ms cubic-bezier\(0\.22, 1, 0\.36, 1\), color 420ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/);
    assert.match(snippet, /#000000[\s\S]*?#ffffff/);
    assert.match(snippet, /#ffffff[\s\S]*?#111111/);
    assert.match(snippet, /cancelAnimationFrame|cancelAnimation\(/);
    assert.match(snippet, /setDisplayedLabel|function restore\(\)/);
    assert.match(snippet, /focus-visible/);
    assert.match(snippet, /prefers-reduced-motion/);
    assert.match(snippet, /btn-ascii-scramble-cell/);
    assert.match(snippet, /btn-ascii-scramble-label\s*\{[\s\S]*?display:\s*flex[\s\S]*?flex:\s*0 0 4ch[\s\S]*?width:\s*4ch[\s\S]*?min-height:\s*1em[\s\S]*?white-space:\s*nowrap[\s\S]*?font-variant-ligatures:\s*none/);
    assert.match(snippet, /btn-ascii-scramble-cell\s*\{[\s\S]*?display:\s*block[\s\S]*?flex:\s*0 0 1ch[\s\S]*?width:\s*1ch[\s\S]*?height:\s*1em[\s\S]*?line-height:\s*1[\s\S]*?text-align:\s*center/);
    assert.doesNotMatch(snippet, /radial-gradient|background-size:\s*6px 6px|::after|ascii-scramble-dither|is-enter|is-exit|@keyframes|setTimeout/);
  }

  assert.match(ASCII_SCRAMBLE_SNIPPETS.html, /querySelectorAll\("\.btn-ascii-scramble-cell"\)[\s\S]*?cell\.textContent/);
  assert.match(ASCII_SCRAMBLE_SNIPPETS.node.replaceAll('\\"', '"'), /querySelectorAll\("\.btn-ascii-scramble-cell"\)[\s\S]*?cell\.textContent/);
  assert.match(ASCII_SCRAMBLE_SNIPPETS.react, /\[\.\.\.displayedLabel\]\.map\(\(character, index\) => <span key=\{index\} className="btn-ascii-scramble-cell">\{character\}<\/span>\)/);

  const slots = readFileSync(join(directory, "..", "slots.js"), "utf8");
  assert.match(slots, /import \{ AsciiScramblePreview \} from "\.\/buttons\/AsciiScrambleButton\.jsx";/);
  assert.match(slots, /ASCII_SCRAMBLE_META,[\s\S]*?ASCII_SCRAMBLE_SNIPPETS/);
  assert.match(slots, /id:\s*"ascii-scramble"[\s\S]*?preview:\s*AsciiScramblePreview/);
});
