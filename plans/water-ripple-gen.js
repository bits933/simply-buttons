/* Writes src/buttons/water-ripple-button.snippets.js (HTML / React / Express
   stacks). The WebGL module and CSS are read at GENERATOR time and embedded
   inline (the shipped snippets module must not import node:fs — the gallery
   browser can't). Run: node plans/water-ripple-gen.js */
const { readFileSync, writeFileSync } = await import("node:fs");
const { join, dirname } = await import("node:path");
const { fileURLToPath } = await import("node:url");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src", "buttons");
const css = readFileSync(join(DIR, "water-ripple-button.css"), "utf8");
const webgl = readFileSync(join(DIR, "water-ripple-webgl.js"), "utf8").replace(/^export /gm, "");

const BEHAVIOR = `var btn = document.querySelector(".btn-water-ripple");
var url = makeWaterTexture();
btn.style.backgroundImage = "url(" + url + ")";
var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var api = initWaterRipple(btn, {
  imageUrl: url,
  resolution: 160,
  dropRadius: 25,
  perturbance: 0.08,
  interactive: !reduced,
  start: !reduced
});`;

const BODY = `  <div class="water-ripple-root" data-water-ripple>
    <button type="button" class="btn-water-ripple" aria-label="Click Me — water ripple button">
      <span class="wr-label">Click Me</span>
    </button>
  </div>`;

const html = [
  "<!doctype html>",
  '<html lang="en">',
  "<head>",
  '<meta charset="utf-8" />',
  '<meta name="viewport" content="width=device-width, initial-scale=1" />',
  "<title>Water Ripple Button</title>",
  "<style>",
  "body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #1a1a1a; }",
  css,
  "</style>",
  "</head>",
  "<body>",
  BODY,
  "<script>",
  webgl,
  BEHAVIOR,
  "</script>",
  "</body>",
  "</html>",
].join("\n");

const REACT_TAIL = `function WaterRippleButton() {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return undefined;

    const url = makeWaterTexture();
    btn.style.backgroundImage = \`url(\${url})\`;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const api = initWaterRipple(btn, {
      imageUrl: url,
      resolution: 160,
      dropRadius: 25,
      perturbance: 0.08,
      interactive: !reduced,
      start: !reduced,
    });

    return () => {
      if (api) api.destroy();
      btn.style.backgroundImage = "";
    };
  }, []);

  return (
    <div className="water-ripple-root" data-water-ripple>
      <style>{CSS}</style>
      <button type="button" className="btn-water-ripple" ref={btnRef} aria-label="Click Me — water ripple button">
        <span className="wr-label">Click Me</span>
      </button>
    </div>
  );
}

export default WaterRippleButton;`;

const react = [
  'import { useEffect, useRef } from "react";',
  "",
  "const CSS = " + JSON.stringify(css) + ";",
  "",
  webgl,
  "",
  REACT_TAIL,
].join("\n");

const node = [
  'const express = require("express");',
  "",
  "const HTML = " + JSON.stringify(html) + ";",
  "",
  "const app = express();",
  'app.get("/", (req, res) => res.type("html").send(HTML));',
  "",
  'app.listen(3000, () => console.log("water-ripple button on http://localhost:3000"));',
].join("\n");

const META_LITERAL = `{
  id: "water-ripple",
  name: "Water Ripple",
  blurb: "A teal water pill: a generated wave texture refracted by a jquery.ripples-style WebGL heightfield. Pointer trails ripples; a click drops a stronger splash.",
  states: ["idle", "hover", "active", "ripple", "calm"],
  keywords: [
    "animated button",
    "interactive button",
    "webgl button",
    "water ripple",
    "ripple effect",
    "jquery ripples",
    "water simulation",
    "wave simulation",
    "heightfield",
    "refraction",
    "water texture",
    "teal button",
    "pill button",
    "click ripple",
    "liquid button",
    "pond surface",
    "canvas button",
    "pointer ripple",
  ],
}`;

const out = [
  "/* Water ripple button snippets. The WebGL module, CSS, and the three",
  "   runnable stacks (HTML, React, Express) are embedded inline by",
  "   plans/water-ripple-gen.js so each tab ships a complete,",
  "   copy-paste-runnable specimen of Qwen_html_20260902_buz9mzywq.html. */",
  "",
  "export const WATER_RIPPLE_SNIPPETS = {",
  "  html: " + JSON.stringify(html) + ",",
  "  react: " + JSON.stringify(react) + ",",
  "  node: " + JSON.stringify(node) + ",",
  "};",
  "",
  "export const WATER_RIPPLE_META = " + META_LITERAL + ";",
  "",
].join("\n");
writeFileSync(join(DIR, "water-ripple-button.snippets.js"), out);
console.log("wrote water-ripple-button.snippets.js");
