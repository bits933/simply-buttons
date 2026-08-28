const KULTIVERET_MENU_CSS = `
.btn-kult-btn {
  --btn-kult-bg: #000000;
  --btn-kult-fg: #ffffff;
  --btn-kult-line: #ffffff;
  --btn-kult-ease: cubic-bezier(0.22, 1, 0.36, 1);

  appearance: none;
  border: none;
  outline: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  background-color: var(--btn-kult-bg);
  color: var(--btn-kult-fg);
  padding: 0 18px;
  height: 38px;
  min-width: 108px;
  font-family: "Switzer", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  border-radius: 0px;
  box-sizing: border-box;
  transition: opacity 0.2s ease, transform 0.1s ease;
}

.btn-kult-btn *,
.btn-kult-btn *::before,
.btn-kult-btn *::after {
  box-sizing: border-box;
}

.btn-kult-btn:focus {
  outline: none;
}

.btn-kult-btn:focus-visible {
  outline: 2px solid var(--btn-kult-fg);
  outline-offset: 3px;
}

.btn-kult-btn:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  pointer-events: none;
}

/* Rolling Text Effect */
.btn-kult-text-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  height: 1.25em;
  line-height: 1.25;
}

.btn-kult-text {
  display: inline-block;
  will-change: transform;
  transform: translateY(0);
  transition: transform 0.38s var(--btn-kult-ease);
}

.btn-kult-text--dup {
  position: absolute;
  top: 100%;
  left: 0;
  white-space: nowrap;
  transform: translateY(0);
  transition: transform 0.38s var(--btn-kult-ease);
}

@media (hover: hover) {
  .btn-kult-btn:hover:not(:disabled) .btn-kult-text {
    transform: translateY(-100%);
  }
}

.btn-kult-btn:focus-visible .btn-kult-text {
  transform: translateY(-100%);
}

/* Burger Icon */
.btn-kult-icon {
  flex: none;
  position: relative;
  width: 18px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Open Lines (2 Parallel Bars) */
.btn-kult-open {
  display: flex;
  flex-direction: column;
  gap: 3.5px;
  width: 100%;
  transition: transform 0.25s ease;
  will-change: transform;
}

.btn-kult-open-line {
  width: 100%;
  height: 1.5px;
  overflow: hidden;
}

.btn-kult-line {
  display: block;
  background-color: var(--btn-kult-line, currentColor);
  width: 100%;
  height: 100%;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.btn-kult-open-line:first-child .btn-kult-line {
  transform-origin: left;
}

.btn-kult-open-line:last-child .btn-kult-line {
  transform-origin: right;
}

@media (hover: hover) {
  .btn-kult-btn:hover:not(:disabled) .btn-kult-open {
    transform: scaleX(0.86);
  }
}

/* Close Lines (X) */
.btn-kult-close {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 1.5px;
  transition: transform 0.25s ease;
  will-change: transform;
  pointer-events: none;
}

.btn-kult-close-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.btn-kult-close-line--left {
  transform: rotate(45deg);
}

.btn-kult-close-line--right {
  transform: rotate(-45deg);
}

.btn-kult-close .btn-kult-line {
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (hover: hover) {
  .btn-kult-btn.is-open:hover:not(:disabled) .btn-kult-close {
    transform: translate(-50%, -50%) scale(0.86);
  }
}

/* Opened State Morph */
.btn-kult-btn.is-open .btn-kult-open .btn-kult-line {
  transform: scaleX(0);
}

.btn-kult-btn.is-open .btn-kult-close .btn-kult-line {
  transform: scaleX(1);
  transition-delay: 0.05s;
}
`.trim();

const KULTIVERET_MENU_MARKUP = `
<button class="btn-kult-btn" type="button" aria-label="Toggle menu" onclick="this.classList.toggle('is-open')">
  <span class="btn-kult-text-wrapper">
    <span class="btn-kult-text">MENU</span>
    <span class="btn-kult-text btn-kult-text--dup" aria-hidden="true">MENU</span>
  </span>
  <span class="btn-kult-icon" aria-hidden="true">
    <span class="btn-kult-open">
      <span class="btn-kult-open-line"><span class="btn-kult-line"></span></span>
      <span class="btn-kult-open-line"><span class="btn-kult-line"></span></span>
    </span>
    <span class="btn-kult-close">
      <span class="btn-kult-close-line btn-kult-close-line--left"><span class="btn-kult-line"></span></span>
      <span class="btn-kult-close-line btn-kult-close-line--right"><span class="btn-kult-line"></span></span>
    </span>
  </span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Kultiveret Menu Button</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #e8e6df;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    ${KULTIVERET_MENU_CSS}
  </style>
</head>
<body>
  ${KULTIVERET_MENU_MARKUP}
</body>
</html>
`;

export const KULTIVERET_MENU_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import React, { useState, useEffect } from "react";

const CSS = ${JSON.stringify(KULTIVERET_MENU_CSS)};

export default function KultiveretMenuButton({
  label = "MENU",
  isOpen,
  defaultOpen = false,
  onToggle,
  disabled = false,
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isOpen !== undefined ? isOpen : internalOpen;

  useEffect(() => {
    if (document.getElementById("btn-kult-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-kult-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  function handleClick(e) {
    if (disabled) return;
    if (isOpen === undefined) {
      setInternalOpen((prev) => !prev);
    }
    onToggle?.(!open);
  }

  return (
    <button
      type="button"
      className={["btn-kult-btn", open ? "is-open" : ""].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={handleClick}
    >
      <span className="btn-kult-text-wrapper">
        <span className="btn-kult-text">{label}</span>
        <span className="btn-kult-text btn-kult-text--dup" aria-hidden="true">
          {label}
        </span>
      </span>
      <span className="btn-kult-icon" aria-hidden="true">
        <span className="btn-kult-open">
          <span className="btn-kult-open-line">
            <span className="btn-kult-line" />
          </span>
          <span className="btn-kult-open-line">
            <span className="btn-kult-line" />
          </span>
        </span>
        <span className="btn-kult-close">
          <span className="btn-kult-close-line btn-kult-close-line--left">
            <span className="btn-kult-line" />
          </span>
          <span className="btn-kult-close-line btn-kult-close-line--right">
            <span className="btn-kult-line" />
          </span>
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

export const KULTIVERET_MENU_META = {
  id: "kultiveret-menu",
  name: "Kultiveret Menu",
  blurb: "Architectural menu button with rolling text flip and dynamic morphing hamburger-to-X geometry.",
  states: "default, hover, open/close toggle, focus-visible, disabled",
  keywords: [
    "kultiveret menu",
    "menu button",
    "hamburger menu",
    "hamburger to x",
    "text flip",
    "rolling text",
    "morphing icon",
    "nav toggle",
    "architectural menu",
    "menu morph",
    "open close",
    "burger icon",
    "flip label",
    "navigation toggle",
    "geometry morph",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
