/* Writes src/buttons/dot-border-button.snippets.js (HTML / React / Express
   stacks). CSS is read at GENERATOR time and embedded inline. Run:
   node plans/dot-border-gen.js */
const { readFileSync, writeFileSync } = await import("node:fs");
const { join, dirname } = await import("node:path");
const { fileURLToPath } = await import("node:url");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src", "buttons");
const css = readFileSync(join(DIR, "dot-border-button.css"), "utf8");

const BODY = `  <div class="shader-frame dot-border-root" data-dot-border data-mode="dark">
    <a href="#" class="btn-wrapper" style="--dot-size: 8px; --line-weight: 1px; --line-distance: 0.8rem 1rem; --animation-speed: 0.35s; --dot-color: #fffa; --line-color: #fffa; --grid-color: #fff3; position: relative; display: inline-flex; justify-content: center; align-items: center; width: auto; height: auto; padding: var(--line-distance); background-color: rgba(0, 0, 0, 0); user-select: none">
      <div class="line horizontal top"></div>
      <div class="line vertical right"></div>
      <div class="line horizontal bottom"></div>
      <div class="line vertical left"></div>
      <div class="dot top left"></div>
      <div class="dot top right"></div>
      <div class="dot bottom right"></div>
      <div class="dot bottom left"></div>
      <button type="button" class="btn bg-[#ffffff]" aria-label="Start Creating">
        <span class="btn-text">Start Creating</span>
        <svg class="btn-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.6744 11.4075L15.7691 17.1233C15.7072 17.309 15.5586 17.4529 15.3709 17.5087L3.69348 20.9803C3.22819 21.1186 2.79978 20.676 2.95328 20.2155L6.74467 8.84131C6.79981 8.67588 6.92419 8.54263 7.08543 8.47624L12.472 6.25822C12.696 6.166 12.9535 6.21749 13.1248 6.38876L17.5294 10.7935C17.6901 10.9542 17.7463 11.1919 17.6744 11.4075Z"></path>
          <path d="M3.2959 20.6016L9.65986 14.2376"></path>
          <path d="M17.7917 11.0557L20.6202 8.22724C21.4012 7.44619 21.4012 6.17986 20.6202 5.39881L18.4989 3.27749C17.7178 2.49645 16.4515 2.49645 15.6704 3.27749L12.842 6.10592"></path>
          <path d="M11.7814 12.1163C11.1956 11.5305 10.2458 11.5305 9.66004 12.1163C9.07426 12.7021 9.07426 13.6519 9.66004 14.2376C10.2458 14.8234 11.1956 14.8234 11.7814 14.2376C12.3671 13.6519 12.3671 12.7021 11.7814 14.2376Z"></path>
        </svg>
      </button>
    </a>
  </div>`;

const BEHAVIOR = `document.querySelectorAll(".btn-wrapper[href='#']").forEach(function (link) {
  link.addEventListener("click", function (event) { event.preventDefault(); });
});`;

const html = [
  "<!doctype html>",
  '<html lang="en">',
  "<head>",
  '<meta charset="utf-8" />',
  '<meta name="viewport" content="width=device-width, initial-scale=1" />',
  "<title>Dot Border Button</title>",
  "<style>",
  "html, body { margin: 0; height: 100%; }",
  "body { min-height: 100vh; display: grid; place-items: center; background: #111318; }",
  ".dot-border-root { width: min(100vw, 640px); height: min(42vw, 180px); }",
  css,
  "</style>",
  "</head>",
  "<body>",
  BODY,
  "<script>",
  BEHAVIOR,
  "</script>",
  "</body>",
  "</html>",
].join("\n");

const REACT_TAIL = `const WRAPPER_STYLE = {
  "--dot-size": "8px",
  "--line-weight": "1px",
  "--line-distance": "0.8rem 1rem",
  "--animation-speed": "0.35s",
  "--dot-color": "#fffa",
  "--line-color": "#fffa",
  "--grid-color": "#fff3",
  position: "relative",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  width: "auto",
  height: "auto",
  padding: "var(--line-distance)",
  backgroundColor: "rgba(0, 0, 0, 0)",
  userSelect: "none",
};

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function PencilIcon() {
  return (
    <svg className="btn-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.6744 11.4075L15.7691 17.1233C15.7072 17.309 15.5586 17.4529 15.3709 17.5087L3.69348 20.9803C3.22819 21.1186 2.79978 20.676 2.95328 20.2155L6.74467 8.84131C6.79981 8.67588 6.92419 8.54263 7.08543 8.47624L12.472 6.25822C12.696 6.166 12.9535 6.21749 13.1248 6.38876L17.5294 10.7935C17.6901 10.9542 17.7463 11.1919 17.6744 11.4075Z" />
      <path d="M3.2959 20.6016L9.65986 14.2376" />
      <path d="M17.7917 11.0557L20.6202 8.22724C21.4012 7.44619 21.4012 6.17986 20.6202 5.39881L18.4989 3.27749C17.7178 2.49645 16.4515 2.49645 15.6704 3.27749L12.842 6.10592" />
      <path d="M11.7814 12.1163C11.1956 11.5305 10.2458 11.5305 9.66004 12.1163C9.07426 12.7021 9.07426 13.6519 9.66004 14.2376C10.2458 14.8234 11.1956 14.8234 11.7814 14.2376C12.3671 13.6519 12.3671 12.7021 11.7814 14.2376Z" />
    </svg>
  );
}

export function RectangleButtons({
  variant = "dot-border-button",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
}) {
  if (variant !== "dot-border-button") return null;

  const safeMode = mode === "light" ? "light" : "dark";
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);
  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : \`hue-rotate(\${safeHue}deg) saturate(\${safeSaturation}) brightness(\${safeBrightness})\`;

  return (
    <div
      className="shader-frame dot-border-root"
      data-dot-border
      data-mode={safeMode}
      style={filter ? { filter } : undefined}
    >
      <style>{CSS}</style>
      <a
        href="#"
        className="btn-wrapper"
        style={WRAPPER_STYLE}
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        <div className="line horizontal top" />
        <div className="line vertical right" />
        <div className="line horizontal bottom" />
        <div className="line vertical left" />
        <div className="dot top left" />
        <div className="dot top right" />
        <div className="dot bottom right" />
        <div className="dot bottom left" />
        <button type="button" className="btn bg-[#ffffff]" aria-label="Start Creating">
          <span className="btn-text">Start Creating</span>
          <PencilIcon />
        </button>
      </a>
    </div>
  );
}

export default function Scene() {
  return (
    <div className="shader-frame">
      <RectangleButtons
        variant="dot-border-button"
        mode="dark"
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}`;

const react = [
  "const CSS = " + JSON.stringify(css) + ";",
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
  'app.listen(3000, () => console.log("dot-border button on http://localhost:3000"));',
].join("\n");

const META_LITERAL = `{
  id: "dot-border",
  name: "Dot Border",
  blurb: "A bright creation CTA framed by four corner dots and sequentially drawn dashed border segments.",
  states: ["idle", "hover", "focus", "active"],
  keywords: [
    "animated button",
    "interactive button",
    "dot border button",
    "dashed border",
    "corner dots",
    "start creating",
    "threeui",
    "rectangle buttons",
    "hover draw",
    "creation cta",
    "pencil icon",
    "sequential border",
    "hatch overlay",
    "css button",
    "focus visible",
    "dark mode button",
    "indigo hover",
  ],
}`;

const out = [
  "/* Dot border button snippets. CSS and the three runnable stacks (HTML,",
  "   React, Express) are embedded inline by plans/dot-border-gen.js. */",
  "",
  "export const DOT_BORDER_SNIPPETS = {",
  "  html: " + JSON.stringify(html) + ",",
  "  react: " + JSON.stringify(react) + ",",
  "  node: " + JSON.stringify(node) + ",",
  "};",
  "",
  "export const DOT_BORDER_META = " + META_LITERAL + ";",
  "",
].join("\n");
writeFileSync(join(DIR, "dot-border-button.snippets.js"), out);
console.log("wrote dot-border-button.snippets.js");
