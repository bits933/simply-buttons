const CLUELY_CTA_CSS = `
.btn-cluely-btn {
  appearance: none;
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  height: 44px;
  padding: 0 22px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #ffffff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  backdrop-filter: blur(1px);
  transition: transform 120ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms ease;
  box-shadow:
    rgba(0, 15, 154, 0.65) -1px -1px 4px inset,
    rgba(119, 133, 164, 0.32) 0 8px 16px -4px,
    rgba(0, 0, 0, 0.25) 0 2px 4px,
    rgba(255, 255, 255, 0.35) -0.5px -0.5px 1px inset;
}

.btn-cluely-btn *,
.btn-cluely-btn *::before,
.btn-cluely-btn *::after {
  box-sizing: border-box;
}

/* Outer Gradient Hairline Border */
.btn-cluely-btn::before {
  content: "";
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: 9px;
  background: radial-gradient(
    115% 115% at 10% 15%,
    rgba(119, 198, 255, 0.85) 15%,
    rgb(111, 127, 220) 100%
  );
  filter: blur(0.4px);
  pointer-events: none;
}

/* Inner Background Radial Base Gradient */
.btn-cluely-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 7px;
  background:
    radial-gradient(98% 98% at 65% 82%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%),
    radial-gradient(86% 86% at 10% 17%, rgb(73, 126, 233) 0%, rgb(95, 134, 230) 100%);
  background-blend-mode: overlay;
  overflow: hidden;
  transition: opacity 300ms ease-in-out;
}

/* Hover Gradient Layer */
.btn-cluely-hover-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: 7px;
  background:
    radial-gradient(98% 98% at 65% 82%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%),
    radial-gradient(86% 86% at 10% 17%, rgb(20, 78, 194) 0%, rgb(95, 134, 230) 100%);
  background-blend-mode: overlay;
  opacity: 0;
  transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

/* Ambient Cyan Glow Light Particles */
.btn-cluely-glow {
  position: absolute;
  inset: -1px;
  z-index: 2;
  border-radius: 7px;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.85;
}

.btn-cluely-glow span {
  position: absolute;
  border-radius: 100%;
  background: #7df0f8;
  opacity: 0.38;
  mix-blend-mode: lighten;
  filter: blur(14px);
}

.btn-cluely-glow span:nth-child(1) {
  top: -30px;
  right: 4px;
  width: 55px;
  height: 55px;
}

.btn-cluely-glow span:nth-child(2) {
  top: 2px;
  right: 6px;
  width: 50px;
  height: 22px;
}

.btn-cluely-glow span:nth-child(3) {
  bottom: -25px;
  left: -12px;
  width: 55px;
  height: 55px;
}

/* Noise Texture Overlay */
.btn-cluely-noise {
  position: absolute;
  inset: 0;
  z-index: 3;
  opacity: 0.24;
  border-radius: 7px;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E");
  background-size: 80px 80px;
  mix-blend-mode: overlay;
}

/* Inner Rim Highlight */
.btn-cluely-rim {
  position: absolute;
  inset: 0;
  z-index: 4;
  border-radius: 7px;
  padding: 1px;
  pointer-events: none;
  opacity: 0.45;
  background: linear-gradient(
    177deg,
    rgba(255, 255, 255, 0.6) 8%,
    rgba(255, 255, 255, 0) 85%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

.btn-cluely-content {
  position: relative;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 15, 80, 0.35);
}

.btn-cluely-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  fill: currentColor;
  transform: translateY(-0.5px);
}

@media (hover: hover) {
  .btn-cluely-btn:hover:not(:disabled) .btn-cluely-hover-bg {
    opacity: 1;
  }
  .btn-cluely-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow:
      rgba(0, 15, 154, 0.75) -1px -1px 5px inset,
      rgba(119, 133, 164, 0.45) 0 12px 24px -6px,
      rgba(0, 0, 0, 0.3) 0 3px 6px,
      rgba(255, 255, 255, 0.45) -0.5px -0.5px 1px inset;
  }
}

.btn-cluely-btn:focus-visible {
  outline: 2px solid #7df0f8;
  outline-offset: 3px;
}

.btn-cluely-btn:active:not(:disabled) {
  transform: scale(0.98);
}
`.trim();

const CLUELY_CTA_MARKUP = `
<button class="btn-cluely-btn" type="button" aria-label="Get for Mac">
  <span class="btn-cluely-bg" aria-hidden="true"></span>
  <span class="btn-cluely-hover-bg" aria-hidden="true"></span>
  <span class="btn-cluely-glow" aria-hidden="true">
    <span></span><span></span><span></span>
  </span>
  <span class="btn-cluely-noise" aria-hidden="true"></span>
  <span class="btn-cluely-rim" aria-hidden="true"></span>
  <span class="btn-cluely-content">
    <svg class="btn-cluely-icon" viewBox="0 0 27 26" fill="none" aria-hidden="true">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0657 6.44451C15.6697 6.20767 16.4258 5.93555 17.5488 5.93555C19.3037 5.93555 21.1564 6.86179 22.3948 8.38999L23.1841 9.36399L22.0823 9.96225C19.4438 11.3951 19.8102 15.1728 22.552 16.1988L23.5986 16.5905L23.1351 17.6074C22.6396 18.6944 22.3823 19.224 21.7153 20.2268C20.6926 21.7696 19.2845 23.632 17.2408 23.651C15.9727 23.6629 14.964 22.7844 13.7066 22.7911C12.4408 22.7978 11.4114 23.6542 10.1357 23.6541H10.1266C8.11979 23.6364 6.72925 21.915 5.71591 20.3878C3.0736 16.4057 2.71935 11.7379 4.52639 8.98304C5.81307 7.02147 7.77676 5.93836 9.7493 5.93836C10.7341 5.93836 11.5325 6.2139 12.1555 6.43307C12.8153 6.66521 13.2281 6.80964 13.6827 6.80964C14.1573 6.80964 14.4732 6.6768 15.0657 6.44451Z" fill="currentColor"/>
      <path d="M17.2132 3.63495C17.9598 2.67729 18.4693 1.38216 18.2636 0C17.044 0.0836494 15.6754 0.802611 14.8429 1.81343C14.0877 2.73045 13.463 4.09151 13.7054 5.41426C15.0359 5.4557 16.4134 4.66142 17.2132 3.63495Z" fill="currentColor"/>
    </svg>
    <span>Get for Mac</span>
  </span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cluely Get for Mac CTA</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #0e1117;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    ${CLUELY_CTA_CSS}
  </style>
</head>
<body>
  ${CLUELY_CTA_MARKUP}
</body>
</html>
`;

export const CLUELY_CTA_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import React from "react";

const CSS = ${JSON.stringify(CLUELY_CTA_CSS)};

export default function CluelyCtaButton({
  label = "Get for Mac",
  disabled = false,
  onClick,
}) {
  React.useEffect(() => {
    if (document.getElementById("btn-cluely-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-cluely-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button
      type="button"
      className="btn-cluely-btn"
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
    >
      <span className="btn-cluely-bg" aria-hidden="true" />
      <span className="btn-cluely-hover-bg" aria-hidden="true" />
      <span className="btn-cluely-glow" aria-hidden="true">
        <span /><span /><span />
      </span>
      <span className="btn-cluely-noise" aria-hidden="true" />
      <span className="btn-cluely-rim" aria-hidden="true" />
      <span className="btn-cluely-content">
        <svg className="btn-cluely-icon" viewBox="0 0 27 26" fill="none" aria-hidden="true">
          <path fillRule="evenodd" clipRule="evenodd" d="M15.0657 6.44451C15.6697 6.20767 16.4258 5.93555 17.5488 5.93555C19.3037 5.93555 21.1564 6.86179 22.3948 8.38999L23.1841 9.36399L22.0823 9.96225C19.4438 11.3951 19.8102 15.1728 22.552 16.1988L23.5986 16.5905L23.1351 17.6074C22.6396 18.6944 22.3823 19.224 21.7153 20.2268C20.6926 21.7696 19.2845 23.632 17.2408 23.651C15.9727 23.6629 14.964 22.7844 13.7066 22.7911C12.4408 22.7978 11.4114 23.6542 10.1357 23.6541H10.1266C8.11979 23.6364 6.72925 21.915 5.71591 20.3878C3.0736 16.4057 2.71935 11.7379 4.52639 8.98304C5.81307 7.02147 7.77676 5.93836 9.7493 5.93836C10.7341 5.93836 11.5325 6.2139 12.1555 6.43307C12.8153 6.66521 13.2281 6.80964 13.6827 6.80964C14.1573 6.80964 14.4732 6.6768 15.0657 6.44451Z" fill="currentColor"/>
          <path d="M17.2132 3.63495C17.9598 2.67729 18.4693 1.38216 18.2636 0C17.044 0.0836494 15.6754 0.802611 14.8429 1.81343C14.0877 2.73045 13.463 4.09151 13.7054 5.41426C15.0359 5.4557 16.4134 4.66142 17.2132 3.63495Z" fill="currentColor"/>
        </svg>
        <span>{label}</span>
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

export const CLUELY_CTA_META = {
  id: "cluely-cta",
  name: "Download for mac button",
  blurb: "Multi-layered electric blue glass CTA with ambient cyan aura & Apple glyph.",
  states: "default, hover, focus, active, disabled",
  keywords: [
    "download for mac button",
    "cta",
    "download",
    "mac",
    "apple",
    "glass",
    "glassmorphism",
    "electric blue",
    "cyan aura",
    "frosted",
    "pill",
    "apple glyph",
    "hover",
    "mac download",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
