const DAY_CSS = `
.btn-day-root { display: grid; place-items: center; }
.btn-day-toggle {
  --day-ease: cubic-bezier(0.23, 1, 0.32, 1);
  --day-focus: #171717;
  --day-white-drop: 0 -8px 12px -1px rgba(255, 255, 255, 0.16);
  position: relative;
  display: inline-block;
  height: 100px;
  width: 100px;
}
:root[data-theme="dark"] .btn-day-toggle { --day-focus: #f5f5f5; }
.btn-day-toggle::before {
  content: "";
  box-shadow: 0;
  border-radius: 84.5px;
  background: #fff;
  position: absolute;
  margin-left: -36px;
  margin-top: -36px;
  opacity: 0.2;
  height: 72px;
  width: 72px;
  left: 50%;
  top: 50%;
  pointer-events: none;
}
.btn-day-face {
  transition: all 300ms var(--day-ease);
  box-shadow:
    0 15px 25px -4px rgba(0, 0, 0, 0.5),
    inset 0 -3px 4px -1px rgba(0, 0, 0, 0.2),
    var(--day-white-drop),
    inset 0 3px 4px -1px rgba(255, 255, 255, 0.2),
    inset 0 0 5px 1px rgba(255, 255, 255, 0.8),
    inset 0 20px 30px 0 rgba(255, 255, 255, 0.2);
  border-radius: 68.8px;
  position: absolute;
  background: #eaeaea;
  margin-left: -34.4px;
  margin-top: -34.4px;
  display: block;
  height: 68.8px;
  width: 68.8px;
  left: 50%;
  top: 50%;
  pointer-events: none;
}
.btn-day-label {
  transition: color 300ms ease-out, font-size 300ms var(--day-ease);
  line-height: 101px;
  text-align: center;
  position: absolute;
  font-weight: 700;
  font-size: 28px;
  display: grid;
  place-items: center;
  opacity: 0.9;
  height: 100%;
  width: 100%;
  color: rgba(0, 0, 0, 0.9);
  pointer-events: none;
}
.btn-day-sun,
.btn-day-moon {
  grid-area: 1 / 1;
  display: block;
  width: 28px;
  height: 28px;
  transition: opacity 300ms ease-out, transform 300ms var(--day-ease);
}
.btn-day-moon { opacity: 0; transform: scale(0.84) rotate(-16deg); }
.btn-day-hit {
  appearance: none;
  opacity: 0;
  position: absolute;
  cursor: pointer;
  z-index: 1;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  margin: 0;
  border: 0;
  padding: 0;
  background: transparent;
}
.btn-day-hit:focus { outline: none; }
.btn-day-hit:focus-visible {
  outline: 2px solid var(--day-focus);
  outline-offset: 4px;
  opacity: 1;
  background: transparent;
  box-shadow: none;
}
.btn-day-hit:active ~ .btn-day-face {
  filter: blur(0.5px);
  box-shadow:
    0 12px 25px -4px rgba(0, 0, 0, 0.4),
    inset 0 -8px 30px 1px rgba(255, 255, 255, 0.9),
    var(--day-white-drop),
    inset 0 8px 25px 0 rgba(0, 0, 0, 0.4),
    inset 0 0 10px 1px rgba(255, 255, 255, 0.6);
}
.btn-day-hit:active ~ .btn-day-label {
  font-size: 26px;
  color: rgba(0, 0, 0, 0.45);
}
.btn-day-hit:checked ~ .btn-day-face {
  background: #3f3f3f;
  filter: blur(0.5px);
  box-shadow:
    0 10px 25px -4px rgba(0, 0, 0, 0.4),
    inset 0 -8px 25px -1px rgba(0, 0, 0, 0.7),
    var(--day-white-drop),
    inset 0 8px 20px 0 rgba(0, 0, 0, 0.45),
    inset 0 0 5px 1px rgba(0, 0, 0, 0.55);
}
.btn-day-hit:checked:active ~ .btn-day-face {
  box-shadow:
    0 12px 25px -4px rgba(0, 0, 0, 0.4),
    inset 0 -8px 30px 1px rgba(0, 0, 0, 0.75),
    var(--day-white-drop),
    inset 0 8px 25px 0 rgba(0, 0, 0, 0.55),
    inset 0 0 10px 1px rgba(0, 0, 0, 0.5);
}
.btn-day-hit:checked ~ .btn-day-label { color: rgba(255, 255, 255, 0.88); }
.btn-day-hit:checked ~ .btn-day-label .btn-day-sun {
  opacity: 0;
  transform: scale(0.84) rotate(16deg);
}
.btn-day-hit:checked ~ .btn-day-label .btn-day-moon {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
.btn-day-hit:checked:active ~ .btn-day-label { color: rgba(255, 255, 255, 0.45); }
.btn-day-hit:disabled { cursor: not-allowed; }
.btn-day-hit:disabled ~ .btn-day-face,
.btn-day-hit:disabled ~ .btn-day-label { opacity: 0.42; }
@media (prefers-reduced-motion: reduce) {
  .btn-day-face,
  .btn-day-label,
  .btn-day-sun,
  .btn-day-moon { transition: none; }
}
`;

const DAY_MARKUP = `
<div class="btn-day-toggle">
  <input class="btn-day-hit" type="checkbox" aria-label="Toggle night mode"/>
  <span class="btn-day-face"></span>
  <span class="btn-day-label">
    <svg class="btn-day-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" fill="currentColor"/>
      <path d="M12 2.5v2.2M12 19.3v2.2M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <svg class="btn-day-moon" viewBox="0 0 30 30" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M10.244141,3.9980469A12,12 0 0 0 3,15 12,12 0 0 0 15,27 12,12 0 0 0 25.900391,19.992188 12,12 0 0 1 21.142578,20.990234 12,12 0 0 1 9.1425781,8.9902344 12,12 0 0 1 10.244141,3.9980469Z"/>
    </svg>
  </span>
</div>
`;

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Day night</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body { display: grid; place-items: center; background: #e8eaee; }
    ${DAY_CSS}
  </style>
</head>
<body>
  <div class="btn-day-root">
    ${DAY_MARKUP}
  </div>
</body>
</html>
`;

export const DAY_NIGHT_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const DAY_CSS = ${JSON.stringify(DAY_CSS)};

function SunIcon() {
  return (
    <svg className="btn-day-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="btn-day-moon" viewBox="0 0 30 30" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M10.244141,3.9980469A12,12 0 0 0 3,15 12,12 0 0 0 15,27 12,12 0 0 0 25.900391,19.992188 12,12 0 0 1 21.142578,20.990234 12,12 0 0 1 9.1425781,8.9902344 12,12 0 0 1 10.244141,3.9980469Z"
      />
    </svg>
  );
}

export default function DayNightButton({ disabled = false, className = "", ...rest }) {
  useEffect(() => {
    if (document.getElementById("btn-day-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-day-styles";
    tag.textContent = DAY_CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <div className={["btn-day-toggle", className].filter(Boolean).join(" ")}>
      <input
        className="btn-day-hit"
        type="checkbox"
        disabled={disabled}
        aria-label="Toggle night mode"
        {...rest}
      />
      <span className="btn-day-face" />
      <span className="btn-day-label">
        <SunIcon />
        <MoonIcon />
      </span>
    </div>
  );
}
`,
  node: `const express = require("express");

const app = express();

const PAGE = ${JSON.stringify(HTML_PAGE)};

app.get("/", function (req, res) {
  res.type("html").send(PAGE);
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
`,
};

export const DAY_NIGHT_META = {
  id: "day-night",
  name: "Day night",
  blurb: "Clay press toggle. Sun on a light face, moon on a dark face.",
  states: "default, active, night, focus, disabled",
  keywords: [
    "day night",
    "theme toggle",
    "clay toggle",
    "sun moon",
    "dark mode",
    "light mode",
    "press toggle",
    "clay button",
    "day night switch",
    "night mode",
    "sun face",
    "moon face",
    "soft clay",
    "mode switch",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
