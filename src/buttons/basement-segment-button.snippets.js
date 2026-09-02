/* Segment flip snippets — awwwards showcase harvest (trays 137-146).
   Source: basement.studio's HUMAN/MACHINE pill.
   Specimen assembly for the Simply Buttons gallery. */

const CSS = "/* Basement segment button — basement.studio's HUMAN/MACHINE pill switch\n   (awwwards SOTD + Developer Award Apr 2025). An uppercase segmented pill:\n   the active option's ink flips white→orange (hover states invert too) and\n   a sliding indicator pill glides behind the active option in 0.42s\n   cubic-bezier(0.22, 1, 0.36, 1) — the K95 layout-switch easing family.\n   Specimen for the Simply Buttons gallery. */\n\n.basement-segment-root {\n  --aw-segment-flip: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 1rem;\n  padding: 10px;\n  background: #0a0a0a;\n  border-radius: 8px;\n}\n\n.btn-basement-segment {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  padding: 4px;\n  border-radius: 999px;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n}\n\n.btn-basement-segment,\n.btn-basement-segment * {\n  box-sizing: border-box;\n}\n\n.bs-option {\n  position: relative;\n  z-index: 1;\n  padding: 0.5em 1.2em;\n  border: 0;\n  background: none;\n  color: rgba(255, 255, 255, 0.55);\n  font-family: \"Inter\", \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 0.72rem;\n  font-weight: 600;\n  letter-spacing: 0.08em;\n  text-transform: uppercase;\n  line-height: 1;\n  cursor: pointer;\n  border-radius: 999px;\n  transition: color 420ms cubic-bezier(0.22, 1, 0.36, 1);\n  -webkit-tap-highlight-color: transparent;\n}\n\n.bs-option:hover {\n  color: #ffffff;\n}\n\n.bs-option.is-active {\n  color: #ff4d00;\n}\n\n.bs-option:focus-visible {\n  outline: 2px dashed rgba(255, 255, 255, 0.7);\n  outline-offset: 3px;\n}\n\n/* The indicator glides between slots; width is 1/count of the track. */\n.bs-indicator {\n  position: absolute;\n  top: 4px;\n  bottom: 4px;\n  left: 4px;\n  width: calc((100% - 8px) / var(--count));\n  border-radius: 999px;\n  background: #ffffff;\n  transform: translateX(calc(var(--active) * 100%));\n  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);\n  will-change: transform;\n}\n\n[data-active=\"1\"] .bs-option.is-active {\n  color: #0a0a0a;\n}\n\n[data-active=\"1\"] .bs-indicator {\n  background: #ff4d00;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .bs-indicator,\n  .bs-option {\n    transition: none;\n  }\n}\n";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Segment flip button</title>
  <style>
${CSS}  </style>
</head>
<body>
<div class="basement-segment-root">
  <div class="btn-basement-segment" role="group" aria-label="Mode" data-basement-segment="" data-active="0">
    <button type="button" class="bs-option is-active" aria-pressed="true">Human</button>
    <button type="button" class="bs-option" aria-pressed="false">Machine</button>
    <span class="bs-indicator" style="--count:2; --active:0" aria-hidden="true"></span>
  </div>
</div>
<script>
(function () {
  document.querySelectorAll("[data-basement-segment]").forEach(function (group) {
    var options = Array.prototype.slice.call(group.querySelectorAll(".bs-option"));
    var indicator = group.querySelector(".bs-indicator");
    function select(i) {
      options.forEach(function (btn, k) {
        var on = k === i;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", String(on));
      });
      group.setAttribute("data-active", String(i));
      if (indicator) indicator.style.setProperty("--active", String(i));
    }
    options.forEach(function (btn, i) {
      btn.addEventListener("click", function () { select(i); });
    });
  });
})();
</script>

</body>
</html>`;

const REACT = "\"use client\";\n\n// Basement segment button — basement.studio's HUMAN/MACHINE pill rebuilt:\n// the indicator glides behind the active option while its ink flips.\n\nimport { useEffect, useState } from \"react\";\n\nconst CSS = \"/* Basement segment button — basement.studio's HUMAN/MACHINE pill switch\\n   (awwwards SOTD + Developer Award Apr 2025). An uppercase segmented pill:\\n   the active option's ink flips white→orange (hover states invert too) and\\n   a sliding indicator pill glides behind the active option in 0.42s\\n   cubic-bezier(0.22, 1, 0.36, 1) — the K95 layout-switch easing family.\\n   Specimen for the Simply Buttons gallery. */\\n\\n.basement-segment-root {\\n  --aw-segment-flip: 1;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  height: 100%;\\n  font-size: 1rem;\\n  padding: 10px;\\n  background: #0a0a0a;\\n  border-radius: 8px;\\n}\\n\\n.btn-basement-segment {\\n  position: relative;\\n  display: inline-flex;\\n  align-items: center;\\n  padding: 4px;\\n  border-radius: 999px;\\n  background: rgba(255, 255, 255, 0.08);\\n  border: 1px solid rgba(255, 255, 255, 0.12);\\n}\\n\\n.btn-basement-segment,\\n.btn-basement-segment * {\\n  box-sizing: border-box;\\n}\\n\\n.bs-option {\\n  position: relative;\\n  z-index: 1;\\n  padding: 0.5em 1.2em;\\n  border: 0;\\n  background: none;\\n  color: rgba(255, 255, 255, 0.55);\\n  font-family: \\\"Inter\\\", \\\"Helvetica Neue\\\", Arial, sans-serif;\\n  font-size: 0.72rem;\\n  font-weight: 600;\\n  letter-spacing: 0.08em;\\n  text-transform: uppercase;\\n  line-height: 1;\\n  cursor: pointer;\\n  border-radius: 999px;\\n  transition: color 420ms cubic-bezier(0.22, 1, 0.36, 1);\\n  -webkit-tap-highlight-color: transparent;\\n}\\n\\n.bs-option:hover {\\n  color: #ffffff;\\n}\\n\\n.bs-option.is-active {\\n  color: #ff4d00;\\n}\\n\\n.bs-option:focus-visible {\\n  outline: 2px dashed rgba(255, 255, 255, 0.7);\\n  outline-offset: 3px;\\n}\\n\\n/* The indicator glides between slots; width is 1/count of the track. */\\n.bs-indicator {\\n  position: absolute;\\n  top: 4px;\\n  bottom: 4px;\\n  left: 4px;\\n  width: calc((100% - 8px) / var(--count));\\n  border-radius: 999px;\\n  background: #ffffff;\\n  transform: translateX(calc(var(--active) * 100%));\\n  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);\\n  will-change: transform;\\n}\\n\\n[data-active=\\\"1\\\"] .bs-option.is-active {\\n  color: #0a0a0a;\\n}\\n\\n[data-active=\\\"1\\\"] .bs-indicator {\\n  background: #ff4d00;\\n}\\n\\n@media (prefers-reduced-motion: reduce) {\\n  .bs-indicator,\\n  .bs-option {\\n    transition: none;\\n  }\\n}\\n\";\n\nconst OPTIONS = [\"Human\", \"Machine\"];\n\nexport default function BasementSegmentButton() {\n  const [active, setActive] = useState(0);\n\n  useEffect(() => {\n    if (document.getElementById(\"basement-segment-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"basement-segment-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n\n  return (\n    <div\n      className=\"btn-basement-segment\"\n      role=\"group\"\n      aria-label=\"Mode\"\n      data-basement-segment=\"\"\n      data-active={active}\n    >\n      {OPTIONS.map((option, i) => (\n        <button\n          key={option}\n          type=\"button\"\n          className={i === active ? \"bs-option is-active\" : \"bs-option\"}\n          aria-pressed={i === active}\n          onClick={() => setActive(i)}\n        >\n          {option}\n        </button>\n      ))}\n      <span\n        className=\"bs-indicator\"\n        style={{ \"--count\": OPTIONS.length, \"--active\": active }}\n        aria-hidden=\"true\"\n      />\n    </div>\n  );\n}\n";

export const BASEMENT_SEGMENT_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const BASEMENT_SEGMENT_META = {
  id: "aw-basement-segment",
  name: "Segment flip",
  blurb: "basement.studio's HUMAN/MACHINE pill rebuilt (SOTD Apr 2025): an uppercase segmented pill where a white indicator glides behind the active option in 0.42s while the active ink flips orange for MACHINE.",
  states: "default, hover, active option (indicator glide + ink flip), focus-visible, reduced motion",
  keywords: ["segment flip","basement studio","segmented pill","segmented control","pill switch","human machine","indicator glide","sliding indicator","two state pill","mode pill","uppercase pill","dark pill","orange accent","awwwards","site of the day","developer award","animated button","interactive button","css button","hover effect"],
};
