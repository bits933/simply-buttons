/* Writes src/buttons/jelly-switch-button.snippets.js (HTML / React / Express
   stacks). The WebGL module and CSS are read at GENERATOR time and embedded
   inline (the shipped snippets module must not import node:fs — the gallery
   browser can't). Run: node plans/jelly-switch-gen.js */
const { readFileSync, writeFileSync } = await import("node:fs");
const { join, dirname } = await import("node:path");
const { fileURLToPath } = await import("node:url");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src", "buttons");
const css = readFileSync(join(DIR, "jelly-switch-button.css"), "utf8");
const webgl = readFileSync(join(DIR, "jelly-switch-webgl.js"), "utf8").replace(
  /^export function /m,
  "function ",
);

const BEHAVIOR = `var WELL_RGB = [0x12 / 255, 0x13 / 255, 0x15 / 255];
var btn = document.querySelector(".btn-jelly-switch");
var canvas = document.querySelector(".jelly-canvas");
var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var api = initJellySwitch(canvas, { start: !reduced, dark: true, ground: WELL_RGB });
if (!api) {
  btn.dataset.gl = "off";
  btn.addEventListener("click", function () {
    var on = btn.dataset.jellyOn === "true";
    btn.dataset.jellyOn = on ? "false" : "true";
    btn.setAttribute("aria-pressed", on ? "false" : "true");
    btn.dataset.jiggle = "1";
    window.setTimeout(function () { btn.dataset.jiggle = "0"; }, 420);
  });
} else {
  btn.dataset.gl = "on";
  api.setDark(true, WELL_RGB);
  function onDown(event) {
    event.preventDefault();
    api.press();
  }
  function onUp() {
    if (!api.releaseAndToggle()) return;
    var toggled = api.getState().toggled;
    btn.dataset.jellyOn = toggled ? "true" : "false";
    btn.setAttribute("aria-pressed", toggled ? "true" : "false");
  }
  btn.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
}`;

const BODY = `  <div class="jelly-switch-root" data-jelly-switch>
    <button type="button" class="btn-jelly-switch" aria-pressed="false" aria-label="Jelly switch" data-jelly-on="false">
      <canvas class="jelly-canvas" aria-hidden="true"></canvas>
      <span class="jelly-fallback" aria-hidden="true"></span>
    </button>
  </div>`;

const html = [
  "<!doctype html>",
  '<html lang="en">',
  "<head>",
  '<meta charset="utf-8" />',
  '<meta name="viewport" content="width=device-width, initial-scale=1" />',
  "<title>Jelly Switch Button</title>",
  "<style>",
  "html, body { margin: 0; height: 100%; }",
  "body { min-height: 100vh; display: grid; place-items: center; background: #121315; }",
  ".jelly-switch-root { width: min(100vw, 640px); height: min(42vw, 180px); }",
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

const REACT_TAIL = `const WELL_RGB = [0x12 / 255, 0x13 / 255, 0x15 / 255]; /* #121315 */

function JellySwitchButton() {
  const btnRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    const canvas = canvasRef.current;
    if (!btn || !canvas) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const api = initJellySwitch(canvas, { start: !reduced, dark: true, ground: WELL_RGB });
    if (!api) {
      btn.dataset.gl = "off";
      const onClick = () => {
        const on = btn.dataset.jellyOn === "true";
        btn.dataset.jellyOn = on ? "false" : "true";
        btn.setAttribute("aria-pressed", on ? "false" : "true");
        btn.dataset.jiggle = "1";
        window.setTimeout(() => {
          btn.dataset.jiggle = "0";
        }, 420);
      };
      btn.addEventListener("click", onClick);
      return () => btn.removeEventListener("click", onClick);
    }

    btn.dataset.gl = "on";
    api.setDark(true, WELL_RGB);

    const onDown = (event) => {
      event.preventDefault();
      api.press();
    };
    const onUp = () => {
      if (!api.releaseAndToggle()) return;
      const { toggled } = api.getState();
      btn.dataset.jellyOn = toggled ? "true" : "false";
      btn.setAttribute("aria-pressed", toggled ? "true" : "false");
    };

    btn.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      btn.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      api.destroy();
    };
  }, []);

  return (
    <div className="jelly-switch-root" data-jelly-switch>
      <style>{CSS}</style>
      <button
        type="button"
        className="btn-jelly-switch"
        ref={btnRef}
        aria-pressed="false"
        aria-label="Jelly switch"
        data-jelly-on="false"
      >
        <canvas className="jelly-canvas" ref={canvasRef} aria-hidden="true" />
        <span className="jelly-fallback" aria-hidden="true" />
      </button>
    </div>
  );
}

export default JellySwitchButton;`;

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
  'app.listen(3000, () => console.log("jelly-switch button on http://localhost:3000"));',
].join("\n");

const META_LITERAL = `{
  id: "jelly-switch",
  name: "Jelly Switch",
  blurb: "A WebGL gel button from TypeGPU's jelly switch: click squashes and wiggles the blob, then it settles from a clear inactive gel into a lit blue active gel — same springs, no slider rail.",
  states: ["idle", "pressed", "jiggle", "inactive", "active"],
  keywords: [
    "animated button",
    "interactive button",
    "jelly switch",
    "jelly button",
    "webgl button",
    "sdf raymarch",
    "signed distance field",
    "toggle button",
    "squash and stretch",
    "spring physics",
    "fresnel refraction",
    "beer-lambert",
    "typegpu",
    "gel button",
    "jiggle click",
    "inactive active",
    "canvas button",
    "3d button",
  ],
}`;

const out = [
  "/* Jelly switch button snippets. The WebGL module, CSS, and the three",
  "   runnable stacks (HTML, React, Express) are embedded inline by",
  "   plans/jelly-switch-gen.js so each tab ships a complete,",
  "   copy-paste-runnable specimen. */",
  "",
  "export const JELLY_SWITCH_SNIPPETS = {",
  "  html: " + JSON.stringify(html) + ",",
  "  react: " + JSON.stringify(react) + ",",
  "  node: " + JSON.stringify(node) + ",",
  "};",
  "",
  "export const JELLY_SWITCH_META = " + META_LITERAL + ";",
  "",
].join("\n");
writeFileSync(join(DIR, "jelly-switch-button.snippets.js"), out);
console.log("wrote jelly-switch-button.snippets.js");
