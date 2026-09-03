const CSS = `@font-face {
  font-family: "PP Neue Corp Tight Ultrabold";
  src: url("https://framerusercontent.com/assets/8wGC1mLwo6aPeovt0rsUbpRSk.woff2") format("woff2");
  font-display: swap;
  font-style: normal;
  font-weight: 700;
}

.gp-root {
  --gp-bg: #ebe9e4;
  --gp-btn-bg: #ebe9e4;
  --gp-btn-hover-bg: #111111;
  --gp-border: #111111;
  --gp-ink: #111111;
  --gp-ink-hover: #ebe9e4;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 140px;
  background-color: var(--gp-bg);
  border-radius: inherit;
  position: relative;
  overflow: hidden;
}

.gp-root *, .gp-root *::before, .gp-root *::after {
  box-sizing: border-box;
}

.gp-proj-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  min-width: 100px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  transition: transform 120ms ease;
}

.gp-layer-rest {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  border-radius: 4px;
  border: 1px solid var(--gp-border);
  background-color: var(--gp-btn-bg);
  color: var(--gp-ink);
  font-family: "PP Neue Corp Tight Ultrabold", "PP Neue Corp Tight", Impact, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1.1;
  transform: scale(1);
  opacity: 1;
  box-sizing: border-box;
  transition: transform 320ms cubic-bezier(0.25, 1, 0.5, 1),
              opacity 200ms ease;
}

.gp-layer-hover {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  border-radius: 4px;
  border: 1px solid var(--gp-btn-hover-bg);
  background-color: var(--gp-btn-hover-bg);
  color: var(--gp-ink-hover);
  font-family: "PP Neue Corp Tight Ultrabold", "PP Neue Corp Tight", Impact, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1.1;
  transform: scale(0.5);
  opacity: 0;
  pointer-events: none;
  box-sizing: border-box;
  transition: transform 360ms cubic-bezier(0.2, 1.25, 0.4, 1),
              opacity 200ms ease;
}

.gp-proj-btn:hover .gp-layer-rest {
  transform: scale(0.5);
  opacity: 0;
}

.gp-proj-btn:hover .gp-layer-hover {
  transform: scale(1);
  opacity: 1;
}

.gp-proj-btn:active {
  transform: scale(0.96);
  transition: transform 60ms ease;
}

.gp-proj-btn:focus-visible .gp-layer-rest,
.gp-proj-btn:focus-visible .gp-layer-hover {
  outline: 2px solid var(--gp-border);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .gp-layer-rest, .gp-layer-hover, .gp-proj-btn {
    transition: none;
  }
}`;

const htmlSnippet = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Grigoletti Projects Button</title>
<style>
body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #ebe9e4; }
${CSS}
</style>
</head>
<body>
  <div class="gp-root" data-grigoletti-projects>
    <button type="button" class="gp-proj-btn" aria-label="PROJECTS">
      <span class="gp-layer-rest">PROJECTS</span>
      <span class="gp-layer-hover" aria-hidden="true">PROJECTS</span>
    </button>
  </div>
</body>
</html>`;

const reactSnippet = `import React from "react";

const CSS = \`${CSS}\`;

export function GrigolettiProjectsButton({ label = "PROJECTS", onClick }) {
  return (
    <button
      type="button"
      className="gp-proj-btn"
      aria-label={label}
      onClick={onClick}
    >
      <span className="gp-layer-rest">{label}</span>
      <span className="gp-layer-hover" aria-hidden="true">{label}</span>
    </button>
  );
}

export default function Demo() {
  return (
    <div className="gp-root" data-grigoletti-projects>
      <style>{CSS}</style>
      <GrigolettiProjectsButton />
    </div>
  );
}
`;

const nodeSnippet = `const express = require("express");

const HTML = ${JSON.stringify(htmlSnippet)};

const app = express();
app.get("/", (req, res) => res.type("html").send(HTML));

app.listen(3000, () => console.log("Grigoletti Projects on http://localhost:3000"));
`;

export const GRIGOLETTI_PROJECTS_SNIPPETS = {
  html: htmlSnippet,
  react: reactSnippet,
  node: nodeSnippet,
};

export const GRIGOLETTI_PROJECTS_META = {
  id: "grigoletti-projects",
  name: "Grigoletti projects",
  blurb: "Dario Grigoletti signature projects button from grigoletti.ch with dual-layer Framer spring scale transition, authentic PP Neue Corp Tight Ultrabold typography, and tactile press.",
  states: [
    "idle (outline cream)",
    "hover (spring scale pop to solid dark)",
    "active (press 0.96)",
    "focus-visible",
    "reduced-motion",
  ],
  keywords: [
    "animated button",
    "interactive button",
    "grigoletti",
    "pp neue corp",
    "swiss typography",
    "dual layer",
    "spring scale",
    "pop transition",
    "framer button",
    "projects button",
    "monochrome",
    "outline to solid",
    "architectural",
    "minimalist cta",
    "tactile press",
    "condensed typography",
    "clean modern",
  ],
};
