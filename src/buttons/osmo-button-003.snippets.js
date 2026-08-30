/* Osmo Button 003 snippets — one self-contained set per variant.
   Source: Osmo Button Pack #003 by Eduard Bodak
   (https://x.com/eduardbodak/status/2051949088912925107). */

const CSS = `
@font-face {
  font-family: "Haffer";
  src: url("https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b17558b_HafferRegular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Haffer";
  src: url("https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b175594_HafferSemiBold.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
.osmo003-root {
  --size-unit: 16;
  --size-container-ideal: 1440;
  --size-container-min: 992px;
  --size-container-max: 1680px;
  --size-container: clamp(var(--size-container-min), 100vw, var(--size-container-max));
  --size-font: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));
  --button-003-color: #fff;
  --button-003-color-background: #f84131;
  --button-003-color-focus: #000;
  --button-003-text-border-radius: 0.25em;
  --button-003-icon-border-radius: 2.5em;
  --button-003-padding-top: 0.75em;
  --button-003-padding-bottom: 0.75em;
  --button-003-padding-x: 1em;
  --button-003-flex-flow: row-reverse;
  --button-003-transform-origin: center right;
  --button-003-rotation-direction: 1;
  --button-003-mirror-focus: 1;
  --button-003-focus-inset: -0.125em;
  --button-003-text-click-scale: 0.955 0.925;
  --button-003-icon-click-scale: 0.925;
  --button-003-ease-hover: cubic-bezier(0.19, 1, 0.22, 1);
  --button-003-ease-click: cubic-bezier(0.4, 0, 0.2, 1);
  --button-003-ease-focus: cubic-bezier(0.32, 0.72, 0, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  font-family: "Haffer", Arial, sans-serif;
  font-weight: 600;
  line-height: 1;
  font-size: var(--size-font);
}
.osmo003-root *, .osmo003-root *::after, .osmo003-root *::before { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
.osmo003-root .button-003--flip {
  --button-003-text-border-radius: 2.5em;
  --button-003-icon-border-radius: 2.5em;
  --button-003-flex-flow: row;
  --button-003-transform-origin: center left;
  --button-003-rotation-direction: -1;
  --button-003-mirror-focus: -1;
}
.osmo003-root .button-003--pill {
  --button-003-text-border-radius: 2.5em;
  --button-003-icon-border-radius: 2.5em;
}
.osmo003-root .button-003 { -webkit-tap-highlight-color: transparent; }
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .osmo003-root .button-003:is(:hover, :focus-visible) .button-003__circle-mask,
  .osmo003-root [data-hover]:is(:hover, :focus-visible) .button-003 .button-003__circle-mask {
    stroke-dashoffset: 110;
    transition: stroke-dashoffset 0.6s 0.05s var(--button-003-ease-hover);
  }
  .osmo003-root .button-003:is(:hover, :focus-visible) .button-003__icon,
  .osmo003-root [data-hover]:is(:hover, :focus-visible) .button-003 .button-003__icon {
    rotate: 360deg;
    transition: rotate 0.6s 0.05s var(--button-003-ease-hover);
  }
  .osmo003-root .button-003:is(:hover, :focus-visible) .button-003__text,
  .osmo003-root [data-hover]:is(:hover, :focus-visible) .button-003 .button-003__text {
    transition: rotate 0.6s 0.05s var(--button-003-ease-hover), translate 0.6s 0.05s var(--button-003-ease-hover);
  }
  .osmo003-root .button-003:is(:hover, :focus-visible) .button-003__text.is--default,
  .osmo003-root [data-hover]:is(:hover, :focus-visible) .button-003 .button-003__text.is--default {
    rotate: calc(var(--button-003-rotation-direction) * -60deg);
    translate: 0 var(--button-003-padding-top) 0;
  }
  .osmo003-root .button-003:is(:hover, :focus-visible) .button-003__text.is--hover,
  .osmo003-root [data-hover]:is(:hover, :focus-visible) .button-003 .button-003__text.is--hover {
    rotate: 0deg;
    translate: 0 0 0;
  }
}
.osmo003-root .button-003:is(:focus-visible)::after { box-shadow: 0 0 0 0.125em var(--button-003-color-focus); }
.osmo003-root .button-003:active .button-003__icon-wrap { scale: var(--button-003-icon-click-scale); }
.osmo003-root .button-003:active .button-003__text-wrap { scale: var(--button-003-text-click-scale); }
.osmo003-root .button-003::after {
  content: '';
  display: block;
  position: absolute;
  inset: var(--button-003-focus-inset);
  border-radius: var(--button-003-icon-border-radius) var(--button-003-text-border-radius) var(--button-003-text-border-radius) var(--button-003-icon-border-radius);
  transition: box-shadow 0.3s var(--button-003-ease-focus);
  pointer-events: none;
  z-index: 1;
  scale: var(--button-003-mirror-focus) 1;
}
.osmo003-root .button-003__icon-wrap { transition: scale 0.15s var(--button-003-ease-click); }
.osmo003-root .button-003__circle-mask { transition: stroke-dashoffset 0.5s var(--button-003-ease-hover); }
@media (prefers-reduced-motion: reduce) {
  .osmo003-root .button-003__circle-mask { stroke-dashoffset: 110; }
}
@media (hover: none) and (pointer: coarse) {
  .osmo003-root .button-003__circle-mask { stroke-dashoffset: 110; }
}
.osmo003-root .button-003__circle { transition: rotate 0.5s var(--button-003-ease-hover); }
.osmo003-root .button-003__icon { transition: rotate 0.5s var(--button-003-ease-hover); }
.osmo003-root .button-003__text-wrap { transition: scale 0.15s var(--button-003-ease-click); }
.osmo003-root .button-003__text {
  transform-origin: var(--button-003-transform-origin);
  transition: rotate 0.5s var(--button-003-ease-hover), translate 0.5s var(--button-003-ease-hover);
}
.osmo003-root .button-003__text.is--hover {
  rotate: calc(var(--button-003-rotation-direction) * 60deg);
  translate: 0 calc(var(--button-003-padding-top) * -1) 0;
}
.osmo003-root .button-003[data-button-theme='secondary'] {
  --button-003-color: #131313;
  --button-003-color-background: #ffce16;
  --button-003-text-border-radius: 2.5em;
  --button-003-icon-border-radius: 0.25em;
}
.osmo003-root .button-003 {
  grid-column-gap: 0.0625em;
  grid-row-gap: 0.0625em;
  color: var(--button-003-color);
  -webkit-user-select: none;
  user-select: none;
  flex-flow: var(--button-003-flex-flow);
  background-color: #0000;
  outline-style: none;
  align-items: center;
  padding: 0;
  line-height: 1;
  text-decoration: none;
  display: inline-flex;
  position: relative;
  font-family: inherit;
  font-size: inherit;
  border: 0;
  cursor: pointer;
}
.osmo003-root .button-003__text-wrap {
  pointer-events: none;
  white-space: nowrap;
  border-radius: var(--button-003-text-border-radius);
  display: grid;
  overflow: clip;
}
.osmo003-root .button-003__text {
  z-index: 1;
  padding-left: var(--button-003-padding-x);
  padding-right: var(--button-003-padding-x);
  padding-top: var(--button-003-padding-top);
  padding-bottom: var(--button-003-padding-bottom);
  grid-area: 1 / 1;
}
.osmo003-root .button-003__text-bg {
  background-color: var(--button-003-color-background);
  border-radius: var(--button-003-text-border-radius);
  grid-area: 1 / 1;
  padding: 0;
}
.osmo003-root .button-003__icon-wrap {
  aspect-ratio: 1;
  pointer-events: none;
  width: calc(1em + var(--button-003-padding-top) + var(--button-003-padding-bottom));
  flex-shrink: 0;
  place-items: center;
  display: grid;
}
.osmo003-root .button-003__icon-bg {
  background-color: var(--button-003-color-background);
  border-radius: var(--button-003-icon-border-radius);
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  padding: 0;
}
.osmo003-root .button-003__icon { z-index: 1; will-change: transform; grid-area: 1 / 1; width: 1em; height: 1em; }
.osmo003-root .button-003__circle {
  z-index: 1;
  will-change: transform;
  grid-area: 1 / 1;
  place-self: center;
  width: calc(100% - 0.125em);
  height: calc(100% - 0.125em);
}
.osmo003-root .button-003__circle-mask { stroke-dashoffset: 300px; stroke-dasharray: 300; }
`.trim();

const MASK_ID = "button-003-circle-mask";

function iconMarkup() {
  return `
      <span class="button-003__icon-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 68 68" width="100%" aria-hidden="true" class="button-003__circle">
          <mask id="${MASK_ID}" width="68" height="68" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
            <circle cx="34" cy="34" r="30" stroke="currentColor" stroke-width="4" class="button-003__circle-mask"></circle>
          </mask>
          <g mask="url(#${MASK_ID})">
            <circle cx="34" cy="34" r="30" stroke="currentColor" stroke-dasharray="1 6" stroke-width="4"></circle>
          </g>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" class="button-003__icon">
          <path d="M14 19L21 12L14 5" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"></path>
          <path d="M21 12H2" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"></path>
        </svg>
        <span class="button-003__icon-bg"></span>
      </span>`;
}

function textMarkup(label) {
  return `
      <span class="button-003__text-wrap">
        <span class="button-003__text is--default">${label}</span>
        <span aria-hidden="true" class="button-003__text is--hover">${label}</span>
        <span class="button-003__text-bg"></span>
      </span>`;
}

function markup({ label, theme, flip, pill, iconOnly, textOnly }) {
  const classes = ["button-003", flip && "button-003--flip", pill && "button-003--pill"]
    .filter(Boolean)
    .join(" ");
  const attrs = [
    `type="button"`,
    `data-button-003=""`,
    theme ? `data-button-theme="${theme}"` : "",
    iconOnly ? `aria-label="${label}"` : "",
    `class="${classes}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `  <div class="osmo003-root">
    <button ${attrs}>${iconOnly ? iconMarkup() : textMarkup(label)}${iconOnly || textOnly ? "" : iconMarkup()}</button>
  </div>`;
}

function htmlPage(variant, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { margin: 0; }
    ${CSS}
  </style>
</head>
<body>
${markup(variant)}
</body>
</html>
`;
}

function reactSnippet({ label, theme, flip, pill, iconOnly, textOnly, styleId, componentName, title }) {
  const className = ["button-003", flip && "button-003--flip", pill && "button-003--pill"]
    .filter(Boolean)
    .join(" ");
  return `"use client";

// ${title} — Osmo Button Pack #003 by Eduard Bodak
// https://x.com/eduardbodak/status/2051949088912925107

import { useEffect, useId } from "react";

const CSS = ${JSON.stringify(CSS)};

export default function ${componentName}() {
  const rawId = useId();
  const maskId = "${MASK_ID}-" + rawId.replace(/:/g, "");

  useEffect(() => {
    if (document.getElementById("${styleId}")) return;
    const tag = document.createElement("style");
    tag.id = "${styleId}";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <div className="osmo003-root">
      <button
        type="button"
        data-button-003=""${theme ? `
        data-button-theme="${theme}"` : ""}${iconOnly ? `
        aria-label="${label}"` : ""}
        className="${className}"
      >
        ${iconOnly ? "" : `<span className="button-003__text-wrap">
          <span className="button-003__text is--default">${label}</span>
          <span aria-hidden="true" className="button-003__text is--hover"> label </span>
          <span className="button-003__text-bg" />
        </span>`}
        ${textOnly ? "" : `<span className="button-003__icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 68 68" width="100%" aria-hidden="true" className="button-003__circle">
            <mask id={maskId} width="68" height="68" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
              <circle cx="34" cy="34" r="30" stroke="currentColor" strokeWidth="4" className="button-003__circle-mask" />
            </mask>
            <g mask={"url(#" + maskId + ")"}>
              <circle cx="34" cy="34" r="30" stroke="currentColor" strokeDasharray="1 6" strokeWidth="4" />
            </g>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="button-003__icon">
            <path d="M14 19L21 12L14 5" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
            <path d="M21 12H2" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
          </svg>
          <span className="button-003__icon-bg" />
        </span>`}
      </button>
    </div>
  );
}
`;
}

const VARIANTS = {
  default: {
    label: "Button",
    slug: "osmo-003-default",
    name: "Halo button",
    componentName: "OsmoButton003Default",
    styleId: "osmo003-default-styles",
    blurb:
      "Variant 1 of 6 from Eduard Bodak's 100 Buttons #003 — hover draws dashed halo lines around the arrow through an SVG mask while the label rolls in on a circular arc.",
    states: "default, hover, focus-visible, active, reduced motion",
    extraKeywords: ["red button", "rounded icon chip", "icon left"],
  },
  alt: {
    label: "Button",
    theme: "secondary",
    slug: "osmo-003-alt",
    name: "Halo alt",
    componentName: "OsmoButton003Alt",
    styleId: "osmo003-alt-styles",
    blurb:
      "Variant 2 of 6 from Eduard Bodak's 100 Buttons #003 — the alt theme swaps to a yellow fill with dark text and mirrored radii. Hover draws the dashed halo and rolls the label.",
    states: "default, hover, focus-visible, active, reduced motion",
    extraKeywords: ["yellow button", "secondary theme", "alt theme", "dark text"],
  },
  long: {
    label: "Long Button Label",
    slug: "osmo-003-long",
    name: "Halo long",
    componentName: "OsmoButton003Long",
    styleId: "osmo003-long-styles",
    blurb:
      "Variant 3 of 6 from Eduard Bodak's 100 Buttons #003 — the long-label version. Hover draws dashed halo lines around the arrow while the label rolls in on a circular arc.",
    states: "default, hover, focus-visible, active, reduced motion",
    extraKeywords: ["long label", "wide button", "long button label"],
  },
  "icon-circle": {
    label: "Button",
    flip: true,
    slug: "osmo-003-icon-circle",
    name: "Halo flip",
    componentName: "OsmoButton003IconCircle",
    styleId: "osmo003-icon-circle-styles",
    blurb:
      "Variant 4 of 6 from Eduard Bodak's 100 Buttons #003 — pill radii with the arrow on the right; the label rolls counterclockwise on hover while dashed halo lines draw around the icon.",
    states: "default, hover, focus-visible, active, reduced motion",
    extraKeywords: ["icon right", "pill button", "counterclockwise", "flipped"],
  },
  text: {
    label: "Button",
    pill: true,
    textOnly: true,
    slug: "osmo-003-text",
    name: "Halo text",
    componentName: "OsmoButton003Text",
    styleId: "osmo003-text-styles",
    blurb:
      "Variant 5 of 6 from Eduard Bodak's 100 Buttons #003 — a text-only pill. Hover rolls the label in on a circular arc; no JavaScript is needed for this one.",
    states: "default, hover, focus-visible, active, reduced motion",
    extraKeywords: ["text only", "pill", "css only", "no javascript", "no icon"],
  },
  icon: {
    label: "Button",
    pill: true,
    iconOnly: true,
    slug: "osmo-003-icon",
    name: "Halo icon",
    componentName: "OsmoButton003Icon",
    styleId: "osmo003-icon-styles",
    blurb:
      "Variant 6 of 6 from Eduard Bodak's 100 Buttons #003 — an icon-only pill. Hover draws the dashed halo lines and spins the arrow a full turn.",
    states: "default, hover, focus-visible, active, reduced motion",
    extraKeywords: ["icon only", "icon button", "spin", "circle lines", "accessible name"],
  },
};

function build(variantKey) {
  const v = VARIANTS[variantKey];
  const page = htmlPage(v, `Osmo button 003 — ${v.slug.replace("osmo-003-", "")}`);
  return {
    snippets: {
      html: page,
      react: reactSnippet({ ...v, title: v.name }),
      node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(page)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
    },
    meta: {
      id: v.slug,
      name: v.name,
      blurb: v.blurb,
      states: v.states,
      keywords: [
        "osmo button",
        "osmo button pack",
        "eduard bodak",
        "100 buttons",
        "003/100",
        v.name.toLowerCase(),
        ...v.extraKeywords,
        "circular lines",
        "dashed circle",
        "circle mask",
        "svg mask",
        "stroke dashoffset",
        "icon rotate",
        "circular text",
        "text swap",
        "arc label",
        "arrow icon",
        "animated button",
        "cta",
      ],
    },
  };
}

const DEFAULT_BUILT = build("default");
const ALT_BUILT = build("alt");
const LONG_BUILT = build("long");
const ICON_CIRCLE_BUILT = build("icon-circle");
const TEXT_BUILT = build("text");
const ICON_BUILT = build("icon");

export const OSMO_003_DEFAULT_SNIPPETS = DEFAULT_BUILT.snippets;
export const OSMO_003_DEFAULT_META = DEFAULT_BUILT.meta;
export const OSMO_003_ALT_SNIPPETS = ALT_BUILT.snippets;
export const OSMO_003_ALT_META = ALT_BUILT.meta;
export const OSMO_003_LONG_SNIPPETS = LONG_BUILT.snippets;
export const OSMO_003_LONG_META = LONG_BUILT.meta;
export const OSMO_003_ICON_CIRCLE_SNIPPETS = ICON_CIRCLE_BUILT.snippets;
export const OSMO_003_ICON_CIRCLE_META = ICON_CIRCLE_BUILT.meta;
export const OSMO_003_TEXT_SNIPPETS = TEXT_BUILT.snippets;
export const OSMO_003_TEXT_META = TEXT_BUILT.meta;
export const OSMO_003_ICON_SNIPPETS = ICON_BUILT.snippets;
export const OSMO_003_ICON_META = ICON_BUILT.meta;
