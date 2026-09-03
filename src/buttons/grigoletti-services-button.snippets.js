const CSS = `@font-face {
  font-family: "PP Neue Corp Tight Ultrabold";
  src: url("https://framerusercontent.com/assets/8wGC1mLwo6aPeovt0rsUbpRSk.woff2") format("woff2");
  font-display: swap;
  font-style: normal;
  font-weight: 700;
}

.gs-root {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 140px;
  background-color: transparent;
  border-radius: inherit;
  position: relative;
  overflow: visible;
  --gs-btn-bg: transparent;
  --gs-border: #ffffff;
  --gs-ink: #ffffff;
  --gs-btn-hover-bg: #ffffff;
  --gs-ink-hover: #111111;
  --gs-menu-bg: #1c1e21;
  --gs-menu-border: rgba(255, 255, 255, 0.16);
  --gs-menu-ink: #eceef1;
  --gs-menu-hover-bg: rgba(255, 255, 255, 0.08);
}

[data-theme="light"] .gs-root,
.gs-root[data-mode="light"] {
  background-color: transparent;
  --gs-btn-bg: transparent;
  --gs-border: #111111;
  --gs-ink: #111111;
  --gs-btn-hover-bg: #111111;
  --gs-ink-hover: #ffffff;
  --gs-menu-bg: #ffffff;
  --gs-menu-border: rgba(0, 0, 0, 0.12);
  --gs-menu-ink: #111111;
  --gs-menu-hover-bg: rgba(0, 0, 0, 0.05);
}

[data-theme="dark"] .gs-root,
.gs-root[data-mode="dark"] {
  background-color: transparent;
  --gs-btn-bg: transparent;
  --gs-border: #ffffff;
  --gs-ink: #ffffff;
  --gs-btn-hover-bg: #ffffff;
  --gs-ink-hover: #111111;
  --gs-menu-bg: #1c1e21;
  --gs-menu-border: rgba(255, 255, 255, 0.16);
  --gs-menu-ink: #eceef1;
  --gs-menu-hover-bg: rgba(255, 255, 255, 0.08);
}

.gs-root *, .gs-root *::before, .gs-root *::after {
  box-sizing: border-box;
}

.gs-container {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.gs-group {
  display: inline-flex;
  align-items: center;
  height: 44px;
  transform: translateZ(0);
  transition: transform 440ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gs-container:hover .gs-group {
  transform: translateZ(0) scale(1.04);
}

.gs-serv-btn,
.gs-toggle-btn {
  position: relative;
  height: 44px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  backface-visibility: hidden;
  transition: transform 120ms ease;
}

.gs-serv-btn {
  min-width: 90px;
}

.gs-toggle-btn {
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gs-serv-btn .gs-layer-rest {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  border-radius: 4px 0 0 4px;
  border: 1px solid var(--gs-border);
  background-color: var(--gs-btn-bg);
  color: var(--gs-ink);
  font-family: "PP Neue Corp Tight Ultrabold", "PP Neue Corp Tight", Impact, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1.1;
  transform: translateZ(0) scale(1);
  opacity: 1;
  will-change: transform, opacity;
  backface-visibility: hidden;
  box-sizing: border-box;
  transition: transform 440ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 320ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gs-serv-btn .gs-layer-hover {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 16px;
  border-radius: 4px 0 0 4px;
  border: 1px solid var(--gs-btn-hover-bg);
  background-color: var(--gs-btn-hover-bg);
  color: var(--gs-ink-hover);
  font-family: "PP Neue Corp Tight Ultrabold", "PP Neue Corp Tight", Impact, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  line-height: 1.1;
  transform: translateZ(0) scale(0.6);
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
  backface-visibility: hidden;
  box-sizing: border-box;
  transition: transform 460ms cubic-bezier(0.19, 1.08, 0.22, 1),
              opacity 340ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gs-toggle-btn .gs-layer-rest {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 0 4px 4px 0;
  border: 1px solid var(--gs-border);
  border-left: none;
  background-color: var(--gs-btn-bg);
  color: var(--gs-ink);
  transform: translateZ(0) scale(1);
  opacity: 1;
  will-change: transform, opacity;
  backface-visibility: hidden;
  box-sizing: border-box;
  transition: transform 440ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 320ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gs-toggle-btn .gs-layer-hover {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 0 4px 4px 0;
  border: 1px solid var(--gs-btn-hover-bg);
  border-left: none;
  background-color: var(--gs-btn-hover-bg);
  color: var(--gs-ink-hover);
  transform: translateZ(0) scale(0.6);
  opacity: 0;
  pointer-events: none;
  will-change: transform, opacity;
  backface-visibility: hidden;
  box-sizing: border-box;
  transition: transform 460ms cubic-bezier(0.19, 1.08, 0.22, 1),
              opacity 340ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gs-toggle-btn .gs-layer-rest,
.gs-toggle-btn .gs-layer-hover {
  padding: 0;
}

.gs-chevron {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
}

.gs-serv-btn:hover .gs-layer-rest,
.gs-toggle-btn:hover .gs-layer-rest {
  transform: translateZ(0) scale(0.6);
  opacity: 0;
}

.gs-serv-btn:hover .gs-layer-hover,
.gs-toggle-btn:hover .gs-layer-hover {
  transform: translateZ(0) scale(1);
  opacity: 1;
}

.gs-serv-btn:active,
.gs-toggle-btn:active {
  transform: translateZ(0) scale(0.96);
  transition: transform 80ms ease;
}

.gs-container[data-open="true"] .gs-chevron {
  transform: rotate(180deg);
}

.gs-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 180px;
  background-color: #111111;
  border-radius: 4px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  padding: 8px 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  animation: gs-menu-enter 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.gs-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  color: #ebe9e4;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 600;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
}

.gs-menu-idx {
  font-family: ui-monospace, "IBM Plex Mono", monospace;
  font-size: 10px;
  color: #888888;
}

.gs-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

@keyframes gs-menu-enter {
  from { opacity: 0; transform: translateY(-4px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .gs-layer-rest, .gs-layer-hover, .gs-chevron, .gs-dropdown {
    transition: none;
    animation: none;
  }
}`;

const htmlSnippet = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Grigoletti Services Button</title>
<style>
body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #ebe9e4; }
${CSS}
</style>
</head>
<body>
  <div class="gs-root" data-grigoletti-services>
    <div class="gs-container" data-open="false">
      <div class="gs-group">
        <button type="button" class="gs-serv-btn" aria-label="SERVICES">
          <span class="gs-layer-rest">SERVICES</span>
          <span class="gs-layer-hover" aria-hidden="true">SERVICES</span>
        </button>
        <button type="button" class="gs-toggle-btn" aria-label="Toggle services menu">
          <span class="gs-layer-rest">
            <svg class="gs-chevron" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
          <span class="gs-layer-hover" aria-hidden="true">
            <svg class="gs-chevron" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</body>
</html>`;

const reactSnippet = `import React, { useState } from "react";

const CSS = \`${CSS}\`;

export function GrigolettiServicesButton({ label = "SERVICES", onClick }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="gs-container" data-open={open ? "true" : "false"}>
      <div className="gs-group">
        <button
          type="button"
          className="gs-serv-btn"
          aria-label={label}
          onClick={(e) => {
            setOpen((prev) => !prev);
            if (onClick) onClick(e);
          }}
        >
          <span className="gs-layer-rest">{label}</span>
          <span className="gs-layer-hover" aria-hidden="true">{label}</span>
        </button>
        <button
          type="button"
          className="gs-toggle-btn"
          aria-label="Toggle services menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="gs-layer-rest">
            <svg className="gs-chevron" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
          <span className="gs-layer-hover" aria-hidden="true">
            <svg className="gs-chevron" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Demo() {
  return (
    <div className="gs-root" data-grigoletti-services>
      <style>{CSS}</style>
      <GrigolettiServicesButton />
    </div>
  );
}
`;

const nodeSnippet = `const express = require("express");

const HTML = ${JSON.stringify(htmlSnippet)};

const app = express();
app.get("/", (req, res) => res.type("html").send(HTML));

app.listen(3000, () => console.log("Grigoletti Services on http://localhost:3000"));
`;

export const GRIGOLETTI_SERVICES_SNIPPETS = {
  html: htmlSnippet,
  react: reactSnippet,
  node: nodeSnippet,
};

export const GRIGOLETTI_SERVICES_META = {
  id: "grigoletti-services",
  name: "Segmented spring pop",
  blurb: "Dario Grigoletti spring-scale pop button from grigoletti.ch with dual-layer rest-to-hover fill transition, authentic PP Neue Corp Tight Ultrabold typography, and tactile press.",
  states: [
    "idle (outline)",
    "hover (dual-layer pop to solid fill)",
    "active (press 0.96)",
    "focus-visible",
    "reduced-motion",
  ],
  keywords: [
    "animated button",
    "interactive button",
    "grigoletti",
    "pp neue corp",
    "spring scale pop",
    "dual layer",
    "framer button",
    "swiss design",
    "minimalist",
    "tactile press",
    "clean modern",
  ],
};

