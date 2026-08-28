const LETTER_ROLL_CSS = `
.btn-roll-btn {
  --roll-bg: #171717;
  --roll-fg: #ffffff;
  --roll-dur: 0.28s;
  --roll-stagger: 0.055s;
  --roll-ease: cubic-bezier(0.25, 1, 0.5, 1);
  appearance: none;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 112px;
  min-height: 42px;
  padding: 0 22px;
  border: 1px solid var(--roll-bg);
  border-radius: 9999px;
  background-color: var(--roll-bg);
  color: var(--roll-fg);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  transition: transform 90ms ease, filter 140ms ease;
}

.btn-roll-btn *,
.btn-roll-btn *::before,
.btn-roll-btn *::after {
  box-sizing: border-box;
}

.btn-roll-btn:focus {
  outline: none;
}

.btn-roll-btn:focus-visible {
  outline: 2px solid var(--roll-bg);
  outline-offset: 3px;
}

.btn-roll-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-roll-btn:disabled {
  cursor: not-allowed;
  opacity: 0.42;
  transform: none;
}

.btn-roll-track {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 1.25em;
  overflow: hidden;
}

.btn-roll-mother,
.btn-roll-mother2 {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.btn-roll-mother span,
.btn-roll-mother2 span {
  display: inline-block;
  will-change: transform;
  transition: transform var(--roll-dur) var(--roll-ease);
  transition-delay: calc(var(--i, 0) * var(--roll-stagger));
}

.btn-roll-mother span {
  transform: translateY(0);
}

.btn-roll-mother2 {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-roll-mother2 span {
  transform: translateY(-140%);
}

@media (hover: hover) {
  .btn-roll-btn:hover:not(:disabled) .btn-roll-mother span {
    transform: translateY(140%);
  }

  .btn-roll-btn:hover:not(:disabled) .btn-roll-mother2 span {
    transform: translateY(0);
  }
}

.btn-roll-btn:focus-visible .btn-roll-mother span {
  transform: translateY(140%);
}

.btn-roll-btn:focus-visible .btn-roll-mother2 span {
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .btn-roll-btn,
  .btn-roll-mother span,
  .btn-roll-mother2 span {
    transition: none;
  }
}
`.trim();

const LETTER_ROLL_MARKUP = `
<button class="btn-roll-btn" type="button" aria-label="Button">
  <span class="btn-roll-track">
    <span class="btn-roll-mother">
      <span style="--i:0">B</span>
      <span style="--i:1">u</span>
      <span style="--i:2">t</span>
      <span style="--i:3">t</span>
      <span style="--i:4">o</span>
      <span style="--i:5">n</span>
    </span>
    <span class="btn-roll-mother2" aria-hidden="true">
      <span style="--i:0">B</span>
      <span style="--i:1">u</span>
      <span style="--i:2">t</span>
      <span style="--i:3">t</span>
      <span style="--i:4">o</span>
      <span style="--i:5">n</span>
    </span>
  </span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Letter Roll Button</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #f3f4f6;
      font-family: system-ui, -apple-system, sans-serif;
    }
    ${LETTER_ROLL_CSS}
  </style>
</head>
<body>
  ${LETTER_ROLL_MARKUP}
</body>
</html>
`;

export const LETTER_ROLL_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import React from "react";

const CSS = ${JSON.stringify(LETTER_ROLL_CSS)};

export default function LetterRollButton({
  label = "Button",
  disabled = false,
  onClick,
}) {
  React.useEffect(() => {
    if (document.getElementById("btn-roll-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-roll-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  const letters = Array.from(label);

  return (
    <button
      type="button"
      className="btn-roll-btn"
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
    >
      <span className="btn-roll-track">
        <span className="btn-roll-mother">
          {letters.map((char, index) => (
            <span key={index} style={{ "--i": index }}>
              {char === " " ? "\\u00A0" : char}
            </span>
          ))}
        </span>
        <span className="btn-roll-mother2" aria-hidden="true">
          {letters.map((char, index) => (
            <span key={index} style={{ "--i": index }}>
              {char === " " ? "\\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
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

export const LETTER_ROLL_META = {
  id: "letter-roll",
  name: "Letter roll",
  blurb: "Staggered cascading letter drop wave animation.",
  states: "default, hover, focus, active, disabled",
  keywords: [
    "letter roll",
    "cta",
    "hover",
    "letter drop",
    "cascade",
    "stagger",
    "wave",
    "text animation",
    "type motion",
    "scramble",
    "roll",
    "kinetic type",
    "pill",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
