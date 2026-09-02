/* Donut CTA button snippets — donut-studio.com's primary pill CTA, rebuilt
   with a pink flood fill. Pure CSS interaction; the page needs no script.
   Specimen for the Simply Buttons gallery. */

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Donut studio CTA button</title>
  <style>
    body { margin: 0; background: #0c0c0c; min-height: 100vh; display: grid; place-items: center; }
    /* Donut CTA — a rebuild of donut-studio.com's primary pill CTA: a transparent,
   fully-rounded pill with a 2px electric-yellow border and bold uppercase
   Helvetica letters. On hover a hot-pink flood rises from the bottom edge and
   fills the pill while each letter rolls up (staggered) to a near-black copy
   that stays readable on the pink. The interaction is pure CSS — hover and
   keyboard focus both drive it — and the roll is the site's own rolling-text
   mechanic. Specimen for the Simply Buttons gallery. */

.donut-cta-root {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 1.3rem;
}

.btn-donut-cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 2.15em;
  padding: 0.5em 0.85em;
  border: 2px solid #faff18;
  border-radius: 999px;
  background: none;
  overflow: hidden;
  cursor: pointer;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 700;
  font-size: 1em;
  letter-spacing: -0.012em;
  line-height: 1.05em;
  text-transform: uppercase;
  transition: scale 100ms ease-out;
  -webkit-tap-highlight-color: transparent;
}

.btn-donut-cta:active {
  scale: 0.97;
}

.btn-donut-cta:focus-visible {
  outline: 2px dotted #faff18;
  outline-offset: 4px;
}

/* The pink flood — rests collapsed at the bottom edge, rises to fill on hover
   and keyboard focus, retreats with a softer curve on leave. */
.dc-fill {
  position: absolute;
  inset: 0;
  background: #fc4ba7;
  border-radius: inherit;
  transform: scaleY(0);
  transform-origin: bottom center;
  transition: transform 320ms cubic-bezier(0.55, 0, 0.6, 1);
}

.btn-donut-cta:hover .dc-fill,
.btn-donut-cta:focus-visible .dc-fill {
  transform: scaleY(1);
  transition: transform 420ms cubic-bezier(0.3, 1.1, 0.5, 1);
}

/* Rolling letters — each letter is a clip box around a two-copy stack; the
   visible copy is electric yellow, the copy that rolls in is near-black so it
   reads on the pink flood. Stagger runs left to right on hover. */
.dc-label {
  position: relative;
  z-index: 1;
  display: inline-flex;
}

.dc-letter {
  display: inline-block;
  height: 1.05em;
  overflow: hidden;
}

.dc-letter__stack {
  display: flex;
  flex-direction: column;
  transform: translateY(0);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-donut-cta:hover .dc-letter__stack,
.btn-donut-cta:focus-visible .dc-letter__stack {
  transform: translateY(-50%);
  transition-delay: calc(var(--i) * 24ms);
}

.dc-letter__copy {
  display: block;
  height: 1.05em;
  color: #faff18;
}

.dc-letter__copy--alt {
  color: #131313;
}

@media (prefers-reduced-motion: reduce) {
  .btn-donut-cta {
    transition: none;
  }
  .dc-fill {
    transform: none;
    opacity: 0;
    transition: opacity 240ms ease;
  }
  .btn-donut-cta:hover .dc-fill,
  .btn-donut-cta:focus-visible .dc-fill {
    opacity: 1;
  }
  .dc-letter__stack {
    transition: none;
  }
}

  </style>
</head>
<body>
  <div class="donut-cta-root">
    <button type="button" data-donut-cta="" aria-label="Contact" class="btn-donut-cta">
      <span class="dc-fill" aria-hidden="true"></span>
      <span class="dc-label" aria-hidden="true">
        <span class="dc-letter" style="--i:0"><span class="dc-letter__stack"><span class="dc-letter__copy">C</span><span class="dc-letter__copy dc-letter__copy--alt">C</span></span></span>
        <span class="dc-letter" style="--i:1"><span class="dc-letter__stack"><span class="dc-letter__copy">o</span><span class="dc-letter__copy dc-letter__copy--alt">o</span></span></span>
        <span class="dc-letter" style="--i:2"><span class="dc-letter__stack"><span class="dc-letter__copy">n</span><span class="dc-letter__copy dc-letter__copy--alt">n</span></span></span>
        <span class="dc-letter" style="--i:3"><span class="dc-letter__stack"><span class="dc-letter__copy">t</span><span class="dc-letter__copy dc-letter__copy--alt">t</span></span></span>
        <span class="dc-letter" style="--i:4"><span class="dc-letter__stack"><span class="dc-letter__copy">a</span><span class="dc-letter__copy dc-letter__copy--alt">a</span></span></span>
        <span class="dc-letter" style="--i:5"><span class="dc-letter__stack"><span class="dc-letter__copy">c</span><span class="dc-letter__copy dc-letter__copy--alt">c</span></span></span>
        <span class="dc-letter" style="--i:6"><span class="dc-letter__stack"><span class="dc-letter__copy">t</span><span class="dc-letter__copy dc-letter__copy--alt">t</span></span></span>
      </span>
    </button>
  </div>
</body>
</html>
`;

export const DONUT_CTA_SNIPPETS = {
  html: HTML_PAGE,
  react: "\"use client\";\n\n// Donut CTA \u2014 donut-studio.com's primary pill CTA, rebuilt with a pink flood fill.\n// Pure CSS interaction: hover or keyboard focus floods the pill and rolls the letters.\n\nimport \"./donut-cta-button.css\";\n\nexport default function DonutCtaButton() {\n  const letters = \"Contact\".split(\"\");\n  return (\n    <button\n      type=\"button\"\n      data-donut-cta=\"\"\n      aria-label=\"Contact\"\n      className=\"btn-donut-cta\"\n    >\n      <span className=\"dc-fill\" aria-hidden=\"true\" />\n      <span className=\"dc-label\" aria-hidden=\"true\">\n        {letters.map((ch, i) => (\n          <span className=\"dc-letter\" key={i} style={{ \"--i\": i }}>\n            <span className=\"dc-letter__stack\">\n              <span className=\"dc-letter__copy\">{ch === \" \" ? \"\\u00A0\" : ch}</span>\n              <span className=\"dc-letter__copy dc-letter__copy--alt\">{ch === \" \" ? \"\\u00A0\" : ch}</span>\n            </span>\n          </span>\n        ))}\n      </span>\n    </button>\n  );\n}\n",
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const DONUT_CTA_META = {
  id: "donut-cta",
  name: "Funky reveal",
  blurb: "The donut-studio.com primary CTA rebuilt: a transparent pill with a 2px electric-yellow border and bold uppercase letters that floods bottom-up with hot pink on hover while each letter rolls to a near-black copy that stays readable on the fill.",
  states: "default, hover (pink flood + letter roll), focus-visible, active press, reduced motion",
  keywords: ["funky reveal", "donut cta", "donut studio", "pink cta", "pink fill", "pill button", "rounded pill", "yellow border", "electric yellow", "helvetica", "uppercase", "bold cta", "rolling text", "letter roll", "stagger letters", "fill rise", "bottom up fill", "hover fill", "scaley fill", "framer style", "playful", "creative studio", "pure css", "animated button", "interactive button", "css button", "hover effect", "press animation"],
};
