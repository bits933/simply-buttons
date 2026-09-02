/* Writes the ThreeUI trio snippet files (HTML / React / Express stacks) for
   the generate, spinning-border, and plasma buttons. CSS (and the plasma
   WebGL engine) are read at GENERATOR time and embedded inline. Run:
   node plans/threeui-buttons-gen.js */
const { readFileSync, writeFileSync } = await import("node:fs");
const { join, dirname } = await import("node:path");
const { fileURLToPath } = await import("node:url");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src", "buttons");

const SPARKLE_PATH =
  "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z";

function pageHtml(title, extraHead, bodyStyles, body) {
  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    `<title>${title}</title>`,
    ...extraHead,
    "<style>",
    "html, body { margin: 0; height: 100%; }",
    bodyStyles,
    "</style>",
    "</head>",
    "<body>",
    body.trimEnd(),
    "</body>",
    "</html>",
  ].join("\n");
}

function expressStack(html, logName) {
  const node = [
    'const express = require("express");',
    "",
    "const HTML = " + JSON.stringify(html) + ";",
    "",
    "const app = express();",
    'app.get("/", (req, res) => res.type("html").send(HTML));',
    "",
    `app.listen(3000, () => console.log("${logName} on http://localhost:3000"));`,
  ].join("\n");
  return node;
}

function writeSnippets(file, exportName, metaName, { html, react, node }, metaLiteral, blurb) {
  const out = [
    `/* ${blurb} */`,
    "",
    `export const ${exportName} = {`,
    "  html: " + JSON.stringify(html) + ",",
    "  react: " + JSON.stringify(react) + ",",
    "  node: " + JSON.stringify(node) + ",",
    "};",
    "",
    `export const ${metaName} = ${metaLiteral};`,
    "",
  ].join("\n");
  writeFileSync(join(DIR, file), out);
  console.log(`wrote ${file}`);
}

/* ---------------- generate ---------------- */
{
  const css = readFileSync(join(DIR, "generate-button.css"), "utf8");
  const lettersHtml = (letters) =>
    letters.map((l) => `<span class="btn-letter">${l}</span>`).join("\n            ");

  const BODY = `  <div class="shader-frame generate-root" data-generate data-mode="dark">
    <div class="btn-wrapper">
      <button class="btn px-3 py-2 md:px-4 md:py-2 focus:outline-none" type="button" aria-label="Generate" title="Generate">
        <svg class="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="${SPARKLE_PATH}"></path>
        </svg>
        <div class="txt-wrapper">
          <div class="txt-1">
            ${lettersHtml(["G", "e", "n", "e", "r", "a", "t", "e"])}
          </div>
          <div class="txt-2">
            ${lettersHtml(["G", "e", "n", "e", "r", "a", "t", "i", "n", "g"])}
          </div>
        </div>
      </button>
    </div>
  </div>`;

  const html = pageHtml(
    "Generate Button",
    [],
    "body { min-height: 100vh; display: grid; place-items: center; background: #111318; }\n.generate-root { width: min(100vw, 640px); height: min(42vw, 180px); }",
    BODY,
  ).replace("<style>", `<style>\n${css}\n`);

  const react = [
    `const CSS = ${JSON.stringify(css)};`,
    "",
    `const LETTERS = ["G", "e", "n", "e", "r", "a", "t", "e"];
const LETTERS_ACTIVE = ["G", "e", "n", "e", "r", "a", "t", "i", "n", "g"];

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function SparkleIcon() {
  return (
    <svg className="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="${SPARKLE_PATH}" />
    </svg>
  );
}

export function RectangleButtons({
  variant = "generate-button",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
}) {
  if (variant !== "generate-button") return null;

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
      className="shader-frame generate-root"
      data-generate
      data-mode={safeMode}
      style={filter ? { filter } : undefined}
    >
      <style>{CSS}</style>
      <div className="btn-wrapper">
        <button
          type="button"
          className="btn px-3 py-2 md:px-4 md:py-2 focus:outline-none"
          aria-label="Generate"
          title="Generate"
        >
          <SparkleIcon />
          <div className="txt-wrapper">
            <div className="txt-1">
              {LETTERS.map((letter, index) => (
                <span className="btn-letter" key={index}>{letter}</span>
              ))}
            </div>
            <div className="txt-2">
              {LETTERS_ACTIVE.map((letter, index) => (
                <span className="btn-letter" key={index}>{letter}</span>
              ))}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default function Scene() {
  return (
    <div className="shader-frame">
      <RectangleButtons
        variant="generate-button"
        mode="dark"
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}`,
  ].join("\n");

  const metaLiteral = `{
  id: "generate-button",
  name: "Generate Button",
  blurb: "A glossy generate CTA with prismatic border glow, letter shimmer, and a focus swap to Generating.",
  states: ["idle", "hover", "focus", "active"],
  keywords: [
    "animated button",
    "interactive button",
    "generate button",
    "prismatic border",
    "letter shimmer",
    "sparkle icon",
    "generating text swap",
    "glossy button",
    "threeui",
    "rectangle buttons",
    "css button",
    "focus state",
    "active state",
    "cta",
    "dark mode button",
    "generate cta",
    "ai generate",
  ],
}`;

  writeSnippets(
    "generate-button.snippets.js",
    "GENERATE_BUTTON_SNIPPETS",
    "GENERATE_BUTTON_META",
    { html, react, node: expressStack(html, "generate button") },
    metaLiteral,
    "Generate button snippets. CSS and the three runnable stacks (HTML, React, Express) are embedded inline by plans/threeui-buttons-gen.js.",
  );
}

/* ---------------- spinning border ---------------- */
{
  const css = readFileSync(join(DIR, "spinning-border-button.css"), "utf8");

  const BODY = `  <div class="shader-frame spinning-border-root" data-spinning-border data-mode="dark">
    <button type="button" class="group spinning-btn" aria-label="Request Demo">
      <span class="spinning-beam" aria-hidden="true"></span>
      <span class="spinning-ring" aria-hidden="true"></span>
      <span class="spinning-surface">
        <span class="spinning-label">Request Demo</span>
        <svg class="spinning-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </span>
    </button>
  </div>`;

  const html = pageHtml(
    "Spinning Border Button",
    [],
    "body { min-height: 100vh; display: grid; place-items: center; background: #111318; }\n.spinning-border-root { width: min(100vw, 640px); height: min(42vw, 180px); }",
    BODY,
  ).replace("<style>", `<style>\n${css}\n`);

  const react = [
    `const CSS = ${JSON.stringify(css)};`,
    "",
    `function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function ArrowIcon() {
  return (
    <svg
      className="spinning-arrow"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function RectangleButtons({
  variant = "spinning-border-button",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
}) {
  if (variant !== "spinning-border-button") return null;

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
      className="shader-frame spinning-border-root"
      data-spinning-border
      data-mode={safeMode}
      style={filter ? { filter } : undefined}
    >
      <style>{CSS}</style>
      <button type="button" className="group spinning-btn" aria-label="Request Demo">
        <span className="spinning-beam" aria-hidden="true" />
        <span className="spinning-ring" aria-hidden="true" />
        <span className="spinning-surface">
          <span className="spinning-label">Request Demo</span>
          <ArrowIcon />
        </span>
      </button>
    </div>
  );
}

export default function Scene() {
  return (
    <div className="shader-frame">
      <RectangleButtons
        variant="spinning-border-button"
        mode="dark"
        hue={0}
        saturation={1.00}
        brightness={1.00}
      />
    </div>
  );
}`,
  ].join("\n");

  const metaLiteral = `{
  id: "spinning-border-button",
  name: "Spinning Border Button",
  blurb: "A compact graphite pill whose static zinc ring hands off to a rotating white conic border beam on hover.",
  states: ["idle", "hover", "active"],
  keywords: [
    "animated button",
    "interactive button",
    "spinning border button",
    "conic gradient border",
    "rotating beam",
    "border beam",
    "request demo",
    "graphite pill",
    "zinc gradient",
    "arrow nudge",
    "hover lift",
    "threeui",
    "rectangle buttons",
    "css button",
    "pill button",
    "dark mode button",
    "overflow clip ring",
  ],
}`;

  writeSnippets(
    "spinning-border-button.snippets.js",
    "SPINNING_BORDER_SNIPPETS",
    "SPINNING_BORDER_META",
    { html, react, node: expressStack(html, "spinning border button") },
    metaLiteral,
    "Spinning border button snippets. CSS and the three runnable stacks (HTML, React, Express) are embedded inline by plans/threeui-buttons-gen.js.",
  );
}

/* ---------------- plasma drive ---------------- */
{
  const css = readFileSync(join(DIR, "plasma-button.css"), "utf8");
  const engine = readFileSync(join(DIR, "aetheris-webgl.js"), "utf8")
    .replace(/^export function initAetherisDrive/m, "function initAetherisDrive")
    .trimEnd();

  const BOOT = `document.querySelectorAll(".aetheris-btn").forEach(function (btn) {
  initAetherisDrive(btn, {
    reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
});`;

  const BODY = `  <div class="aetheris-root" data-aetheris data-mode="dark">
    <canvas class="aetheris-bg" aria-hidden="true"></canvas>
    <button type="button" class="group aetheris-btn" aria-label="Aether Drive">
      <canvas class="aetheris-canvas" aria-hidden="true"></canvas>
      <div class="aetheris-nogl" aria-hidden="true"></div>
      <span class="aetheris-label">AETHER DRIVE</span>
    </button>
  </div>`;

  const html = [
    pageHtml(
      "Plasma Drive Button",
      ['<link rel="preconnect" href="https://fonts.googleapis.com" />'],
      "body { height: 100vh; display: grid; place-items: center; background: #020614; overflow: hidden; }\n.aetheris-root { position: absolute; inset: 0; }",
      BODY,
    ).replace("<style>", `<style>\n${css}\n`),
    "",
    "<script>",
    engine,
    BOOT,
    "</script>",
  ].join("\n");

  const react = [
    `const CSS = ${JSON.stringify(css)};`,
    "",
    engine,
    "",
    `export function ShaderButtons({
  variant = "plasma-button",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
}) {
  const btnRef = React.useRef(null);

  React.useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return undefined;
    const api = initAetherisDrive(btn, {
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    return () => {
      if (api) api.destroy();
    };
  }, []);

  if (variant !== "plasma-button") return null;

  const safeMode = mode === "light" ? "light" : "dark";
  const safeHue = Math.min(180, Math.max(-180, hue));
  const safeSaturation = Math.min(2, Math.max(0, saturation));
  const safeBrightness = Math.min(1.65, Math.max(0.35, brightness));
  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : \`hue-rotate(\${safeHue}deg) saturate(\${safeSaturation}) brightness(\${safeBrightness})\`;

  return (
    <div
      className="aetheris-root"
      data-aetheris
      data-mode={safeMode}
      style={filter ? { filter } : undefined}
    >
      <style>{CSS}</style>
      <canvas className="aetheris-bg" aria-hidden="true" />
      <button ref={btnRef} type="button" className="group aetheris-btn" aria-label="Aether Drive">
        <canvas className="aetheris-canvas" aria-hidden="true" />
        <div className="aetheris-nogl" aria-hidden="true" />
        <span className="aetheris-label">AETHER DRIVE</span>
      </button>
    </div>
  );
}

export default function Scene() {
  return (
    <ShaderButtons
      variant="plasma-button"
      mode="dark"
      hue={0}
      saturation={1.00}
      brightness={1.00}
    />
  );
}`,
  ].join("\n");

  const metaLiteral = `{
  id: "plasma-button",
  name: "Plasma Drive Button",
  blurb: "A raw-WebGL Aether Drive button over a cosmic-void field: fbm plasma that heats on hover and flashes on press.",
  states: ["idle", "hover", "focus", "active", "no webgl fallback"],
  keywords: [
    "animated button",
    "interactive button",
    "plasma button",
    "aether drive",
    "webgl button",
    "shader button",
    "fbm noise",
    "cosmic void",
    "heat glow",
    "hyper jump flash",
    "canvas button",
    "deep blue",
    "threeui",
    "shader buttons",
    "luminous",
    "dark mode button",
    "glow button",
  ],
}`;

  writeSnippets(
    "plasma-button.snippets.js",
    "PLASMA_BUTTON_SNIPPETS",
    "PLASMA_BUTTON_META",
    { html, react, node: expressStack(html, "plasma drive button") },
    metaLiteral,
    "Plasma drive button snippets. CSS, the WebGL engine, and the three runnable stacks (HTML, React, Express) are embedded inline by plans/threeui-buttons-gen.js.",
  );
}
