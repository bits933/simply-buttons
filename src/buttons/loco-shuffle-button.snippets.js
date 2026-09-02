/* Hover shuffle snippets — awwwards showcase harvest (trays 137-146).
   Source: locomotive.ca's SOTD “let's talk” CTA.
   Specimen assembly for the Simply Buttons gallery. */

const CSS = "/* Loco shuffle button — locomotive.ca's \"Let's talk\" header CTA (awwwards\n   SOTD + Site of the Month Mar 2023). A borderless text CTA with a top hairline;\n   the shuffle itself is JS (four Fisher–Yates rounds over 250ms) so the CSS\n   keeps only the chrome: the top line, generous min-width, and hover lift.\n   Specimen for the Simply Buttons gallery. */\n\n.loco-shuffle-root {\n  --aw-shuffle-race: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 1rem;\n}\n\n.btn-loco-shuffle {\n  --aw-shuffle-race-frames: 8;\n  position: relative;\n  min-width: 200px;\n  padding: 0.9em 0.2em 0.7em;\n  border: 0;\n  border-top: 1px solid #121212;\n  background: none;\n  color: #121212;\n  font-family: \"Neue Haas Grotesk\", \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 1.05rem;\n  font-weight: 500;\n  line-height: 1;\n  text-align: center;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);\n}\n\n.btn-loco-shuffle:hover,\n.btn-loco-shuffle:focus-visible {\n  transform: translateY(-2px);\n}\n\n.btn-loco-shuffle:active {\n  transform: translateY(0);\n}\n\n.btn-loco-shuffle:focus-visible {\n  outline: 2px dashed #121212;\n  outline-offset: 5px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .btn-loco-shuffle {\n    transition: none;\n  }\n  .btn-loco-shuffle:hover,\n  .btn-loco-shuffle:focus-visible {\n    transform: none;\n  }\n}\n";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hover shuffle button</title>
  <style>
${CSS}  </style>
</head>
<body>
<div class="loco-shuffle-root">
  <button type="button" class="btn-loco-shuffle" data-loco-shuffle="" aria-label="Let's talk">Let's talk</button>
</div>
<script>
(function () {
  var ROUNDS = 4;
  var TICK_MS = 250 / 8;
  function fisherYates(chars) {
    var out = chars.slice(0);
    for (var i = out.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }
  document.querySelectorAll("[data-loco-shuffle]").forEach(function (btn) {
    var label = btn.getAttribute("aria-label");
    var timer = 0;
    function scramble() {
      window.clearInterval(timer);
      var chars = label.split("");
      var frame = 0;
      timer = window.setInterval(function () {
        frame += 1;
        if (frame >= ROUNDS * 2) {
          window.clearInterval(timer);
          btn.textContent = label;
          return;
        }
        btn.textContent = fisherYates(chars).join("");
      }, TICK_MS);
    }
    function restore() {
      window.clearInterval(timer);
      btn.textContent = label;
    }
    btn.addEventListener("mouseenter", scramble);
    btn.addEventListener("focus", scramble);
    btn.addEventListener("mouseleave", restore);
    btn.addEventListener("blur", restore);
  });
})();
</script>

</body>
</html>`;

const REACT = "\"use client\";\n\n// Loco shuffle button — locomotive.ca's SOTD CTA rebuilt: hover runs four\n// rounds of Fisher-Yates character shuffle over 250ms, restore on leave.\n\nimport { useEffect, useRef, useState } from \"react\";\n\nconst CSS = \"/* Loco shuffle button — locomotive.ca's \\\"Let's talk\\\" header CTA (awwwards\\n   SOTD + Site of the Month Mar 2023). A borderless text CTA with a top hairline;\\n   the shuffle itself is JS (four Fisher–Yates rounds over 250ms) so the CSS\\n   keeps only the chrome: the top line, generous min-width, and hover lift.\\n   Specimen for the Simply Buttons gallery. */\\n\\n.loco-shuffle-root {\\n  --aw-shuffle-race: 1;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  height: 100%;\\n  font-size: 1rem;\\n}\\n\\n.btn-loco-shuffle {\\n  --aw-shuffle-race-frames: 8;\\n  position: relative;\\n  min-width: 200px;\\n  padding: 0.9em 0.2em 0.7em;\\n  border: 0;\\n  border-top: 1px solid #121212;\\n  background: none;\\n  color: #121212;\\n  font-family: \\\"Neue Haas Grotesk\\\", \\\"Helvetica Neue\\\", Arial, sans-serif;\\n  font-size: 1.05rem;\\n  font-weight: 500;\\n  line-height: 1;\\n  text-align: center;\\n  cursor: pointer;\\n  -webkit-tap-highlight-color: transparent;\\n  transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);\\n}\\n\\n.btn-loco-shuffle:hover,\\n.btn-loco-shuffle:focus-visible {\\n  transform: translateY(-2px);\\n}\\n\\n.btn-loco-shuffle:active {\\n  transform: translateY(0);\\n}\\n\\n.btn-loco-shuffle:focus-visible {\\n  outline: 2px dashed #121212;\\n  outline-offset: 5px;\\n}\\n\\n@media (prefers-reduced-motion: reduce) {\\n  .btn-loco-shuffle {\\n    transition: none;\\n  }\\n  .btn-loco-shuffle:hover,\\n  .btn-loco-shuffle:focus-visible {\\n    transform: none;\\n  }\\n}\\n\";\n\nconst ROUNDS = 4;\nconst TICK_MS = 250 / 8;\n\nfunction fisherYates(chars) {\n  const out = [...chars];\n  for (let i = out.length - 1; i > 0; i -= 1) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [out[i], out[j]] = [out[j], out[i]];\n  }\n  return out;\n}\n\nexport default function LocoShuffleButton() {\n  const [shown, setShown] = useState(\"Let's talk\");\n  const timerRef = useRef(0);\n\n  useEffect(() => {\n    if (document.getElementById(\"loco-shuffle-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"loco-shuffle-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n\n  useEffect(() => () => window.clearInterval(timerRef.current), []);\n\n  function scramble() {\n    window.clearInterval(timerRef.current);\n    const chars = \"Let's talk\".split(\"\");\n    let frame = 0;\n    timerRef.current = window.setInterval(() => {\n      frame += 1;\n      if (frame >= ROUNDS * 2) {\n        window.clearInterval(timerRef.current);\n        setShown(\"Let's talk\");\n        return;\n      }\n      setShown(fisherYates(chars).join(\"\"));\n    }, TICK_MS);\n  }\n\n  function restore() {\n    window.clearInterval(timerRef.current);\n    setShown(\"Let's talk\");\n  }\n\n  return (\n    <button\n      type=\"button\"\n      data-loco-shuffle=\"\"\n      aria-label=\"Let's talk\"\n      className=\"btn-loco-shuffle\"\n      onMouseEnter={scramble}\n      onFocus={scramble}\n      onMouseLeave={restore}\n      onBlur={restore}\n    >\n      {shown}\n    </button>\n  );\n}\n";

export const LOCO_SHUFFLE_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const LOCO_SHUFFLE_META = {
  id: "aw-loco-shuffle",
  name: "Hover shuffle",
  blurb: "locomotive.ca's SOTD “let's talk” CTA rebuilt: hovering runs four rounds of whole-word Fisher–Yates character shuffle over 250ms, then the label restores from its aria-label. Leaving mid-scramble kills the loop.",
  states: "default, hover (character shuffle race), focus, blur restore, active press, reduced motion",
  keywords: ["hover shuffle","locomotive","loco shuffle","letter shuffle","character shuffle","fisher yates","scramble text","text scramble","lets talk","let's talk","text cta","borderless button","typographic button","awwwards","site of the month","microinteraction","animated button","interactive button","css button","hover effect"],
};
