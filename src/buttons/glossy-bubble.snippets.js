const CSS = `
.btn-bubble-btn {
  --bubble-bg: #eff6ff;
  --bubble-ink: rgba(156, 163, 175, 0.9);
  --bubble-ink-hover: #f3f4f6;
  --bubble-blob: #3b82f6;
  --bubble-fluid-bg: #ef4444;
  --bubble-fluid-shadow: inset 0 0 50px rgba(255, 255, 255, 0.5);
  --bubble-wave-1: rgb(20, 20, 20);
  --bubble-wave-2: rgba(20, 20, 20, 0.5);
  --bubble-shadow:
    inset 5px 5px 15px rgba(0, 0, 0, 0.1),
    7px 10px 10px rgba(0, 0, 0, 0.1),
    7px 10px 10px rgba(0, 0, 0, 0.1),
    inset -5px -5px 15px rgba(255, 255, 255, 0.5);
  --bubble-shadow-active:
    inset 2px 2px 8px rgba(0, 0, 0, 0.15),
    3px 5px 6px rgba(0, 0, 0, 0.08),
    inset -2px -2px 8px rgba(255, 255, 255, 0.4);
  --bubble-drop: rgba(255, 255, 255, 0.9);
  --bubble-drop-hover: rgba(255, 255, 255, 0.4);
  --bubble-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --bubble-focus: #3b82f6;
  appearance: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 140px;
  padding: 16px 48px;
  background: var(--bubble-bg);
  color: var(--bubble-ink);
  border: none;
  border-radius: 16px;
  box-shadow: var(--bubble-shadow);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition:
    transform 0.3s var(--bubble-ease),
    box-shadow 0.3s var(--bubble-ease);
}
.btn-bubble-btn *,
.btn-bubble-btn *::before,
.btn-bubble-btn *::after { box-sizing: border-box; }
.btn-bubble-btn::before,
.btn-bubble-btn::after {
  content: "";
  position: absolute;
  z-index: 50;
  pointer-events: none;
  background: var(--bubble-drop);
  transition: all 0.5s ease;
  transition-delay: 100ms;
}
.btn-bubble-btn::before {
  bottom: 8px;
  left: 8px;
  width: 16px;
  height: 24px;
  border-radius: 32% 68% 40% 60%;
}
.btn-bubble-btn::after {
  bottom: 36px;
  left: 12px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.btn-bubble-btn:hover::before {
  transform: translate(-2px, 2px);
  background: var(--bubble-drop-hover);
}
.btn-bubble-btn:hover::after {
  transform: translate(-4px, 4px);
  background: var(--bubble-drop-hover);
}
.btn-bubble-btn:active {
  transform: translateY(4px);
  box-shadow: var(--bubble-shadow-active);
}
.btn-bubble-btn:active::before {
  transform: translateX(128px);
  border-radius: 68% 32% 60% 40%;
  transition-duration: 1000ms;
}
.btn-bubble-btn:active::after {
  transform: translateX(128px);
  transition-duration: 1000ms;
}
.btn-bubble-text {
  position: relative;
  z-index: 40;
  transition: all 0.3s ease-in;
}
.btn-bubble-btn:hover .btn-bubble-text {
  color: var(--bubble-ink-hover);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}
.btn-bubble-blob {
  position: absolute;
  top: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--bubble-blob);
  z-index: 10;
  pointer-events: none;
  transition: all 0.3s ease-in;
  transition-delay: 100ms;
}
.btn-bubble-blob--left { left: -50%; }
.btn-bubble-blob--right { right: -50%; }
.btn-bubble-btn:hover .btn-bubble-blob--left {
  width: 144px;
  height: 144px;
  top: -50%;
  left: -25%;
}
.btn-bubble-btn:hover .btn-bubble-blob--right {
  width: 144px;
  height: 144px;
  top: -50%;
  right: -25%;
}
.btn-bubble-fluid {
  position: absolute;
  top: -80px;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bubble-fluid-bg);
  box-shadow: var(--bubble-fluid-shadow);
  z-index: 20;
  pointer-events: none;
}
.btn-bubble-fluid::before,
.btn-bubble-fluid::after {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 200%;
  height: 200%;
  transform: translate(-50%, -75%);
  z-index: 50;
}
.btn-bubble-fluid::before {
  border-radius: 45%;
  background: var(--bubble-wave-1);
}
.btn-bubble-fluid::after {
  border-radius: 40%;
  background: var(--bubble-wave-2);
}
.btn-bubble-btn:focus-visible {
  outline: 2px solid var(--bubble-focus);
  outline-offset: 3px;
}
@media (prefers-reduced-motion: reduce) {
  .btn-bubble-btn,
  .btn-bubble-btn::before,
  .btn-bubble-btn::after,
  .btn-bubble-blob,
  .btn-bubble-fluid { transition: none; }
}
`.trim();

const MARKUP = `
<button class="btn-bubble-btn" type="button" aria-label="Button">
  <span class="btn-bubble-text">Button</span>
  <div class="btn-bubble-blob btn-bubble-blob--left" aria-hidden="true"></div>
  <div class="btn-bubble-blob btn-bubble-blob--right" aria-hidden="true"></div>
  <div class="btn-bubble-fluid" aria-hidden="true"></div>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Glossy Bubble Button</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f4f4; }
    ${CSS}
  </style>
</head>
<body>
  ${MARKUP}
</body>
</html>
`;

export const GLOSSY_BUBBLE_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const CSS = ${JSON.stringify(CSS)};

export default function GlossyBubbleButton({
  label = "Button",
  onClick,
}) {
  useEffect(() => {
    if (document.getElementById("btn-bubble-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-bubble-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button
      type="button"
      className="btn-bubble-btn"
      aria-label={label}
      onClick={onClick}
    >
      <span className="btn-bubble-text">{label}</span>
      <div className="btn-bubble-blob btn-bubble-blob--left" aria-hidden="true" />
      <div className="btn-bubble-blob btn-bubble-blob--right" aria-hidden="true" />
      <div className="btn-bubble-fluid" aria-hidden="true" />
    </button>
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

export const GLOSSY_BUBBLE_META = {
  id: "glossy-bubble",
  name: "Glossy Bubble",
  blurb: "Tactile claymorphic button with blue liquid fill blobs, red fluid wave crest, and specular reflection droplets.",
  states: "default, hover, active (stretch & squirt), focus",
  keywords: [
    "glossy bubble",
    "claymorphic",
    "liquid fill",
    "blue blobs",
    "fluid wave",
    "wave crest",
    "specular droplets",
    "glossy clay",
    "bubble button",
    "tactile clay",
    "liquid blobs",
    "red crest",
    "reflection drops",
    "squishy fill",
    "glossy liquid",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
