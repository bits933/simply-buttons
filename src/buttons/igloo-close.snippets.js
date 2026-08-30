const IGLOO_CSS = `
.btn-igloo-root,
.btn-igloo-btn {
  --igloo-ink: #171717;
  --igloo-focus: #171717;
}
:root[data-theme="dark"] .btn-igloo-root,
:root[data-theme="dark"] .btn-igloo-btn {
  --igloo-ink: #f4f4f5;
  --igloo-focus: #f5f5f5;
}
.btn-igloo-root { display: grid; place-items: center; }
.btn-igloo-btn {
  appearance: none; position: relative; isolation: isolate; overflow: visible;
  display: inline-grid; place-items: center;
  min-width: 132px; min-height: 52px; padding: 16px 28px;
  border: 0; background: transparent; color: var(--igloo-ink);
  font-family: "IBM Plex Mono", ui-monospace, Consolas, monospace;
  font-size: 16px; font-weight: 500; letter-spacing: 0.04em; line-height: 1; cursor: pointer;
}
.btn-igloo-btn *,
.btn-igloo-btn *::before,
.btn-igloo-btn *::after { box-sizing: border-box; }
.btn-igloo-label {
  position: relative; z-index: 1; display: block; min-width: 5ch;
  text-align: center; white-space: nowrap;
}
.btn-igloo-frame { position: absolute; inset: 0; pointer-events: none; }
.btn-igloo-corner { position: absolute; width: 14px; height: 14px; }
.btn-igloo-arm {
  position: absolute; background: currentColor;
  will-change: transform;
}
.btn-igloo-arm--h { width: 14px; height: 2px; }
.btn-igloo-arm--v { width: 2px; height: 5px; }
.btn-igloo-corner--tl { top: 0; left: 0; }
.btn-igloo-corner--tl .btn-igloo-arm--h { top: 0; left: 0; }
.btn-igloo-corner--tl .btn-igloo-arm--v0 { top: 0; left: 0; }
.btn-igloo-corner--tl .btn-igloo-arm--v1 { top: 4.5px; left: 0; }
.btn-igloo-corner--tl .btn-igloo-arm--v2 { top: 9px; left: 0; }
.btn-igloo-corner--tr { top: 0; right: 0; }
.btn-igloo-corner--tr .btn-igloo-arm--h { top: 0; right: 0; }
.btn-igloo-corner--tr .btn-igloo-arm--v0 { top: 0; right: 0; }
.btn-igloo-corner--tr .btn-igloo-arm--v1 { top: 4.5px; right: 0; }
.btn-igloo-corner--tr .btn-igloo-arm--v2 { top: 9px; right: 0; }
.btn-igloo-corner--bl { bottom: 0; left: 0; }
.btn-igloo-corner--bl .btn-igloo-arm--h { bottom: 0; left: 0; }
.btn-igloo-corner--bl .btn-igloo-arm--v0 { bottom: 9px; left: 0; }
.btn-igloo-corner--bl .btn-igloo-arm--v1 { bottom: 4.5px; left: 0; }
.btn-igloo-corner--bl .btn-igloo-arm--v2 { bottom: 0; left: 0; }
.btn-igloo-corner--br { bottom: 0; right: 0; }
.btn-igloo-corner--br .btn-igloo-arm--h { bottom: 0; right: 0; }
.btn-igloo-corner--br .btn-igloo-arm--v0 { bottom: 9px; right: 0; }
.btn-igloo-corner--br .btn-igloo-arm--v1 { bottom: 4.5px; right: 0; }
.btn-igloo-corner--br .btn-igloo-arm--v2 { bottom: 0; right: 0; }
.btn-igloo-btn:focus { outline: none; }
.btn-igloo-btn:focus-visible { outline: 2px solid var(--igloo-focus); outline-offset: 6px; }
.btn-igloo-btn:disabled { cursor: not-allowed; opacity: 0.42; }
`;

const CORNER = (pos) => `
    <span class="btn-igloo-corner btn-igloo-corner--${pos}">
      <i class="btn-igloo-arm btn-igloo-arm--h"></i>
      <i class="btn-igloo-arm btn-igloo-arm--v btn-igloo-arm--v0"></i>
      <i class="btn-igloo-arm btn-igloo-arm--v btn-igloo-arm--v1"></i>
      <i class="btn-igloo-arm btn-igloo-arm--v btn-igloo-arm--v2"></i>
    </span>`;

const IGLOO_MARKUP = `
<button class="btn-igloo-btn" type="button">
  <span class="btn-igloo-frame" aria-hidden="true">
    ${CORNER("tl")}${CORNER("tr")}${CORNER("bl")}${CORNER("br")}
  </span>
  <span class="btn-igloo-label" data-text="Close">Close</span>
</button>
`;

const IGLOO_SCRIPT = `
(function () {
  var CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  var SCRAMBLE_MS = 400, SHOW_MS = 250, STEPS = 3, DISPLACE = 0.055, HOLD_MS = 280, GAP_MS = 180;
  var PARTS = [
    { sel: ".btn-igloo-corner--tl .btn-igloo-arm--h", uv: [0.04, 0.04] },
    { sel: ".btn-igloo-corner--tl .btn-igloo-arm--v0", uv: [0.02, 0.06] },
    { sel: ".btn-igloo-corner--tl .btn-igloo-arm--v1", uv: [0.02, 0.12] },
    { sel: ".btn-igloo-corner--tl .btn-igloo-arm--v2", uv: [0.02, 0.18] },
    { sel: ".btn-igloo-corner--tr .btn-igloo-arm--h", uv: [0.96, 0.04] },
    { sel: ".btn-igloo-corner--tr .btn-igloo-arm--v0", uv: [0.98, 0.06] },
    { sel: ".btn-igloo-corner--tr .btn-igloo-arm--v1", uv: [0.98, 0.12] },
    { sel: ".btn-igloo-corner--tr .btn-igloo-arm--v2", uv: [0.98, 0.18] },
    { sel: ".btn-igloo-corner--bl .btn-igloo-arm--h", uv: [0.04, 0.96] },
    { sel: ".btn-igloo-corner--bl .btn-igloo-arm--v0", uv: [0.02, 0.82] },
    { sel: ".btn-igloo-corner--bl .btn-igloo-arm--v1", uv: [0.02, 0.88] },
    { sel: ".btn-igloo-corner--bl .btn-igloo-arm--v2", uv: [0.02, 0.94] },
    { sel: ".btn-igloo-corner--br .btn-igloo-arm--h", uv: [0.96, 0.96] },
    { sel: ".btn-igloo-corner--br .btn-igloo-arm--v0", uv: [0.98, 0.82] },
    { sel: ".btn-igloo-corner--br .btn-igloo-arm--v1", uv: [0.98, 0.88] },
    { sel: ".btn-igloo-corner--br .btn-igloo-arm--v2", uv: [0.98, 0.94] }
  ];
  function randChar() { return CHARS[(Math.random() * CHARS.length) | 0]; }
  function hash21(n) { var s = Math.sin(n) * 43758.5453; return s - Math.floor(s); }
  function scrambleOnce(el, text, reduced, alive) {
    if (!el) return Promise.resolve();
    if (reduced) { el.textContent = text; return Promise.resolve(); }
    return new Promise(function (resolve) {
      var t0 = performance.now();
      function tick(now) {
        if (alive && !alive()) { resolve(); return; }
        var p = Math.min(1, (now - t0) / SCRAMBLE_MS), out = "";
        for (var i = 0; i < text.length; i++) {
          var revealAt = (i + 0.35) / (text.length + 0.35);
          out += p >= revealAt || text[i] === " " ? text[i] : randChar();
        }
        el.textContent = out;
        if (p < 1) window.requestAnimationFrame(tick);
        else { el.textContent = text; resolve(); }
      }
      window.requestAnimationFrame(tick);
    });
  }
  function collectParts(btn) {
    return PARTS.map(function (p) { return { uv: p.uv, el: btn.querySelector(p.sel) }; }).filter(function (p) { return p.el; });
  }
  function applyStep(parts, step, uRand, width) {
    var seed = step / STEPS + uRand * 3.342;
    parts.forEach(function (p) {
      var g = hash21(p.uv[0] * 19.19 + p.uv[1] * 78.23 + seed) * 2 - 1;
      p.el.style.transform = "translateX(" + (g * DISPLACE * width).toFixed(2) + "px)";
    });
  }
  function resetParts(parts, frame) {
    parts.forEach(function (p) { p.el.style.transform = ""; });
    if (frame) frame.style.opacity = "";
  }
  function glitchOnce(btn, reduced, alive) {
    if (!btn || reduced) return Promise.resolve();
    var frame = btn.querySelector(".btn-igloo-frame");
    var parts = collectParts(btn);
    var t0 = performance.now(), uRand = Math.random(), width = btn.offsetWidth || 132, lastStep = -1;
    return new Promise(function (resolve) {
      function tick(now) {
        if (alive && !alive()) { resetParts(parts, frame); resolve(); return; }
        var uShow = Math.min(1, (now - t0) / SHOW_MS);
        var step = Math.floor(uShow * STEPS);
        if (step !== lastStep && uShow < 1) { lastStep = step; applyStep(parts, step, uRand, width); }
        if (frame) frame.style.opacity = (Math.sin(uShow * 30 + uRand * 12.4242) * 0.15 + 0.85).toFixed(3);
        if (uShow < 1) window.requestAnimationFrame(tick);
        else { resetParts(parts, frame); resolve(); }
      }
      window.requestAnimationFrame(tick);
    });
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  document.querySelectorAll(".btn-igloo-btn").forEach(function (btn) {
    var label = btn.querySelector(".btn-igloo-label");
    var text = ((label && (label.getAttribute("data-text") || label.textContent)) || "Close").trim();
    var reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    var hovering = false, run = 0;
    function reset() {
      collectParts(btn).forEach(function (p) { p.el.style.transform = ""; });
      var frame = btn.querySelector(".btn-igloo-frame");
      if (frame) frame.style.opacity = "";
    }
    async function loop(id) {
      while (hovering && id === run && !btn.disabled) {
        var alive = function () { return hovering && id === run; };
        await Promise.all([
          scrambleOnce(label, text, reducedMq.matches, alive),
          glitchOnce(btn, reducedMq.matches, alive)
        ]);
        if (!hovering || id !== run) break;
        if (label) label.textContent = text;
        await wait(HOLD_MS);
        if (!hovering || id !== run) break;
        await wait(GAP_MS);
      }
      if (label) label.textContent = text;
      reset();
    }
    function onEnter() { if (btn.disabled) return; hovering = true; run += 1; loop(run); }
    function onLeave() { hovering = false; run += 1; if (label) label.textContent = text; reset(); }
    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    btn.addEventListener("focus", onEnter);
    btn.addEventListener("blur", onLeave);
  });
})();
`;

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Glitch</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body { display: grid; place-items: center; background: #a0a5b1; }
    ${IGLOO_CSS}
  </style>
</head>
<body>
  <div class="btn-igloo-root">${IGLOO_MARKUP}</div>
  <script>${IGLOO_SCRIPT}</script>
</body>
</html>
`;

export const IGLOO_CLOSE_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef } from "react";

const IGLOO_CSS = ${JSON.stringify(IGLOO_CSS)};
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const SCRAMBLE_MS = 400, SHOW_MS = 250, STEPS = 3, DISPLACE = 0.055, HOLD_MS = 280, GAP_MS = 180;
const PARTS = [
  { sel: ".btn-igloo-corner--tl .btn-igloo-arm--h", uv: [0.04, 0.04] },
  { sel: ".btn-igloo-corner--tl .btn-igloo-arm--v0", uv: [0.02, 0.06] },
  { sel: ".btn-igloo-corner--tl .btn-igloo-arm--v1", uv: [0.02, 0.12] },
  { sel: ".btn-igloo-corner--tl .btn-igloo-arm--v2", uv: [0.02, 0.18] },
  { sel: ".btn-igloo-corner--tr .btn-igloo-arm--h", uv: [0.96, 0.04] },
  { sel: ".btn-igloo-corner--tr .btn-igloo-arm--v0", uv: [0.98, 0.06] },
  { sel: ".btn-igloo-corner--tr .btn-igloo-arm--v1", uv: [0.98, 0.12] },
  { sel: ".btn-igloo-corner--tr .btn-igloo-arm--v2", uv: [0.98, 0.18] },
  { sel: ".btn-igloo-corner--bl .btn-igloo-arm--h", uv: [0.04, 0.96] },
  { sel: ".btn-igloo-corner--bl .btn-igloo-arm--v0", uv: [0.02, 0.82] },
  { sel: ".btn-igloo-corner--bl .btn-igloo-arm--v1", uv: [0.02, 0.88] },
  { sel: ".btn-igloo-corner--bl .btn-igloo-arm--v2", uv: [0.02, 0.94] },
  { sel: ".btn-igloo-corner--br .btn-igloo-arm--h", uv: [0.96, 0.96] },
  { sel: ".btn-igloo-corner--br .btn-igloo-arm--v0", uv: [0.98, 0.82] },
  { sel: ".btn-igloo-corner--br .btn-igloo-arm--v1", uv: [0.98, 0.88] },
  { sel: ".btn-igloo-corner--br .btn-igloo-arm--v2", uv: [0.98, 0.94] },
];
function randChar() { return CHARS[(Math.random() * CHARS.length) | 0]; }
function hash21(n) { const s = Math.sin(n) * 43758.5453; return s - Math.floor(s); }
function scrambleOnce(el, text, reduced, alive) {
  if (!el) return Promise.resolve();
  if (reduced) { el.textContent = text; return Promise.resolve(); }
  return new Promise((resolve) => {
    const t0 = performance.now();
    const tick = (now) => {
      if (alive && !alive()) { resolve(); return; }
      const p = Math.min(1, (now - t0) / SCRAMBLE_MS);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const revealAt = (i + 0.35) / (text.length + 0.35);
        out += p >= revealAt || text[i] === " " ? text[i] : randChar();
      }
      el.textContent = out;
      if (p < 1) window.requestAnimationFrame(tick);
      else { el.textContent = text; resolve(); }
    };
    window.requestAnimationFrame(tick);
  });
}
function collectParts(btn) {
  return PARTS.map((p) => ({ uv: p.uv, el: btn.querySelector(p.sel) })).filter((p) => p.el);
}
function applyStep(parts, step, uRand, width) {
  const seed = step / STEPS + uRand * 3.342;
  parts.forEach((p) => {
    const g = hash21(p.uv[0] * 19.19 + p.uv[1] * 78.23 + seed) * 2 - 1;
    p.el.style.transform = "translateX(" + (g * DISPLACE * width).toFixed(2) + "px)";
  });
}
function resetParts(parts, frame) {
  parts.forEach((p) => { p.el.style.transform = ""; });
  if (frame) frame.style.opacity = "";
}
function glitchOnce(btn, reduced, alive) {
  if (!btn || reduced) return Promise.resolve();
  const frame = btn.querySelector(".btn-igloo-frame");
  const parts = collectParts(btn);
  const t0 = performance.now(), uRand = Math.random(), width = btn.offsetWidth || 132;
  let lastStep = -1;
  return new Promise((resolve) => {
    const tick = (now) => {
      if (alive && !alive()) { resetParts(parts, frame); resolve(); return; }
      const uShow = Math.min(1, (now - t0) / SHOW_MS);
      const step = Math.floor(uShow * STEPS);
      if (step !== lastStep && uShow < 1) { lastStep = step; applyStep(parts, step, uRand, width); }
      if (frame) frame.style.opacity = (Math.sin(uShow * 30 + uRand * 12.4242) * 0.15 + 0.85).toFixed(3);
      if (uShow < 1) window.requestAnimationFrame(tick);
      else { resetParts(parts, frame); resolve(); }
    };
    window.requestAnimationFrame(tick);
  });
}
function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
function attachIglooClose(btn) {
  if (!btn) return () => {};
  const label = btn.querySelector(".btn-igloo-label");
  const frame = btn.querySelector(".btn-igloo-frame");
  const text = (label?.dataset.text || label?.textContent || "Close").trim();
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let hovering = false, run = 0;
  function reset() {
    collectParts(btn).forEach((p) => { p.el.style.transform = ""; });
    if (frame) frame.style.opacity = "";
  }
  async function loop(id) {
    while (hovering && id === run && !btn.disabled) {
      const alive = () => hovering && id === run;
      await Promise.all([
        scrambleOnce(label, text, reducedMq.matches, alive),
        glitchOnce(btn, reducedMq.matches, alive),
      ]);
      if (!hovering || id !== run) break;
      if (label) label.textContent = text;
      await wait(HOLD_MS);
      if (!hovering || id !== run) break;
      await wait(GAP_MS);
    }
    if (label) label.textContent = text;
    reset();
  }
  function onEnter() { if (btn.disabled) return; hovering = true; run += 1; loop(run); }
  function onLeave() { hovering = false; run += 1; if (label) label.textContent = text; reset(); }
  btn.addEventListener("pointerenter", onEnter);
  btn.addEventListener("pointerleave", onLeave);
  btn.addEventListener("focus", onEnter);
  btn.addEventListener("blur", onLeave);
  return () => {
    hovering = false; run += 1;
    btn.removeEventListener("pointerenter", onEnter);
    btn.removeEventListener("pointerleave", onLeave);
    btn.removeEventListener("focus", onEnter);
    btn.removeEventListener("blur", onLeave);
    if (label) label.textContent = text;
    reset();
  };
}
function Corner({ pos }) {
  return (
    <span className={"btn-igloo-corner btn-igloo-corner--" + pos}>
      <i className="btn-igloo-arm btn-igloo-arm--h" />
      <i className="btn-igloo-arm btn-igloo-arm--v btn-igloo-arm--v0" />
      <i className="btn-igloo-arm btn-igloo-arm--v btn-igloo-arm--v1" />
      <i className="btn-igloo-arm btn-igloo-arm--v btn-igloo-arm--v2" />
    </span>
  );
}
export default function IglooCloseButton({ label = "Close", disabled = false, className = "", onClick, ...rest }) {
  const btnRef = useRef(null);
  useEffect(() => {
    if (!document.getElementById("btn-igloo-styles")) {
      const tag = document.createElement("style");
      tag.id = "btn-igloo-styles";
      tag.textContent = IGLOO_CSS;
      document.head.appendChild(tag);
    }
    return attachIglooClose(btnRef.current);
  }, []);
  return (
    <button ref={btnRef} type="button" className={["btn-igloo-btn", className].filter(Boolean).join(" ")} disabled={disabled} onClick={onClick} {...rest}>
      <span className="btn-igloo-frame" aria-hidden="true">
        <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
      </span>
      <span className="btn-igloo-label" data-text={label}>{label}</span>
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

export const IGLOO_CLOSE_META = {
  id: "igloo-close",
  name: "Glitch",
  blurb: "Viewfinder Close. Hover scrambles the label and shears the corner strokes.",
  states: "default, hover, focus, disabled",
  keywords: [
    "igloo close",
    "glitch",
    "close",
    "scramble",
    "close button",
    "viewfinder close",
    "text scramble",
    "shear stroke",
    "corner shear",
    "glitch hover",
    "scramble text",
    "viewfinder",
    "glitch close",
    "stroke shear",
    "label scramble",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};

