const TRACK_CSS = `
.btn-track-root {
  --track-bg: transparent;
  --track-face: #171717;
  --track-ink: #f5f5f5;
  --track-press: #ea580c;
  --track-dot: #171717;
  --track-corner: #171717;
  --track-focus: #171717;
  --track-halo: none;
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--track-bg);
  user-select: none;
}
:root[data-theme="dark"] .btn-track-root {
  --track-bg: #121315;
  --track-face: #ffffff;
  --track-ink: #111111;
  --track-dot: #dcdcdc;
  --track-corner: #f2f2f2;
  --track-focus: #ffffff;
  --track-halo: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.55));
}
.btn-track-root.is-live,
.btn-track-root.is-live * { cursor: none; }
.btn-track-btn {
  --press: 1;
  appearance: none;
  position: relative;
  isolation: isolate;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-width: 154px;
  min-height: 48px;
  padding: 16px 44px;
  border: 0;
  border-radius: 1px;
  background: var(--track-press);
  color: var(--track-ink);
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.01em;
  line-height: 1;
  cursor: pointer;
  transform: scale(var(--press));
}
.btn-track-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--track-face);
  border-radius: inherit;
  clip-path: inset(0);
  pointer-events: none;
  transition: clip-path 400ms cubic-bezier(0.45, 0, 0.2, 1);
}
.btn-track-btn.is-pressed::before { clip-path: inset(50%); }
.btn-track-label { position: relative; z-index: 1; color: var(--track-ink); mix-blend-mode: normal; }
.btn-track-btn.is-pressed .btn-track-label,
.btn-track-btn:active .btn-track-label { color: #ffffff; }
.btn-track-btn:focus { outline: none; }
.btn-track-btn:focus-visible { outline: 2px solid var(--track-focus); outline-offset: 5px; }
.btn-track-btn:disabled { cursor: not-allowed; opacity: 0.42; }
.btn-track-dot,
.btn-track-corner {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  will-change: transform;
}
.btn-track-root.is-live .btn-track-dot,
.btn-track-root.is-live .btn-track-corner { opacity: 1; }
.btn-track-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--track-dot);
  transition: opacity 180ms ease;
}
.btn-track-root.is-live .btn-track-dot.is-hidden { opacity: 0; }
.btn-track-corner {
  width: 14px;
  height: 14px;
  filter: var(--track-halo);
}
.btn-track-corner--tl { border-top: 2px solid var(--track-corner); border-left: 2px solid var(--track-corner); }
.btn-track-corner--tr { border-top: 2px solid var(--track-corner); border-right: 2px solid var(--track-corner); }
.btn-track-corner--bl { border-bottom: 2px solid var(--track-corner); border-left: 2px solid var(--track-corner); }
.btn-track-corner--br { border-bottom: 2px solid var(--track-corner); border-right: 2px solid var(--track-corner); }
@media (prefers-reduced-motion: reduce) {
  .btn-track-dot,
  .btn-track-btn::before { transition: none; }
}
`;

const TRACK_MARKUP = `
<div class="btn-track-root">
  <button type="button" class="btn-track-btn" data-tracker><span class="btn-track-label">Button</span></button>
  <span class="btn-track-corner btn-track-corner--tl" aria-hidden="true"></span>
  <span class="btn-track-corner btn-track-corner--tr" aria-hidden="true"></span>
  <span class="btn-track-corner btn-track-corner--bl" aria-hidden="true"></span>
  <span class="btn-track-corner btn-track-corner--br" aria-hidden="true"></span>
  <span class="btn-track-dot" aria-hidden="true"></span>
</div>
`.trim();

const TRACK_SCRIPT = `
(function () {
  var ENTER = 72, EXIT = 104, SPAN = 42, ARM = 14, GAP = 10, GAP_PRESS = 5;
  var DOT = 5;

  function lerp(a, b, t) { return a + (b - a) * t; }
  function distToRect(px, py, rect) {
    var dx = Math.max(rect.left - px, 0, px - rect.right);
    var dy = Math.max(rect.top - py, 0, py - rect.bottom);
    return Math.hypot(dx, dy);
  }

  function attachTracker(root) {
    if (!root) return;
    var btn = root.querySelector("[data-tracker]");
    var dot = root.querySelector(".btn-track-dot");
    if (!btn || !dot) return;
    var reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    var corners = [
      { el: root.querySelector(".btn-track-corner--tl"), sx: -1, sy: -1, x: 0, y: 0 },
      { el: root.querySelector(".btn-track-corner--tr"), sx: 1, sy: -1, x: 0, y: 0 },
      { el: root.querySelector(".btn-track-corner--bl"), sx: -1, sy: 1, x: 0, y: 0 },
      { el: root.querySelector(".btn-track-corner--br"), sx: 1, sy: 1, x: 0, y: 0 }
    ];
    if (corners.some(function (c) { return !c.el; })) return;

    var mouse = { x: root.clientWidth / 2, y: root.clientHeight / 2 };
    var dotS = { x: mouse.x, y: mouse.y };
    var inside = false, pressed = false, locked = false;

    function local(event) {
      var r = root.getBoundingClientRect();
      mouse.x = event.clientX - r.left;
      mouse.y = event.clientY - r.top;
    }

    function restRect() {
      return {
        left: btn.offsetLeft,
        top: btn.offsetTop,
        right: btn.offsetLeft + btn.offsetWidth,
        bottom: btn.offsetTop + btn.offsetHeight
      };
    }

    function visualRect() {
      var rr = root.getBoundingClientRect();
      var br = btn.getBoundingClientRect();
      return {
        left: br.left - rr.left,
        top: br.top - rr.top,
        right: br.right - rr.left,
        bottom: br.bottom - rr.top
      };
    }

    function snap() {
      corners.forEach(function (c) {
        c.x = mouse.x + (c.sx * SPAN) / 2;
        c.y = mouse.y + (c.sy * SPAN) / 2;
      });
      dotS.x = mouse.x;
      dotS.y = mouse.y;
    }

    function setPressed(on) {
      pressed = on;
      btn.classList.toggle("is-pressed", on);
      if (!on) btn.style.setProperty("--press", "1");
    }

    function resetPull() {
      locked = false;
      setPressed(false);
    }

    function frame() {
      window.requestAnimationFrame(frame);
      if (!inside || btn.disabled) {
        if (locked) resetPull();
        return;
      }
      var rest = restRect();
      var d = distToRect(mouse.x, mouse.y, rest);
      if (!locked && d < ENTER) locked = true;
      else if (locked && d > EXIT) locked = false;

      btn.style.setProperty("--press", locked && pressed ? "0.97" : "1");

      var gap = locked && pressed ? GAP_PRESS : GAP;
      var vis = visualRect();
      var k = reducedMq.matches ? 1 : locked ? 0.2 : 0.16;
      corners.forEach(function (c) {
        var cx = locked ? (c.sx < 0 ? vis.left - gap : vis.right + gap) : mouse.x + (c.sx * SPAN) / 2;
        var cy = locked ? (c.sy < 0 ? vis.top - gap : vis.bottom + gap) : mouse.y + (c.sy * SPAN) / 2;
        c.x = lerp(c.x, cx, k);
        c.y = lerp(c.y, cy, k);
        c.el.style.transform = "translate3d(" +
          (c.x - (c.sx > 0 ? ARM : 0)).toFixed(2) + "px," +
          (c.y - (c.sy > 0 ? ARM : 0)).toFixed(2) + "px,0)";
      });

      var dk = reducedMq.matches ? 1 : 0.42;
      dotS.x = lerp(dotS.x, mouse.x, dk);
      dotS.y = lerp(dotS.y, mouse.y, dk);
      dot.style.transform = "translate3d(" + (dotS.x - DOT).toFixed(2) + "px," + (dotS.y - DOT).toFixed(2) + "px,0)";
      dot.classList.toggle("is-hidden", locked);
    }

    root.addEventListener("pointerenter", function (event) {
      if (event.pointerType === "touch") return;
      local(event);
      inside = true;
      snap();
      root.classList.add("is-live");
    });
    root.addEventListener("pointermove", function (event) {
      if (event.pointerType === "touch") return;
      local(event);
    });
    root.addEventListener("pointerleave", function () {
      inside = false;
      root.classList.remove("is-live");
      resetPull();
    });
    function onDown(event) {
      if (btn.disabled) return;
      if (event.target === btn || btn.contains(event.target)) setPressed(true);
    }
    function onUp() { setPressed(false); }
    function onKeyDown(event) {
      if (event.repeat || btn.disabled) return;
      if (event.key === " " || event.key === "Enter") setPressed(true);
    }
    function onKeyUp(event) {
      if (event.key === " " || event.key === "Enter") setPressed(false);
    }
    btn.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    btn.addEventListener("keydown", onKeyDown);
    btn.addEventListener("keyup", onKeyUp);
    btn.addEventListener("blur", onUp);
    window.requestAnimationFrame(frame);
  }

  document.querySelectorAll(".btn-track-root").forEach(attachTracker);
})();
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tracker</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #e8eaee; }
    .stage { position: relative; width: min(420px, 92vw); height: 280px; }
    ${TRACK_CSS}
  </style>
</head>
<body>
  <div class="stage">${TRACK_MARKUP}</div>
  <script>
    ${TRACK_SCRIPT}
  </script>
</body>
</html>
`;

export const TRACKER_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef } from "react";

const TRACK_CSS = ${JSON.stringify(TRACK_CSS)};
const ENTER = 72, EXIT = 104, SPAN = 42, ARM = 14, GAP = 10, GAP_PRESS = 5;
const DOT = 5;

function lerp(a, b, t) { return a + (b - a) * t; }
function distToRect(px, py, rect) {
  const dx = Math.max(rect.left - px, 0, px - rect.right);
  const dy = Math.max(rect.top - py, 0, py - rect.bottom);
  return Math.hypot(dx, dy);
}

function attachTracker(root) {
  if (!root) return () => {};
  const btn = root.querySelector("[data-tracker]");
  const dot = root.querySelector(".btn-track-dot");
  if (!btn || !dot) return () => {};
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const corners = [
    { el: root.querySelector(".btn-track-corner--tl"), sx: -1, sy: -1, x: 0, y: 0 },
    { el: root.querySelector(".btn-track-corner--tr"), sx: 1, sy: -1, x: 0, y: 0 },
    { el: root.querySelector(".btn-track-corner--bl"), sx: -1, sy: 1, x: 0, y: 0 },
    { el: root.querySelector(".btn-track-corner--br"), sx: 1, sy: 1, x: 0, y: 0 },
  ];
  if (corners.some((c) => !c.el)) return () => {};

  const mouse = { x: root.clientWidth / 2, y: root.clientHeight / 2 };
  const dotS = { x: mouse.x, y: mouse.y };
  let inside = false, pressed = false, locked = false, raf = 0;

  function local(event) {
    const r = root.getBoundingClientRect();
    mouse.x = event.clientX - r.left;
    mouse.y = event.clientY - r.top;
  }
  function restRect() {
    return {
      left: btn.offsetLeft, top: btn.offsetTop,
      right: btn.offsetLeft + btn.offsetWidth, bottom: btn.offsetTop + btn.offsetHeight,
    };
  }
  function visualRect() {
    const rr = root.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    return { left: br.left - rr.left, top: br.top - rr.top, right: br.right - rr.left, bottom: br.bottom - rr.top };
  }
  function snap() {
    corners.forEach((c) => {
      c.x = mouse.x + (c.sx * SPAN) / 2;
      c.y = mouse.y + (c.sy * SPAN) / 2;
    });
    dotS.x = mouse.x; dotS.y = mouse.y;
  }
  function setPressed(on) {
    pressed = on;
    btn.classList.toggle("is-pressed", on);
    if (!on) btn.style.setProperty("--press", "1");
  }
  function resetPull() {
    locked = false;
    setPressed(false);
  }
  function frame() {
    raf = window.requestAnimationFrame(frame);
    if (!inside || btn.disabled) { if (locked) resetPull(); return; }
    const rest = restRect();
    const d = distToRect(mouse.x, mouse.y, rest);
    if (!locked && d < ENTER) locked = true;
    else if (locked && d > EXIT) locked = false;
    btn.style.setProperty("--press", locked && pressed ? "0.97" : "1");
    const gap = locked && pressed ? GAP_PRESS : GAP;
    const vis = visualRect();
    const k = reducedMq.matches ? 1 : locked ? 0.2 : 0.16;
    corners.forEach((c) => {
      const cx = locked ? (c.sx < 0 ? vis.left - gap : vis.right + gap) : mouse.x + (c.sx * SPAN) / 2;
      const cy = locked ? (c.sy < 0 ? vis.top - gap : vis.bottom + gap) : mouse.y + (c.sy * SPAN) / 2;
      c.x = lerp(c.x, cx, k);
      c.y = lerp(c.y, cy, k);
      c.el.style.transform = "translate3d(" + (c.x - (c.sx > 0 ? ARM : 0)).toFixed(2) + "px," + (c.y - (c.sy > 0 ? ARM : 0)).toFixed(2) + "px,0)";
    });
    const dk = reducedMq.matches ? 1 : 0.42;
    dotS.x = lerp(dotS.x, mouse.x, dk);
    dotS.y = lerp(dotS.y, mouse.y, dk);
    dot.style.transform = "translate3d(" + (dotS.x - DOT).toFixed(2) + "px," + (dotS.y - DOT).toFixed(2) + "px,0)";
    dot.classList.toggle("is-hidden", locked);
  }

  function onEnter(event) { if (event.pointerType === "touch") return; local(event); inside = true; snap(); root.classList.add("is-live"); }
  function onMove(event) { if (event.pointerType === "touch") return; local(event); }
  function onLeave() { inside = false; root.classList.remove("is-live"); resetPull(); }
  function onDown(event) {
    if (btn.disabled) return;
    if (event.target === btn || btn.contains(event.target)) setPressed(true);
  }
  function onUp() { setPressed(false); }
  function onKeyDown(event) {
    if (event.repeat || btn.disabled) return;
    if (event.key === " " || event.key === "Enter") setPressed(true);
  }
  function onKeyUp(event) {
    if (event.key === " " || event.key === "Enter") setPressed(false);
  }
  root.addEventListener("pointerenter", onEnter);
  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);
  btn.addEventListener("pointerdown", onDown);
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  btn.addEventListener("keydown", onKeyDown);
  btn.addEventListener("keyup", onKeyUp);
  btn.addEventListener("blur", onUp);
  raf = window.requestAnimationFrame(frame);
  return () => {
    window.cancelAnimationFrame(raf);
    root.removeEventListener("pointerenter", onEnter);
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
    btn.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    btn.removeEventListener("keydown", onKeyDown);
    btn.removeEventListener("keyup", onKeyUp);
    btn.removeEventListener("blur", onUp);
    root.classList.remove("is-live");
    resetPull();
  };
}

export default function TrackerButton({ label = "Button", disabled = false }) {
  const rootRef = useRef(null);
  const stylesReady = useRef(false);

  if (typeof document !== "undefined" && !stylesReady.current) {
    if (!document.getElementById("btn-track-styles")) {
      const tag = document.createElement("style");
      tag.id = "btn-track-styles";
      tag.textContent = TRACK_CSS;
      document.head.appendChild(tag);
    }
    stylesReady.current = true;
  }

  useEffect(() => attachTracker(rootRef.current), []);

  return (
    <div ref={rootRef} className="btn-track-root">
      <button type="button" className="btn-track-btn" data-tracker disabled={disabled}><span className="btn-track-label">{label}</span></button>
      <span className="btn-track-corner btn-track-corner--tl" aria-hidden="true" />
      <span className="btn-track-corner btn-track-corner--tr" aria-hidden="true" />
      <span className="btn-track-corner btn-track-corner--bl" aria-hidden="true" />
      <span className="btn-track-corner btn-track-corner--br" aria-hidden="true" />
      <span className="btn-track-dot" aria-hidden="true" />
    </div>
  );
}
`,
  node: `const express = require("express");

const app = express();

const PAGE = ${JSON.stringify(HTML_PAGE)};

app.get("/", function (req, res) {
  res.type("html").send(PAGE);
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
`,
};

export const TRACKER_META = {
  id: "tracker",
  name: "Tracker",
  blurb: "Viewfinder cursor docks to the button as a corner frame.",
  states: "default, near, locked, pressed, focus, disabled",
  keywords: [
    "tracker",
    "icon",
    "viewfinder",
    "cursor",
    "corner frame",
    "dock",
    "focus frame",
    "hover",
    "target",
    "reticle",
    "lock on",
    "pointer",
    "ghost",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
