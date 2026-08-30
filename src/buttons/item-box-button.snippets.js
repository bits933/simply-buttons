/* Item box button snippets — single self-contained button (default variant).
   Source: Osmo Button Pack #068 by Eduard Bodak — 2076609720001941607 */

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Item box button</title>
  <style>
    body { margin: 0; background: #fff; }
    ${CSS}
  </style>
</head>
<body>
  <div class="ob068-root">
    <button type="button" data-button-068="" class="button-068">
      <span class="button-068__inner"><span class="button-068__text is--first">Button</span><span aria-hidden="true" class="button-068__text is--second">Button</span><span aria-hidden="true" class="button-068__text is--third">Button</span></span>
    </button>
  </div>
</html>
`;

export const ITEM_BOX_SNIPPETS = {
  html: HTML_PAGE,
  react: "\"use client\";\n\n// Item box button \u2014 Osmo Button Pack #068 by Eduard Bodak\n// https://x.com/eduardbodak/status/2076609720001941607\n\nimport { useEffect } from \"react\";\n\nconst CSS = \"@font-face {\\n  font-family: \\\"Haffer\\\";\\n  src: url(\\\"https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b17558b_HafferRegular.ttf\\\") format(\\\"truetype\\\");\\n  font-weight: 400;\\n  font-style: normal;\\n  font-display: swap;\\n}\\n@font-face {\\n  font-family: \\\"Haffer\\\";\\n  src: url(\\\"https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b175594_HafferSemiBold.ttf\\\") format(\\\"truetype\\\");\\n  font-weight: 600;\\n  font-style: normal;\\n  font-display: swap;\\n}\\n.ob068-root {\\n\\n    --button-068-color: #131313;\\n    --button-068-color-background: #fff;\\n    --button-068-color-focus: #000;\\n    --button-068-padding: 0.75em;\\n    --button-068-height: calc(1lh + 0.75em + 0.75em);\\n    --button-068-border-radius: 0.25em;\\n    --button-068-focus-inset: -0.25em -0.375em;\\n    --button-068-target-area-inset: -0.25em;\\n    --button-068-ease-hover: cubic-bezier(0.18, 1.4, 0.36, 0.96);\\n    --button-068-ease-focus: cubic-bezier(0.32, 0.72, 0, 1);\\n  \\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  min-height: 100vh;\\n  font-family: \\\"Haffer\\\", Arial, sans-serif;\\n  font-weight: 600;\\n  line-height: 1;\\n  font-size: calc(var(--size-font) * 1.5);\\n}\\n\\n.ob068-root *,\\n.ob068-root *::after,\\n.ob068-root *::before {\\n  box-sizing: border-box;\\n  -webkit-font-smoothing: antialiased;\\n}\\n\\n.ob068-root .button-068 {\\n    -webkit-tap-highlight-color: transparent;\\n  }\\n\\n\\n  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {.ob068-root .button-068:is(:hover, :focus-visible) .button-068__inner,\\n.ob068-root [data-hover]:is(:hover, :focus-visible) .button-068 .button-068__inner {\\n      transform: rotateX(180deg);\\n      transition-delay: 0.05s;\\n    }\\n\\n  }.ob068-root .button-068:is(:focus-visible)::after {\\n    box-shadow: 0 0 0 0.125em var(--button-068-color-focus);\\n  }\\n.ob068-root .button-068::after {\\n    content: '';\\n    display: block;\\n    position: absolute;\\n    inset: var(--button-068-focus-inset);\\n    border-radius: var(--button-068-border-radius);\\n    transition: box-shadow 0.3s var(--button-068-ease-focus);\\n    pointer-events: none;\\n    z-index: 1;\\n  }\\n.ob068-root .button-068::before {\\n    content: '';\\n    display: block;\\n    position: absolute;\\n    inset: var(--button-068-target-area-inset);\\n    z-index: 1;\\n  }\\n.ob068-root .button-068__inner {\\n    transform: rotateX(0deg);\\n    transition: transform 0.8s var(--button-068-ease-hover);\\n  }\\n.ob068-root .button-068__text.is--first {\\n    transform: translateZ(calc(var(--button-068-height) * 0.525));\\n  }\\n.ob068-root .button-068__text.is--second {\\n    transform: rotateX(-90deg) translateZ(calc(var(--button-068-height) * 0.525));\\n  }\\n.ob068-root .button-068__text.is--third {\\n    transform: rotateX(-180deg) translateZ(calc(var(--button-068-height) * 0.525));\\n  }\\n.ob068-root .button-068 { perspective: 40rem; color: var(--button-068-color); -webkit-user-select: none; user-select: none; background-color: #0000; outline-style: none; padding: 0; line-height: 1; text-decoration: none; display: inline-grid; position: relative; }\\n.ob068-root .button-068__inner { pointer-events: none; transform-style: preserve-3d; grid-area: 1 / 1; display: grid; }\\n.ob068-root .button-068__text { backface-visibility: hidden; width: 100%; height: 100%; padding: var(--button-068-padding); background-color: var(--button-068-color-background); border-radius: var(--button-068-border-radius); grid-area: 1 / 1; }\\n\\n.ob068-root .button-068 { border: 0; cursor: pointer; font-family: inherit; font-size: inherit; }\\n\";\n\nexport default function ItemBoxButton({ label = \"Button\" }) {\n  useEffect(() => {\n    if (document.getElementById(\"item-box-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"item-box-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n  return (\n    <div className=\"ob068-root\">\n      <button\n        type=\"button\"\n        data-button-068=\"\"\n        className=\"button-068\"\n      >\n        <span className=\"button-068__inner\"><span className=\"button-068__text is--first\">Button</span><span aria-hidden=\"true\" className=\"button-068__text is--second\">Button</span><span aria-hidden=\"true\" className=\"button-068__text is--third\">Button</span></span>\n      </button>\n    </div>\n  );\n}\n",
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const ITEM_BOX_META = {
  id: "item-box",
  name: "Item box button",
  blurb: "Variant of Eduard Bodak's 100 Buttons #068 \u2014 a Mario Kart style item box: three stacked faces rotate in 3D so the label tumbles to the next side with a springy settle.",
  states: "default, hover, focus-visible, active, reduced motion",
  keywords: ["3d flip", "rotatex", "mario kart", "item box", "cube rotation", "3d button", "preserve-3d", "osmo button pack", "eduard bodak", "100 buttons", "068/100", "button 068", "animated button", "interactive button", "hover effect", "hover animation", "css button", "button microinteraction", "ui animation", "cta"],
};
