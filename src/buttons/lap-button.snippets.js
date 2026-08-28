const CSS = `
.btn-lap-btn {
  --lap-fill: #ffffff;
  --lap-ink: #111111;
  --lap-track: #d9d9d9;
  --lap-run: #111111;
  --lap-focus: #171717;
  --lap-text-ms: 480ms;
  --lap-stroke-ms: 720ms;
  --lap-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --lap-stroke-ease: cubic-bezier(0.83, 0, 0.17, 1);
  appearance: none;
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 58px;
  padding: 0 24px;
  overflow: visible;
  border: 0;
  border-radius: 999px;
  background: var(--lap-fill);
  color: var(--lap-ink);
  font-family: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.15;
  text-transform: uppercase;
  cursor: pointer;
}
.btn-lap-frame { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.btn-lap-track, .btn-lap-run { fill: none; stroke-linecap: butt; stroke-linejoin: round; }
.btn-lap-track { stroke: var(--lap-track); stroke-width: 1.5; }
.btn-lap-run {
  stroke: var(--lap-run);
  stroke-width: 1.5;
  stroke-dasharray: 100;
  stroke-dashoffset: 101;
  opacity: 0;
  transform-origin: 50% 50%;
  transform: rotate(180deg);
  transition: stroke-dashoffset var(--lap-stroke-ms) var(--lap-stroke-ease), opacity 0ms linear;
}
.btn-lap-copy { position: relative; z-index: 1; display: grid; overflow: hidden; line-height: 1.15; }
.btn-lap-line { grid-area: 1 / 1; white-space: nowrap; transform-origin: 50% 50%; transition: transform var(--lap-text-ms) var(--lap-ease); }
.btn-lap-line--out { transform: translateY(0) scale(1); }
.btn-lap-line--in { transform: translateY(115%) scale(0.78); }
.btn-lap-btn:hover .btn-lap-run, .btn-lap-btn:focus-visible .btn-lap-run { opacity: 1; stroke-dashoffset: 0; }
.btn-lap-btn:hover .btn-lap-line--out, .btn-lap-btn:focus-visible .btn-lap-line--out { transform: translateY(-115%) scale(0.78); }
.btn-lap-btn:hover .btn-lap-line--in, .btn-lap-btn:focus-visible .btn-lap-line--in { transform: translateY(0) scale(1); }
.btn-lap-btn:focus { outline: none; }
.btn-lap-btn:focus-visible { outline: 2px solid var(--lap-focus); outline-offset: 4px; }
.btn-lap-btn:disabled { cursor: not-allowed; opacity: 0.42; }
@media (prefers-color-scheme: dark) {
  .btn-lap-btn { --lap-fill: #161719; --lap-ink: #f3f3f3; --lap-track: #3a3c40; --lap-run: #f3f3f3; --lap-focus: #f5f5f5; }
}
@media (prefers-reduced-motion: reduce) {
  .btn-lap-run, .btn-lap-line { transition: none; }
}
`.trim();

const MARKUP = `
<button type="button" class="btn-lap-btn">
  <svg class="btn-lap-frame" aria-hidden="true">
    <rect class="btn-lap-track" x="1.25" y="1.25" width="calc(100% - 2.5px)" height="calc(100% - 2.5px)" rx="28.25" ry="28.25" pathLength="100"></rect>
    <rect class="btn-lap-run" x="1.25" y="1.25" width="calc(100% - 2.5px)" height="calc(100% - 2.5px)" rx="28.25" ry="28.25" pathLength="100"></rect>
  </svg>
  <span class="btn-lap-copy">
    <span class="btn-lap-line btn-lap-line--out">START EXPERIENCE</span>
    <span class="btn-lap-line btn-lap-line--in" aria-hidden="true">START EXPERIENCE</span>
  </span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lap button</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f3f4f6; }
    ${CSS}
  </style>
</head>
<body>
  ${MARKUP}
</body>
</html>
`;

export const LAP_BUTTON_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const CSS = ${JSON.stringify(CSS)};

export default function LapButton({ label = "START EXPERIENCE", disabled = false }) {
  useEffect(() => {
    if (document.getElementById("btn-lap-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-lap-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button type="button" className="btn-lap-btn" disabled={disabled}>
      <svg className="btn-lap-frame" aria-hidden="true">
        <rect className="btn-lap-track" x="1.25" y="1.25" width="calc(100% - 2.5px)" height="calc(100% - 2.5px)" rx="28.25" ry="28.25" pathLength="100" />
        <rect className="btn-lap-run" x="1.25" y="1.25" width="calc(100% - 2.5px)" height="calc(100% - 2.5px)" rx="28.25" ry="28.25" pathLength="100" />
      </svg>
      <span className="btn-lap-copy">
        <span className="btn-lap-line btn-lap-line--out">{label}</span>
        <span className="btn-lap-line btn-lap-line--in" aria-hidden="true">{label}</span>
      </span>
    </button>
  );
}
`,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const LAP_BUTTON_META = {
  id: "lap-button",
  name: "Lap button",
  blurb: "Light capsule stroke. Hover sends the label up as a copy rises, while a darker stroke completes one lap.",
  states: "default, hover, focus, disabled",
  keywords: [
    "lap button",
    "start experience",
    "capsule cta",
    "pill button",
    "stroke lap",
    "border draw",
    "svg stroke",
    "text swap",
    "scale up",
    "scale down",
    "hover reveal",
    "unleashingbest",
    "outline button",
    "animated button",
    "interactive button",
    "dual label",
    "stroke dash",
    "rounded pill",
  ],
};
