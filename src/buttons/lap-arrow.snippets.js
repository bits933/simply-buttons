const CSS = `
.btn-lapa-btn {
  --lapa-fill: #ffffff;
  --lapa-ink: #111111;
  --lapa-track: #d9d9d9;
  --lapa-run: #111111;
  --lapa-focus: #171717;
  --lapa-icon-ms: 720ms;
  --lapa-stroke-ms: 1100ms;
  --lapa-ease: cubic-bezier(0.92, 0, 0.08, 1);
  --lapa-stroke-ease: cubic-bezier(0.92, 0, 0.08, 1);
  appearance: none;
  position: relative;
  isolation: isolate;
  display: inline-grid;
  place-items: center;
  width: 58px;
  height: 58px;
  padding: 0;
  overflow: visible;
  border: 0;
  border-radius: 50%;
  background: var(--lapa-fill);
  color: var(--lapa-ink);
  cursor: pointer;
}
.btn-lapa-frame { position: absolute; inset: 0; z-index: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
.btn-lapa-track, .btn-lapa-run { fill: none; stroke-linecap: butt; stroke-linejoin: round; }
.btn-lapa-track { stroke: var(--lapa-track); stroke-width: 1.5; }
.btn-lapa-run {
  stroke: var(--lapa-run);
  stroke-width: 1.5;
  stroke-dasharray: 100;
  stroke-dashoffset: 101;
  opacity: 0;
  transform-origin: 29px 29px;
  transform: rotate(180deg);
  transition: stroke-dashoffset var(--lapa-stroke-ms) var(--lapa-stroke-ease), opacity 0ms linear;
}
.btn-lapa-copy { position: relative; z-index: 1; display: grid; width: 20px; height: 20px; overflow: hidden; }
.btn-lapa-icon { grid-area: 1 / 1; display: block; width: 20px; height: 20px; transform-origin: 50% 50%; transition: transform var(--lapa-icon-ms) var(--lapa-ease); }
.btn-lapa-icon--out { transform: translateX(0) scale(1); }
.btn-lapa-icon--in { transform: translateX(-120%) scale(0.78); }
.btn-lapa-btn:hover .btn-lapa-run, .btn-lapa-btn:focus-visible .btn-lapa-run { opacity: 1; stroke-dashoffset: 0; }
.btn-lapa-btn:hover .btn-lapa-icon--out, .btn-lapa-btn:focus-visible .btn-lapa-icon--out { transform: translateX(120%) scale(0.78); }
.btn-lapa-btn:hover .btn-lapa-icon--in, .btn-lapa-btn:focus-visible .btn-lapa-icon--in { transform: translateX(0) scale(1); }
.btn-lapa-btn:focus { outline: none; }
.btn-lapa-btn:focus-visible { outline: 2px solid var(--lapa-focus); outline-offset: 4px; }
.btn-lapa-btn:disabled { cursor: not-allowed; opacity: 0.42; }
@media (prefers-color-scheme: dark) {
  .btn-lapa-btn { --lapa-fill: #161719; --lapa-ink: #f3f3f3; --lapa-track: #3a3c40; --lapa-run: #f3f3f3; --lapa-focus: #f5f5f5; }
}
@media (prefers-reduced-motion: reduce) {
  .btn-lapa-run, .btn-lapa-icon { transition: none; }
}
`.trim();

const ARROW = `<svg class="btn-lapa-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

const MARKUP = `
<button type="button" class="btn-lapa-btn" aria-label="Next">
  <svg class="btn-lapa-frame" viewBox="0 0 58 58" aria-hidden="true">
    <circle class="btn-lapa-track" cx="29" cy="29" r="28.25" pathLength="100"></circle>
    <circle class="btn-lapa-run" cx="29" cy="29" r="28.25" pathLength="100"></circle>
  </svg>
  <span class="btn-lapa-copy">
    ${ARROW.replace('class="btn-lapa-icon"', 'class="btn-lapa-icon btn-lapa-icon--out"')}
    ${ARROW.replace('class="btn-lapa-icon"', 'class="btn-lapa-icon btn-lapa-icon--in"')}
  </span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lap arrow</title>
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

export const LAP_ARROW_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const CSS = ${JSON.stringify(CSS)};

function ArrowIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function LapArrowButton({ disabled = false }) {
  useEffect(() => {
    if (document.getElementById("btn-lapa-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-lapa-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button type="button" className="btn-lapa-btn" disabled={disabled} aria-label="Next">
      <svg className="btn-lapa-frame" viewBox="0 0 58 58" aria-hidden="true">
        <circle className="btn-lapa-track" cx="29" cy="29" r="28.25" pathLength="100" />
        <circle className="btn-lapa-run" cx="29" cy="29" r="28.25" pathLength="100" />
      </svg>
      <span className="btn-lapa-copy">
        <ArrowIcon className="btn-lapa-icon btn-lapa-icon--out" />
        <ArrowIcon className="btn-lapa-icon btn-lapa-icon--in" />
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

export const LAP_ARROW_META = {
  id: "lap-arrow",
  name: "Lap arrow",
  blurb: "Circular next control. Hover sends the arrow right as a copy enters from the left, while a darker stroke completes one lap.",
  states: "default, hover, focus, disabled",
  keywords: [
    "lap arrow",
    "circle button",
    "circular cta",
    "arrow icon",
    "next button",
    "icon button",
    "stroke lap",
    "border draw",
    "svg stroke",
    "left to right",
    "icon swap",
    "scale up",
    "scale down",
    "animated button",
    "interactive button",
    "round button",
    "hover arrow",
    "s curve",
  ],
};
