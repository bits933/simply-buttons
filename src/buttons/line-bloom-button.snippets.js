/* Line bloom button snippets — single self-contained button (default variant).
   Source: Osmo Button Pack #054 by Eduard Bodak — 2071521190477250933 */

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Line bloom button</title>
  <style>
    body { margin: 0; background: #fff; }
    ${CSS}
  </style>
</head>
<body>
  <div class="ob054-root">
    <button type="button" data-button-054="" class="button-054">
      <span class="button-054__default"><span class="button-054__text">Button</span><span class="button-054__bg is--default"></span></span><span aria-hidden="true" class="button-054__hover"><span class="button-054__hover-inner"><span class="button-054__text">Button</span><span class="button-054__bg is--hover"></span></span></span>
    </button>
  </div>
</html>
`;

export const LINE_BLOOM_SNIPPETS = {
  html: HTML_PAGE,
  react: "\"use client\";\n\n// Line bloom button \u2014 Osmo Button Pack #054 by Eduard Bodak\n// https://x.com/eduardbodak/status/2071521190477250933\n\nimport { useEffect } from \"react\";\n\nconst CSS = \"@font-face {\\n  font-family: \\\"Haffer\\\";\\n  src: url(\\\"https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b17558b_HafferRegular.ttf\\\") format(\\\"truetype\\\");\\n  font-weight: 400;\\n  font-style: normal;\\n  font-display: swap;\\n}\\n@font-face {\\n  font-family: \\\"Haffer\\\";\\n  src: url(\\\"https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b175594_HafferSemiBold.ttf\\\") format(\\\"truetype\\\");\\n  font-weight: 600;\\n  font-style: normal;\\n  font-display: swap;\\n}\\n.ob054-root {\\n\\n    --button-054-color: #131313;\\n    --button-054-color-background: #fff;\\n    --button-054-hover-color: #fff;\\n    --button-054-hover-color-background: #F67DEF;\\n    --button-054-color-focus: #000;\\n    --button-054-border-radius: 2.5em;\\n    --button-054-padding: 0.75em 1em;\\n    --button-054-focus-inset: -0.125em;\\n    --button-054-click-scale: 0.955 0.925;\\n    --button-054-ease-hover: cubic-bezier(0.675, 0.15, 0.1, 1);\\n    --button-054-ease-click: cubic-bezier(0.4, 0, 0.2, 1);\\n    --button-054-ease-focus: cubic-bezier(0.32, 0.72, 0, 1);\\n  \\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  min-height: 100vh;\\n  font-family: \\\"Haffer\\\", Arial, sans-serif;\\n  font-weight: 600;\\n  line-height: 1;\\n  font-size: calc(var(--size-font) * 1.5);\\n}\\n\\n.ob054-root *,\\n.ob054-root *::after,\\n.ob054-root *::before {\\n  box-sizing: border-box;\\n  -webkit-font-smoothing: antialiased;\\n}\\n\\n.ob054-root .button-054 {\\n    -webkit-tap-highlight-color: transparent;\\n    transition: scale 0.15s var(--button-054-ease-click);\\n  }\\n\\n\\n  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {.ob054-root .button-054:is(:hover, :focus-visible) .button-054__hover-inner,\\n.ob054-root [data-hover]:is(:hover, :focus-visible) .button-054 .button-054__hover-inner {\\n      clip-path: inset(0% 0% 0% 0%);\\n      transition: clip-path 0.25s 0.05s var(--button-054-ease-hover);\\n    }\\n.ob054-root .button-054:is(:hover, :focus-visible) .button-054__hover,\\n.ob054-root [data-hover]:is(:hover, :focus-visible) .button-054 .button-054__hover {\\n      clip-path: inset(0% 0% 0% 0%);\\n      transition: clip-path 0.4s 0.2s var(--button-054-ease-hover);\\n    }\\n\\n  }.ob054-root .button-054:is(:focus-visible)::after {\\n    box-shadow: 0 0 0 0.125em var(--button-054-color-focus);\\n  }\\n.ob054-root .button-054:active {\\n    scale: var(--button-054-click-scale);\\n  }\\n.ob054-root .button-054::after {\\n    content: '';\\n    display: block;\\n    position: absolute;\\n    inset: var(--button-054-focus-inset);\\n    border-radius: var(--button-054-border-radius);\\n    transition: box-shadow 0.3s var(--button-054-ease-focus);\\n    pointer-events: none;\\n    z-index: 1;\\n  }\\n.ob054-root .button-054__hover-inner {\\n    clip-path: inset(0% 100% 0% 0%);\\n    transition: clip-path 0.25s 0.25s var(--button-054-ease-hover);\\n  }\\n.ob054-root .button-054__hover {\\n    clip-path: inset(calc(50% - 0.0625em) 0% calc(50% - 0.0625em) 0%);\\n    transition: clip-path 0.35s var(--button-054-ease-hover);\\n  }\\n.ob054-root .button-054 { -webkit-user-select: none; user-select: none; background-color: #0000; outline-style: none; padding: 0; line-height: 1; text-decoration: none; display: inline-grid; position: relative; }\\n.ob054-root .button-054__default { pointer-events: none; width: 100%; height: 100%; color: var(--button-054-color); grid-area: 1 / 1; display: grid; }\\n.ob054-root .button-054__text { width: 100%; height: 100%; padding: var(--button-054-padding); z-index: 1; grid-area: 1 / 1; }\\n.ob054-root .button-054__bg { border-radius: var(--button-054-border-radius); grid-area: 1 / 1; place-self: center; width: calc(100% - 1px); height: calc(100% - 1px); padding: 0; }\\n.ob054-root .button-054__bg.is--default { background-color: var(--button-054-color-background); width: calc(100% - 2px); height: calc(100% - 2px); }\\n.ob054-root .button-054__bg.is--hover { background-color: var(--button-054-hover-color-background); }\\n.ob054-root .button-054__hover { pointer-events: none; width: 100%; height: 100%; color: var(--button-054-hover-color); z-index: 2; grid-area: 1 / 1; place-self: center; display: grid; }\\n.ob054-root .button-054__hover-inner { width: 100%; height: 100%; display: grid; }\\n\\n.ob054-root .button-054 { border: 0; cursor: pointer; font-family: inherit; font-size: inherit; }\\n\";\n\nexport default function LineBloomButton({ label = \"Button\" }) {\n  useEffect(() => {\n    if (document.getElementById(\"line-bloom-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"line-bloom-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n  return (\n    <div className=\"ob054-root\">\n      <button\n        type=\"button\"\n        data-button-054=\"\"\n        className=\"button-054\"\n      >\n        <span className=\"button-054__default\"><span className=\"button-054__text\">Button</span><span className=\"button-054__bg is--default\"></span></span><span aria-hidden=\"true\" className=\"button-054__hover\"><span className=\"button-054__hover-inner\"><span className=\"button-054__text\">Button</span><span className=\"button-054__bg is--hover\"></span></span></span>\n      </button>\n    </div>\n  );\n}\n",
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const LINE_BLOOM_META = {
  id: "line-bloom",
  name: "Line bloom button",
  blurb: "Variant of Eduard Bodak's 100 Buttons #054 \u2014 a pink fill blooms out of a hairline across the pill's middle while the white label wipes in inside it, as if behind a mask.",
  states: "default, hover, focus-visible, active, reduced motion",
  keywords: ["clip path reveal", "line reveal", "mask reveal", "pink button", "text wipe", "color reveal", "line grow", "osmo button pack", "eduard bodak", "100 buttons", "054/100", "button 054", "animated button", "interactive button", "hover effect", "hover animation", "css button", "button microinteraction", "ui animation", "cta"],
};
