const LETTER_SCRAMBLE_CSS_SNIPPET = `
.btn-lscram-btn {
  --lscram-fill: #171717;
  --lscram-ink: #f4f4f4;
  --lscram-focus: #171717;
  appearance: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 168px;
  height: 52px;
  padding: 0 22px;
  border: 0;
  border-radius: 0;
  background: var(--lscram-fill);
  color: var(--lscram-ink);
  font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1;
  text-transform: uppercase;
  cursor: pointer;
}
.btn-lscram-label { display: flex; align-items: center; font-variant-ligatures: none; }
.btn-lscram-cell { display: block; flex: 0 0 1.15ch; width: 1.15ch; text-align: center; }
.btn-lscram-btn:focus { outline: none; }
.btn-lscram-btn:focus-visible { outline: 2px solid var(--lscram-focus); outline-offset: 4px; }
.btn-lscram-btn:disabled { cursor: not-allowed; opacity: 0.42; }
@media (prefers-color-scheme: dark) {
  .btn-lscram-btn { --lscram-fill: #eceef1; --lscram-ink: #161719; --lscram-focus: #f5f5f5; }
}
`.trim();

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LABEL = "BUTTON";
const CELLS = [...LABEL]
  .map((character) => `<span class="btn-lscram-cell">${character}</span>`)
  .join("");

const MARKUP = `
<button type="button" class="btn-lscram-btn" data-text="${LABEL}" aria-label="${LABEL}">
  <span class="btn-lscram-label" aria-hidden="true">${CELLS}</span>
</button>
`.trim();

const SCRIPT = `
(function () {
  var LETTERS = "${LETTERS}";
  var DURATION = 460;
  var HOLD = 90;
  function glyph(index, tick) {
    return LETTERS[((index * 31 + tick * 17) % LETTERS.length + LETTERS.length) % LETTERS.length];
  }
  function ease(progress) {
    var amount = Math.min(1, Math.max(0, progress));
    return 1 - (1 - amount) * (1 - amount);
  }
  function frameText(text, progress, tick) {
    var amount = ease(progress);
    if (amount >= 1) return text;
    var resolved = Math.floor(text.length * amount);
    return text.split("").map(function (character, index) {
      if (character === " " || index < resolved) return character;
      return glyph(index, tick);
    }).join("");
  }
  document.querySelectorAll(".btn-lscram-btn").forEach(function (button) {
    var cells = button.querySelectorAll(".btn-lscram-cell");
    var text = (button.getAttribute("data-text") || "${LABEL}").trim();
    var frame = 0, hover = false, focus = false;
    function cancel() { if (frame) cancelAnimationFrame(frame); frame = 0; }
    function paint(progress, tick) {
      var next = frameText(text, progress, tick);
      next.split("").forEach(function (character, index) {
        if (cells[index]) cells[index].textContent = character;
      });
    }
    function run() {
      cancel();
      var live = hover || focus;
      if (!live || button.disabled || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        paint(1, 0);
        return;
      }
      var startedAt = performance.now();
      var tick = 0;
      var lastHold = -Infinity;
      function render(now) {
        if (!(hover || focus) || button.disabled) return;
        var progress = Math.min(1, (now - startedAt) / DURATION);
        if (now - lastHold >= HOLD || progress === 1) {
          paint(progress, tick);
          lastHold = now;
          tick += 1;
        }
        if (progress < 1) frame = requestAnimationFrame(render);
        else frame = 0;
      }
      frame = requestAnimationFrame(render);
    }
    button.addEventListener("pointerenter", function (event) {
      if (button.disabled || event.pointerType === "touch") return;
      hover = true;
      run();
    });
    button.addEventListener("pointerleave", function (event) {
      if (event.pointerType === "touch") return;
      hover = false;
      run();
    });
    button.addEventListener("focus", function () {
      focus = button.matches(":focus-visible");
      run();
    });
    button.addEventListener("blur", function () {
      focus = false;
      run();
    });
  });
})();
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Letter scramble</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #e8eaee; }
    ${LETTER_SCRAMBLE_CSS_SNIPPET}
  </style>
</head>
<body>
  ${MARKUP}
  <script>${SCRIPT}</script>
</body>
</html>
`;

export const LETTER_SCRAMBLE_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef } from "react";

const CSS = ${JSON.stringify(LETTER_SCRAMBLE_CSS_SNIPPET)};
const LETTERS = ${JSON.stringify(LETTERS)};
const DURATION = 460;
const HOLD = 90;

function glyph(index, tick) {
  return LETTERS[((index * 31 + tick * 17) % LETTERS.length + LETTERS.length) % LETTERS.length];
}
function ease(progress) {
  const amount = Math.min(1, Math.max(0, progress));
  return 1 - (1 - amount) * (1 - amount);
}
function frameText(text, progress, tick) {
  const amount = ease(progress);
  if (amount >= 1) return text;
  const resolved = Math.floor(text.length * amount);
  return [...text].map((character, index) => {
    if (character === " " || index < resolved) return character;
    return glyph(index, tick);
  }).join("");
}

export default function LetterScrambleButton({
  label = ${JSON.stringify(LABEL)},
  disabled = false,
}) {
  const buttonRef = useRef(null);
  useEffect(() => {
    if (!document.getElementById("btn-lscram-styles")) {
      const tag = document.createElement("style");
      tag.id = "btn-lscram-styles";
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    const button = buttonRef.current;
    if (!button) return undefined;
    const cells = button.querySelectorAll(".btn-lscram-cell");
    let frame = 0, hover = false, focus = false;
    function cancel() { if (frame) cancelAnimationFrame(frame); frame = 0; }
    function paint(progress, tick) {
      const next = frameText(label, progress, tick);
      [...next].forEach((character, index) => {
        if (cells[index]) cells[index].textContent = character;
      });
    }
    function run() {
      cancel();
      const live = hover || focus;
      if (!live || button.disabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        paint(1, 0);
        return;
      }
      const startedAt = performance.now();
      let tick = 0;
      let lastHold = -Infinity;
      function render(now) {
        if (!(hover || focus) || button.disabled) return;
        const progress = Math.min(1, (now - startedAt) / DURATION);
        if (now - lastHold >= HOLD || progress === 1) {
          paint(progress, tick);
          lastHold = now;
          tick += 1;
        }
        if (progress < 1) frame = requestAnimationFrame(render);
        else frame = 0;
      }
      frame = requestAnimationFrame(render);
    }
    function onEnter(event) {
      if (button.disabled) return;
      if (event.type === "pointerenter" && event.pointerType === "touch") return;
      if (event.type === "pointerenter") hover = true;
      if (event.type === "focus") focus = button.matches(":focus-visible");
      run();
    }
    function onLeave(event) {
      if (event.type === "pointerleave" && event.pointerType === "touch") return;
      if (event.type === "pointerleave") hover = false;
      if (event.type === "blur") focus = false;
      run();
    }
    button.addEventListener("pointerenter", onEnter);
    button.addEventListener("pointerleave", onLeave);
    button.addEventListener("focus", onEnter);
    button.addEventListener("blur", onLeave);
    return () => {
      cancel();
      button.removeEventListener("pointerenter", onEnter);
      button.removeEventListener("pointerleave", onLeave);
      button.removeEventListener("focus", onEnter);
      button.removeEventListener("blur", onLeave);
    };
  }, [label, disabled]);

  return (
    <button ref={buttonRef} type="button" className="btn-lscram-btn" data-text={label} disabled={disabled} aria-label={label}>
      <span className="btn-lscram-label" aria-hidden="true">
        {[...label].map((character, index) => (
          <span className="btn-lscram-cell" key={index}>{character}</span>
        ))}
      </span>
    </button>
  );
}
`,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const LETTER_SCRAMBLE_META = {
  id: "letter-scramble",
  name: "Letter scramble",
  blurb: "Sharp rectangle. Hover decodes the word left to right through letters only.",
  states: "default, hover, focus, disabled",
  keywords: [
    "letter scramble",
    "decode",
    "scramble hover",
    "left to right",
    "rectangle button",
    "sharp corners",
    "no radius",
    "letters only",
    "alphabet scramble",
    "hacker text",
    "cta",
    "hover decode",
    "mono button",
    "text scramble",
    "animated button",
    "interactive button",
    "square button",
    "decode animation",
    "hover scramble",
  ],
};
