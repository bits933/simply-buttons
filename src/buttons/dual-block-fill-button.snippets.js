/* Dual block fill button snippets — single self-contained button (default variant).
   Source: Osmo Button Pack #076 by Eduard Bodak — 2079478198736204003 */

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dual block fill button</title>
  <style>
    body { margin: 0; background: #fff; }
    ${CSS}
  </style>
</head>
<body>
  <div class="ob076-root">
    <button type="button" data-button-076="" class="button-076">
      <span class="button-076__hover"><span class="button-076__bg is--hover"></span><span class="button-076__inner"><span class="button-076__text">Button</span></span></span><span aria-hidden="true" class="button-076__default"><span class="button-076__bg is--default"></span><span class="button-076__inner"><span class="button-076__text">Button</span></span></span>
    </button>
  </div>
</html>
`;

export const DUAL_BLOCK_FILL_SNIPPETS = {
  html: HTML_PAGE,
  react: "\"use client\";\n\n// Dual block fill button \u2014 Osmo Button Pack #076 by Eduard Bodak\n// https://x.com/eduardbodak/status/2079478198736204003\n\nimport { useEffect } from \"react\";\n\nconst CSS = \"@font-face {\\n  font-family: \\\"Haffer\\\";\\n  src: url(\\\"https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b17558b_HafferRegular.ttf\\\") format(\\\"truetype\\\");\\n  font-weight: 400;\\n  font-style: normal;\\n  font-display: swap;\\n}\\n@font-face {\\n  font-family: \\\"Haffer\\\";\\n  src: url(\\\"https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b175594_HafferSemiBold.ttf\\\") format(\\\"truetype\\\");\\n  font-weight: 600;\\n  font-style: normal;\\n  font-display: swap;\\n}\\n.ob076-root {\\n\\n    --button-076-color: #131313;\\n    --button-076-color-background: #fff;\\n    --button-076-hover-color: #fff;\\n    --button-076-hover-color-background: #404052;\\n    --button-076-color-focus: #131313;\\n    --button-076-border-radius: 2.5em;\\n    --button-076-padding: 0.75em 1em;\\n    --button-076-gap: 0.125em;\\n    --button-076-focus-inset: -0.125em;\\n    --button-076-hover-scale: 1.065 1.095;\\n    --button-076-click-scale: 0.955 0.925;\\n    --button-076-ease-hover: cubic-bezier(0.4, 0.15, 0, 1);\\n    --button-076-ease-click: cubic-bezier(0.4, 0, 0.2, 1);\\n    --button-076-ease-focus: cubic-bezier(0.32, 0.72, 0, 1);\\n  \\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  min-height: 100vh;\\n  font-family: \\\"Haffer\\\", Arial, sans-serif;\\n  font-weight: 600;\\n  line-height: 1;\\n  font-size: calc(var(--size-font) * 1.5);\\n}\\n\\n.ob076-root *,\\n.ob076-root *::after,\\n.ob076-root *::before {\\n  box-sizing: border-box;\\n  -webkit-font-smoothing: antialiased;\\n}\\n\\n.ob076-root .button-076 {\\n    -webkit-tap-highlight-color: transparent;\\n    transition:\\n      scale 0.45s var(--button-076-ease-hover),\\n      transform 0.15s var(--button-076-ease-click);\\n  }\\n\\n\\n  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {.ob076-root .button-076:is(:hover, :focus-visible),\\n.ob076-root [data-hover]:is(:hover, :focus-visible) .button-076 {\\n      scale: var(--button-076-hover-scale);\\n    }\\n.ob076-root .button-076:is(:hover, :focus-visible) .button-076__hover,\\n.ob076-root [data-hover]:is(:hover, :focus-visible) .button-076 .button-076__hover {\\n      clip-path: polygon(50% 0%, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 100%, 0% 100%, 0 0%);\\n      transition-delay: 0.05s;\\n    }\\n\\n  }.ob076-root .button-076:active {\\n    scale: var(--button-076-click-scale);\\n  }\\n.ob076-root .button-076:is(:focus-visible)::after {\\n    box-shadow: 0 0 0 0.125em var(--button-076-color-focus);\\n  }\\n.ob076-root .button-076::after {\\n    content: '';\\n    display: block;\\n    position: absolute;\\n    inset: var(--button-076-focus-inset);\\n    border-radius: var(--button-076-border-radius);\\n    transition: box-shadow 0.3s var(--button-076-ease-focus);\\n    pointer-events: none;\\n    z-index: 1;\\n  }\\n.ob076-root .button-076__hover {\\n    clip-path: polygon(50% 100%, 50% 0%, 100% 0%, 100% 0%, 50% 0%, 50% 100%, 0% 100%, 0 100%);\\n    transition: clip-path 0.55s var(--button-076-ease-hover);\\n  }\\n.ob076-root .button-076 { -webkit-user-select: none; user-select: none; background-color: #0000; outline-style: none; padding: 0; line-height: 1; text-decoration: none; display: inline-grid; position: relative; }\\n.ob076-root .button-076__hover { width: 100%; height: 100%; color: var(--button-076-hover-color); z-index: 1; grid-area: 1 / 1; display: grid; }\\n.ob076-root .button-076__bg { border-radius: var(--button-076-border-radius); grid-area: 1 / 1; width: 100%; height: 100%; padding: 0; }\\n.ob076-root .button-076__bg.is--hover { background-color: var(--button-076-hover-color-background); }\\n.ob076-root .button-076__bg.is--default { background-color: var(--button-076-color-background); width: calc(100% - 1px); height: calc(100% - 1px); }\\n.ob076-root .button-076__inner { width: 100%; height: 100%; padding: var(--button-076-padding); grid-column-gap: var(--button-076-gap); grid-row-gap: var(--button-076-gap); grid-area: 1 / 1; justify-content: center; align-items: center; display: flex; }\\n.ob076-root .button-076__default { width: 100%; height: 100%; color: var(--button-076-color); grid-area: 1 / 1; display: grid; }\\n.ob076-root .button-076__icon { flex: none; width: .75em; height: .75em; }\\n\\n.ob076-root .button-076 { border: 0; cursor: pointer; font-family: inherit; font-size: inherit; }\\n\";\n\nexport default function DualBlockFillButton({ label = \"Button\" }) {\n  useEffect(() => {\n    if (document.getElementById(\"dual-block-fill-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"dual-block-fill-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n  return (\n    <div className=\"ob076-root\">\n      <button\n        type=\"button\"\n        data-button-076=\"\"\n        className=\"button-076\"\n      >\n        <span className=\"button-076__hover\"><span className=\"button-076__bg is--hover\"></span><span className=\"button-076__inner\"><span className=\"button-076__text\">Button</span></span></span><span aria-hidden=\"true\" className=\"button-076__default\"><span className=\"button-076__bg is--default\"></span><span className=\"button-076__inner\"><span className=\"button-076__text\">Button</span></span></span>\n      </button>\n    </div>\n  );\n}\n",
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const DUAL_BLOCK_FILL_META = {
  id: "dual-block-fill",
  name: "Dual block fill button",
  blurb: "Variant of Eduard Bodak's 100 Buttons #076 \u2014 two dark blocks expand from the top and bottom edges and meet in the middle, filling the pill like a page transition.",
  states: "default, hover, focus-visible, active, reduced motion",
  keywords: ["block reveal", "clip path polygon", "page transition", "dual wipe", "expanding blocks", "two block fill", "osmo button pack", "eduard bodak", "100 buttons", "076/100", "button 076", "animated button", "interactive button", "hover effect", "hover animation", "css button", "button microinteraction", "ui animation", "cta"],
};
