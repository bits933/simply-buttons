import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import {
  KRISS_CTA,
  getKrissBorderGeometry,
  getKrissBorderTargets,
  stepKrissBorderFrame,
} from "./kriss-cta.tokens.js";

test("Kriss CTA ships the observed border motion model", () => {
  assert.equal(KRISS_CTA.label, "Learn More");
  assert.deepEqual(KRISS_CTA.svg, { width: 142, height: 60, inset: 11 });
  assert.deepEqual(KRISS_CTA.rect, { x: 1.5, y: 1.5, width: 139, height: 57, rx: 8 });
  assert.equal(KRISS_CTA.fps, 70);
  assert.equal(KRISS_CTA.ease, 0.1);
  assert.equal(KRISS_CTA.paint.hover, "rgba(255,255,255,1)");

  const geometry = getKrissBorderGeometry();
  const { perimeter } = geometry;
  assert.deepEqual(geometry.dashes, {
    thickFirst: { dash: "32.56637061435917, 345.3750293856408", offset: 22.566370614359172 },
    thickSecond: { dash: "32.56637061435917, 345.3750293856408", offset: -166.40432938564084 },
    faintOne: { dash: "136.40432938564084, 241.53707061435915", offset: -20 },
    faintTwo: { dash: "136.40432938564078, 241.5370706143592", offset: 546.9121 },
  });
  const idle = getKrissBorderTargets(perimeter, false);
  const hover = getKrissBorderTargets(perimeter, true);
  assert.ok(Math.abs(idle.first - 22.5664) < 0.01);
  assert.ok(Math.abs(idle.second + 166.404) < 0.05);
  assert.equal(hover.first, -45.21681469282042);
  assert.equal(hover.second, -234.1875146928204);

  const frame = stepKrissBorderFrame(idle, hover);
  assert.ok(frame.first < idle.first && frame.first > hover.first);
  assert.ok(frame.second < idle.second && frame.second > hover.second);
  assert.equal(
    frame.thickDash,
    `${geometry.dashLength}, ${perimeter - geometry.dashLength}`,
  );
  assert.equal(frame.faintOneDash, "136.40432938564084, 241.53707061435915");
  assert.equal(frame.faintOneOffset, -26.77831853071796);
  assert.equal(frame.faintTwoDash, "136.40432938564078, 241.5370706143592");
  assert.equal(frame.faintTwoOffset, 540.133781469282);
});

test("Kriss CTA ships a native, motion-safe reference component", () => {
  const componentPath = new URL("./KrissCtaButton.jsx", import.meta.url);
  const cssPath = new URL("./kriss-cta.css", import.meta.url);
  const fontPath = new URL("./fonts/krissai-normal.woff2", import.meta.url);
  assert.ok(existsSync(componentPath));
  assert.ok(existsSync(cssPath));
  assert.ok(existsSync(fontPath));
  assert.ok(statSync(fontPath).size > 0);

  const component = readFileSync(componentPath, "utf8");
  const css = readFileSync(cssPath, "utf8");
  assert.match(component, /<button[\s\S]*type="button"/);
  assert.ok(component.indexOf("{...rest}") < component.indexOf('type="button"'));
  assert.equal((component.match(/<rect\b/g) ?? []).length, 4);
  assert.equal((component.match(/x="1\.5" y="1\.5" width="139" height="57" rx="8"/g) ?? []).length, 4);
  assert.match(component, /aria-hidden="true"/);
  assert.match(component, /focusable="false"/);
  assert.match(component, /1000\s*\/\s*KRISS_CTA\.fps/);
  assert.match(component, /requestAnimationFrame/);
  assert.match(component, /cancelAnimationFrame/);
  assert.match(component, /const frameRef = useRef\(null\)/);
  assert.match(component, /const hoverRef = useRef\(false\)/);
  assert.match(component, /const focusRef = useRef\(false\)/);
  assert.match(component, /const syncRef = useRef\(\(\) => \{\}\)/);
  assert.match(component, /if \(reducedMotion\) syncRef\.current\(\);/);
  assert.match(component, /\}, \[disabled, reducedMotion\]\);/);
  assert.match(component, /\}, \[reducedMotion\]\);/);
  assert.doesNotMatch(component, /\}, \[active, disabled, reducedMotion\]\);/);
  assert.match(component, /onMouseEnter|onMouseLeave/);
  assert.match(component, /onFocus|onBlur/);
  assert.match(component, /disabled/);
  assert.match(component, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(component, /clientX|clientY|pointerX|pointerY|onPointerMove/);

  assert.match(css, /@font-face[\s\S]*src:\s*url\("\.\/fonts\/krissai-normal\.woff2"\)/);
  assert.match(css, /font-family:\s*"Krissai"/);
  assert.match(css, /font-weight:\s*400/);
  assert.match(css, /width:\s*120px/);
  assert.match(css, /height:\s*38px/);
  assert.match(css, /padding:\s*10px 15px/);
  assert.match(css, /border-radius:\s*3px/);
  assert.match(css, /inset:\s*-11px/);
  assert.match(css, /width:\s*142px/);
  assert.match(css, /height:\s*60px/);
  assert.match(css, /rgba\(255,\s*255,\s*255,\s*\.2\)/);
  assert.match(css, /background-color:\s*rgba\(255,\s*255,\s*255,\s*1\)/);
  assert.doesNotMatch(css, /rgba\(255,\s*255,\s*255,\s*\.6\)/);
  assert.match(css, /background-color\s+300ms\s+ease/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /:disabled/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /stroke:\s*white/);
  assert.match(css, /stroke-width:\s*3/);
  assert.match(css, /stroke:\s*rgba\(255,\s*255,\s*255,\s*\.3\)/);
  assert.match(css, /stroke-width:\s*1/);
  assert.match(css, /stroke-linecap:\s*round/);
  const rulePreludes = [];
  let prelude = "";
  for (const character of css) {
    if (character === "{") {
      rulePreludes.push(prelude.trim());
      prelude = "";
    } else if (character === "}") {
      prelude = "";
    } else {
      prelude += character;
    }
  }
  const concreteSelectors = rulePreludes
    .filter((selector) => selector && !selector.startsWith("@font-face") && !selector.startsWith("@media"))
    .map((selector) => selector.replace(/\s+/g, " "));
  assert.deepEqual(concreteSelectors, [
    ".btn-kriss-root",
    ".btn-kriss-button",
    ".btn-kriss-button:hover:not(:disabled), .btn-kriss-button:focus-visible:not(:disabled)",
    ".btn-kriss-button:focus-visible",
    ".btn-kriss-button:disabled",
    ".btn-kriss-label",
    ".btn-kriss-border",
    ".btn-kriss-border-svg",
    ".btn-kriss-segment",
    ".btn-kriss-segment--thick",
    ".btn-kriss-segment--faint",
    ".btn-kriss-button",
  ]);
  assert.doesNotMatch(css, /[#\[\]*]|(?:^|[\s,>+~])(?:html|body|button|svg|rect|:root)\b/);

  const transitions = [...css.matchAll(/(?:^|[;{])\s*transition:\s*([^;}\n]+)/gm)].map((match) => match[1].trim());
  assert.deepEqual(transitions, ["background-color 300ms ease", "none"]);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*transition:\s*none/);
  assert.doesNotMatch(css, /transition-(?:property|duration|delay|timing-function)\s*:/);
  assert.doesNotMatch(css, /(?:^|[;{])\s*animation(?:-[\w-]+)?\s*:/m);
  assert.doesNotMatch(css, /@(?:-[\w]+-)?keyframes\b/);
  assert.doesNotMatch(css, /\b(?:linear-gradient|radial-gradient|conic-gradient|box-shadow|text-shadow|filter|backdrop-filter|transform|scale)\b|blur\s*\(/i);
});

test("Kriss CTA ships standalone snippets and follows floema in the gallery", async () => {
  const snippetsPath = new URL("./kriss-cta.snippets.js", import.meta.url);
  const slotsPath = new URL("../slots.js", import.meta.url);
  assert.ok(existsSync(snippetsPath));

  const { KRISS_CTA_META, KRISS_CTA_SNIPPETS } = await import("./kriss-cta.snippets.js");
  assert.equal(KRISS_CTA_META.id, "kriss-cta");
  assert.equal(KRISS_CTA_META.name, "Stoke Move");
  assert.equal(KRISS_CTA_META.blurb, "Glass CTA with source-faithful segmented border choreography.");
  assert.equal(KRISS_CTA_META.states, "idle, hover, focus, disabled, reduced motion");

  for (const snippet of Object.values(KRISS_CTA_SNIPPETS)) {
    assert.match(snippet, /Learn More/);
    assert.equal((snippet.match(/<button\b/g) ?? []).length, 1);
    assert.equal((snippet.match(/<rect\b/g) ?? []).length, 4);
    assert.equal((snippet.match(/width="142" height="60"/g) ?? []).length, 1);
    assert.equal((snippet.match(/x="1\.5" y="1\.5" width="139" height="57" rx="8"/g) ?? []).length, 4);
    assert.match(snippet, /stroke:\s*white[\s\S]*stroke-width:\s*3/);
    assert.match(snippet, /stroke:\s*rgba\(255,\s*255,\s*255,\s*\.3\)[\s\S]*stroke-width:\s*1/);
    assert.match(snippet, /rgba\(255,\s*255,\s*255,\s*\.2\)/);
    assert.match(snippet, /background-color:\s*rgba\(255,\s*255,\s*255,\s*1\)/);
    assert.doesNotMatch(snippet, /rgba\(255,\s*255,\s*255,\s*\.6\)/);
    assert.equal((snippet.match(/transition:\s*background-color 300ms ease/g) ?? []).length, 1);
    assert.match(snippet, /(?:fps|FPS)\s*=\s*70|1000\s*\/\s*70/);
    assert.match(snippet, /(?:ease|EASE)\s*=\s*0\.1|\*\s*0\.1/);
    assert.match(snippet, /:focus-visible/);
    assert.match(snippet, /disabled/);
    assert.match(snippet, /cancelAnimationFrame|cleanup|return\s*\(\)\s*=>/);
    assert.match(snippet, /prefers-reduced-motion/);
    assert.doesNotMatch(snippet, /https?:\/\/[^\s"')]+\.woff2/i);
  }
  assert.match(
    KRISS_CTA_SNIPPETS.react,
    /useState\(\(\)\s*=>\s*typeof window !== "undefined"\s*&&\s*window\.matchMedia\s*&&\s*window\.matchMedia\(/,
  );
  assert.match(KRISS_CTA_SNIPPETS.react, /const frameRef = useRef\(null\)/);
  assert.match(KRISS_CTA_SNIPPETS.react, /const hoverRef = useRef\(false\)/);
  assert.match(KRISS_CTA_SNIPPETS.react, /const focusRef = useRef\(false\)/);
  assert.match(KRISS_CTA_SNIPPETS.react, /const syncRef = useRef\(\(\) => \{\}\)/);
  assert.match(KRISS_CTA_SNIPPETS.react, /if \(reducedMotion\) syncRef\.current\(\);/);
  assert.match(KRISS_CTA_SNIPPETS.react, /\}, \[disabled, reducedMotion\]\);/);
  assert.match(KRISS_CTA_SNIPPETS.react, /\}, \[reducedMotion\]\);/);
  assert.doesNotMatch(KRISS_CTA_SNIPPETS.react, /\}, \[active, disabled, reducedMotion\]\);/);
  assert.match(KRISS_CTA_SNIPPETS.html, /let hovered = false;[\s\S]*let focused = false/);
  assert.match(KRISS_CTA_SNIPPETS.html, /targets\(\(hovered \|\| focused\) && !button\.disabled\)/);
  assert.match(KRISS_CTA_SNIPPETS.html, /if \(reducedMotion\.matches\) sync\(\);/);

  const slots = readFileSync(slotsPath, "utf8");
  assert.match(slots, /KrissCtaPreview/);
  assert.match(slots, /KRISS_CTA_META, KRISS_CTA_SNIPPETS/);
  const floema = slots.indexOf('id: "floema-cta"');
  const kriss = slots.indexOf('id: "kriss-cta"');
  assert.ok(floema >= 0 && kriss > floema);
  assert.equal((slots.slice(floema + 1, kriss).match(/id:\s*"/g) ?? []).length, 0);
});
