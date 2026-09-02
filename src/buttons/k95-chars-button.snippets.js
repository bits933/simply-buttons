/* Frosted roll snippets — awwwards showcase harvest (trays 137-146).
   Source: k95.it's frosted nav pill.
   Specimen assembly for the Simply Buttons gallery. */

const CSS = "/* K95 chars button — k95.it's frosted nav menu pill (awwwards SOTD Aug 2026).\n   Radius-100px backdrop-blur glass pill; the label is per-character 1em-high\n   masked columns (MENU stacked over ×CLOSE) that roll translateY(-1em) in\n   0.35s cubic-bezier(0.4, 0, 0.2, 1) on toggle. The extra ×CLOSE phrase is\n   wider, so the button width is locked to the wide phrase via the invisible\n   ghost row, keeping the pill from jumping. Specimen for the Simply\n   Buttons gallery. */\n\n.k95-chars-root {\n  --aw-char-roll: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 1rem;\n  padding: 10px;\n  background: linear-gradient(135deg, #23282e 0%, #1a1e23 60%, #20242a 100%);\n  border-radius: 8px;\n}\n\n.btn-k95-chars {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  padding: 0.9em 1.9em;\n  border: 1px solid rgba(255, 255, 255, 0.14);\n  border-radius: 100px;\n  background: rgba(21, 25, 30, 0.55);\n  backdrop-filter: blur(10px);\n  -webkit-backdrop-filter: blur(10px);\n  color: #f3f5f7;\n  font-family: \"Inter\", \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 0.82rem;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.02em;\n  cursor: pointer;\n  overflow: hidden;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.btn-k95-chars,\n.btn-k95-chars * {\n  box-sizing: border-box;\n}\n\n.kc-chars {\n  display: inline-flex;\n  align-items: baseline;\n  white-space: nowrap;\n}\n\n/* Each column: 1em tall, overflow hidden, two stacked copies. */\n.kc-char {\n  display: inline-block;\n  height: 1em;\n  overflow: hidden;\n}\n\n.kc-stack {\n  display: block;\n  position: relative;\n  transition: transform 350ms cubic-bezier(0.4, 0, 0.2, 1);\n  transition-delay: calc(var(--i) * 18ms);\n  will-change: transform;\n}\n\n.kc-copy {\n  display: block;\n  height: 1em;\n  line-height: 1;\n}\n\n.kc-copy--alt {\n  position: absolute;\n  inset: 0;\n  top: 1em;\n  color: #c9cdff;\n}\n\n[data-phase=\"open\"] .kc-stack {\n  transform: translateY(-1em);\n}\n\n/* Width-lock ghost row: keeps the pill as wide as the longer phrase. */\n.kc-chars {\n  position: relative;\n}\n\n.btn-k95-chars:active {\n  transform: scale(0.97);\n}\n\n.btn-k95-chars:focus-visible {\n  outline: none;\n  border-color: rgba(255, 255, 255, 0.6);\n  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.22);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .kc-stack {\n    transition: none;\n    transition-delay: 0ms;\n  }\n  .btn-k95-chars:active {\n    transform: none;\n  }\n}\n";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Frosted roll button</title>
  <style>
${CSS}  </style>
</head>
<body>
<div class="k95-chars-root">
  <button type="button" class="btn-k95-chars" data-k95-chars="" data-phase="closed" aria-expanded="false" aria-label="Open menu">
    <span class="kc-chars" aria-hidden="true">
      <span class="kc-char" style="--i:0"><span class="kc-stack"><span class="kc-copy">M</span><span class="kc-copy kc-copy--alt">&times;</span></span></span>
      <span class="kc-char" style="--i:1"><span class="kc-stack"><span class="kc-copy">e</span><span class="kc-copy kc-copy--alt">C</span></span></span>
      <span class="kc-char" style="--i:2"><span class="kc-stack"><span class="kc-copy">n</span><span class="kc-copy kc-copy--alt">l</span></span></span>
      <span class="kc-char" style="--i:3"><span class="kc-stack"><span class="kc-copy">u</span><span class="kc-copy kc-copy--alt">o</span></span></span>
      <span class="kc-char" style="--i:4"><span class="kc-stack"><span class="kc-copy">&nbsp;</span><span class="kc-copy kc-copy--alt">s</span></span></span>
      <span class="kc-char" style="--i:5"><span class="kc-stack"><span class="kc-copy">&nbsp;</span><span class="kc-copy kc-copy--alt">e</span></span></span>
    </span>
  </button>
</div>
<script>
(function () {
  document.querySelectorAll("[data-k95-chars]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("data-phase") === "open";
      btn.setAttribute("data-phase", open ? "closed" : "open");
      btn.setAttribute("aria-expanded", String(!open));
      btn.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    });
  });
})();
</script>

</body>
</html>`;

const REACT = "\"use client\";\n\n// K95 chars button — k95.it's frosted nav pill rebuilt: per-character\n// masked columns roll 1em up on click, swapping MENU for xCLOSE.\n\nimport { useEffect, useState } from \"react\";\n\nconst CSS = \"/* K95 chars button — k95.it's frosted nav menu pill (awwwards SOTD Aug 2026).\\n   Radius-100px backdrop-blur glass pill; the label is per-character 1em-high\\n   masked columns (MENU stacked over ×CLOSE) that roll translateY(-1em) in\\n   0.35s cubic-bezier(0.4, 0, 0.2, 1) on toggle. The extra ×CLOSE phrase is\\n   wider, so the button width is locked to the wide phrase via the invisible\\n   ghost row, keeping the pill from jumping. Specimen for the Simply\\n   Buttons gallery. */\\n\\n.k95-chars-root {\\n  --aw-char-roll: 1;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  height: 100%;\\n  font-size: 1rem;\\n  padding: 10px;\\n  background: linear-gradient(135deg, #23282e 0%, #1a1e23 60%, #20242a 100%);\\n  border-radius: 8px;\\n}\\n\\n.btn-k95-chars {\\n  position: relative;\\n  display: inline-flex;\\n  align-items: center;\\n  justify-content: center;\\n  box-sizing: border-box;\\n  padding: 0.9em 1.9em;\\n  border: 1px solid rgba(255, 255, 255, 0.14);\\n  border-radius: 100px;\\n  background: rgba(21, 25, 30, 0.55);\\n  backdrop-filter: blur(10px);\\n  -webkit-backdrop-filter: blur(10px);\\n  color: #f3f5f7;\\n  font-family: \\\"Inter\\\", \\\"Helvetica Neue\\\", Arial, sans-serif;\\n  font-size: 0.82rem;\\n  font-weight: 500;\\n  line-height: 1;\\n  letter-spacing: 0.02em;\\n  cursor: pointer;\\n  overflow: hidden;\\n  -webkit-tap-highlight-color: transparent;\\n}\\n\\n.btn-k95-chars,\\n.btn-k95-chars * {\\n  box-sizing: border-box;\\n}\\n\\n.kc-chars {\\n  display: inline-flex;\\n  align-items: baseline;\\n  white-space: nowrap;\\n}\\n\\n/* Each column: 1em tall, overflow hidden, two stacked copies. */\\n.kc-char {\\n  display: inline-block;\\n  height: 1em;\\n  overflow: hidden;\\n}\\n\\n.kc-stack {\\n  display: block;\\n  position: relative;\\n  transition: transform 350ms cubic-bezier(0.4, 0, 0.2, 1);\\n  transition-delay: calc(var(--i) * 18ms);\\n  will-change: transform;\\n}\\n\\n.kc-copy {\\n  display: block;\\n  height: 1em;\\n  line-height: 1;\\n}\\n\\n.kc-copy--alt {\\n  position: absolute;\\n  inset: 0;\\n  top: 1em;\\n  color: #c9cdff;\\n}\\n\\n[data-phase=\\\"open\\\"] .kc-stack {\\n  transform: translateY(-1em);\\n}\\n\\n/* Width-lock ghost row: keeps the pill as wide as the longer phrase. */\\n.kc-chars {\\n  position: relative;\\n}\\n\\n.btn-k95-chars:active {\\n  transform: scale(0.97);\\n}\\n\\n.btn-k95-chars:focus-visible {\\n  outline: none;\\n  border-color: rgba(255, 255, 255, 0.6);\\n  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.22);\\n}\\n\\n@media (prefers-reduced-motion: reduce) {\\n  .kc-stack {\\n    transition: none;\\n    transition-delay: 0ms;\\n  }\\n  .btn-k95-chars:active {\\n    transform: none;\\n  }\\n}\\n\";\n\nexport default function K95CharsButton() {\n  const [phase, setPhase] = useState(\"closed\");\n\n  useEffect(() => {\n    if (document.getElementById(\"k95-chars-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"k95-chars-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n\n  const label = \"Menu\";\n  const altLabel = \"\\u00D7Close\";\n  const columns = (altLabel.length >= label.length ? altLabel : label).split(\"\");\n\n  return (\n    <button\n      type=\"button\"\n      data-k95-chars=\"\"\n      data-phase={phase}\n      aria-expanded={phase === \"open\"}\n      aria-label={phase === \"open\" ? \"Close menu\" : \"Open menu\"}\n      className=\"btn-k95-chars\"\n      onClick={() => setPhase((p) => (p === \"open\" ? \"closed\" : \"open\"))}\n    >\n      <span className=\"kc-chars\" aria-hidden=\"true\">\n        {columns.map((ch, i) => (\n          <span className=\"kc-char\" key={i} style={{ \"--i\": i }}>\n            <span className=\"kc-stack\">\n              <span className=\"kc-copy\">{label[i] === undefined || label[i] === \" \" ? \"\\u00A0\" : label[i]}</span>\n              <span className=\"kc-copy kc-copy--alt\">{ch === \" \" ? \"\\u00A0\" : ch}</span>\n            </span>\n          </span>\n        ))}\n      </span>\n    </button>\n  );\n}\n";

export const K95_CHARS_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const K95_CHARS_META = {
  id: "aw-k95-chars",
  name: "Frosted roll",
  blurb: "k95.it's frosted nav pill rebuilt (SOTD Aug 2026): a backdrop-blur glass pill whose label is per-character 1em masked columns; clicking rolls every character up by 1em, swapping MENU for ×CLOSE with a per-letter stagger.",
  states: "default, hover (border brighten), click toggle (char roll menu/close), focus-visible, active press, reduced motion",
  keywords: ["frosted roll","k95","studio k95","glass pill","frosted glass","backdrop blur","char roll","per character","letter roll","masked text","menu close","menu button","toggle pill","stagger letters","awwwards","site of the day","animated button","interactive button","css button","hover effect"],
};
