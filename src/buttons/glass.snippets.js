const GLASS_CSS = `
.btn-glass-root,
.btn-glass-btn {
  --glass-well: #9aa1ad;
  --glass-plate-a: rgba(255, 255, 255, 0.2);
  --glass-plate-b: rgba(255, 255, 255, 0.06);
  --glass-edge: rgba(255, 255, 255, 0.62);
  --glass-edge-in: rgba(255, 255, 255, 0.32);
  --glass-ink: #171717;
  --glass-trail: rgba(255, 255, 255, 1);
  --glass-cast: rgba(18, 18, 20, 0.22);
  --glass-inset: rgba(18, 18, 20, 0.16);
  --glass-rim-hi: rgba(255, 255, 255, 0.78);
  --glass-rim-lo: rgba(18, 18, 20, 0.16);
  --glass-focus: #171717;
  --glass-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --glass-frost: blur(18px) saturate(140%) contrast(1.05);
}
:root[data-theme="dark"] .btn-glass-root,
:root[data-theme="dark"] .btn-glass-btn {
  --glass-well: #121418;
  --glass-plate-a: rgba(255, 255, 255, 0.1);
  --glass-plate-b: rgba(255, 255, 255, 0.03);
  --glass-edge: rgba(255, 255, 255, 0.2);
  --glass-edge-in: rgba(255, 255, 255, 0.1);
  --glass-ink: #f4f4f5;
  --glass-trail: rgba(255, 255, 255, 1);
  --glass-cast: rgba(0, 0, 0, 0.5);
  --glass-inset: rgba(0, 0, 0, 0.38);
  --glass-rim-hi: rgba(255, 255, 255, 0.32);
  --glass-rim-lo: rgba(0, 0, 0, 0.4);
  --glass-focus: #f5f5f5;
}
.btn-glass-root {
  position: relative;
  display: grid;
  place-items: center;
  width: 280px;
  min-height: 128px;
  overflow: hidden;
  border-radius: 22px;
  background: var(--glass-well);
}
.btn-glass-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(118deg, transparent 0 11px, rgba(0, 0, 0, 0.12) 11px 12px);
}
:root[data-theme="dark"] .btn-glass-field {
  background-image: repeating-linear-gradient(118deg, transparent 0 11px, rgba(255, 255, 255, 0.08) 11px 12px);
}
.btn-glass-btn {
  --mx: 50%; --my: 18%; --nx: 0; --ny: -0.55; --lx: 0; --ly: 0.55;
  appearance: none; position: relative; z-index: 1; isolation: isolate; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 176px; min-height: 48px; padding: 0 28px; border: 0; border-radius: 999px;
  background: transparent; color: var(--glass-ink);
  font-family: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  font-size: 14px; font-weight: 500; letter-spacing: -0.01em; line-height: 1;
  cursor: pointer; user-select: none;
  backdrop-filter: var(--glass-frost);
  -webkit-backdrop-filter: var(--glass-frost);
  transform: translateY(0) scale(1);
  transition: transform 90ms var(--glass-ease);
}
.btn-glass-btn *, .btn-glass-btn *::before, .btn-glass-btn *::after { box-sizing: border-box; }
.btn-glass-plate, .btn-glass-rim, .btn-glass-trail {
  position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
}
.btn-glass-plate {
  z-index: 0;
  background: linear-gradient(180deg, var(--glass-plate-a), var(--glass-plate-b));
  border: 1px solid var(--glass-edge);
  box-shadow: 0 1px 0 var(--glass-edge-in) inset, 0 12px 24px var(--glass-cast), 0 2px 4px rgba(0, 0, 0, 0.08);
}
.btn-glass-rim {
  z-index: 1;
  box-shadow:
    inset 0 1px 0 var(--glass-rim-hi), inset 0 -1px 0 var(--glass-rim-lo),
    inset calc(var(--nx) * -8px) calc(var(--ny) * -6px) 14px rgba(255, 255, 255, 0.12),
    inset calc(var(--lx) * 6px) calc(var(--ly) * 6px) 12px var(--glass-inset);
}
.btn-glass-trail {
  z-index: 2; width: 100%; height: 100%; overflow: visible; opacity: 0;
  fill: var(--glass-trail); filter: blur(8px); transition: opacity 560ms var(--glass-ease);
}
.btn-glass-btn.is-lit .btn-glass-trail { opacity: 0.1; transition: opacity 80ms linear; }
.btn-glass-btn.is-leaving .btn-glass-trail { opacity: 0; transition: opacity 560ms var(--glass-ease); }
.btn-glass-label { position: relative; z-index: 3; white-space: nowrap; }
.btn-glass-btn.is-pressed { transform: translateY(1px) scale(0.98); }
.btn-glass-btn.is-pressed .btn-glass-plate {
  background: linear-gradient(180deg, var(--glass-plate-b), var(--glass-plate-a));
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.1) inset, 0 1px 2px rgba(0, 0, 0, 0.1);
}
.btn-glass-btn.is-pressed .btn-glass-rim {
  box-shadow:
    inset 0 3px 8px var(--glass-inset), inset 0 -1px 0 var(--glass-rim-hi),
    inset calc(var(--nx) * 6px) calc(var(--ny) * 6px) 12px var(--glass-inset),
    inset calc(var(--lx) * -4px) calc(var(--ly) * -4px) 10px rgba(255, 255, 255, 0.2);
}
.btn-glass-btn:focus { outline: none; }
.btn-glass-btn:focus-visible { outline: 2px solid var(--glass-focus); outline-offset: 3px; }
.btn-glass-btn:disabled { cursor: not-allowed; opacity: 0.42; }
.btn-glass-btn:disabled .btn-glass-trail { opacity: 0; }
@media (prefers-reduced-transparency: reduce) {
  .btn-glass-btn {
    backdrop-filter: none; -webkit-backdrop-filter: none;
    background: color-mix(in srgb, var(--glass-well) 18%, #f4f4f5);
  }
  :root[data-theme="dark"] .btn-glass-btn {
    background: color-mix(in srgb, var(--glass-well) 36%, #2a2c31);
  }
}
@media (prefers-reduced-motion: reduce) {
  .btn-glass-btn, .btn-glass-trail { transition: none; }
  .btn-glass-btn.is-pressed { transform: none; }
  .btn-glass-trail { display: none; }
}
`.trim();

const GLASS_MARKUP = `
<span class="btn-glass-root">
  <span class="btn-glass-field" aria-hidden="true"></span>
  <button class="btn-glass-btn" type="button" data-glass>
    <span class="btn-glass-plate" aria-hidden="true"></span>
    <span class="btn-glass-rim" aria-hidden="true"></span>
    <svg class="btn-glass-trail" data-glass-trail aria-hidden="true">
      <defs>
        <filter id="btn-glass-goo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur"/>
          <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo"/>
          <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
        </filter>
      </defs>
    </svg>
    <span class="btn-glass-label">Continue</span>
  </button>
</span>
`.trim();

const GLASS_SCRIPT = `
(function () {
  var TRAIL = 16, MIN_DIST = 4, HEAD = 6.4, TAIL = 0.7, FADE_MS = 560;
  function writeLight(btn, clientX, clientY) {
    var rect = btn.getBoundingClientRect();
    var x = clientX - rect.left, y = clientY - rect.top;
    var nx = rect.width ? (x / rect.width) * 2 - 1 : 0;
    var ny = rect.height ? (y / rect.height) * 2 - 1 : 0;
    btn.style.setProperty("--mx", x + "px");
    btn.style.setProperty("--my", y + "px");
    btn.style.setProperty("--nx", nx.toFixed(3));
    btn.style.setProperty("--ny", ny.toFixed(3));
    btn.style.setProperty("--lx", (-nx).toFixed(3));
    btn.style.setProperty("--ly", (-ny).toFixed(3));
    return { x: x, y: y };
  }
  function ensureDots(svg) {
    if (!svg) return [];
    var ns = "http://www.w3.org/2000/svg";
    var group = svg.querySelector("[data-glass-goo]");
    if (!group) {
      group = document.createElementNS(ns, "g");
      group.setAttribute("data-glass-goo", "");
      group.setAttribute("filter", "url(#btn-glass-goo)");
      svg.appendChild(group);
    }
    while (group.childElementCount < TRAIL) {
      var dot = document.createElementNS(ns, "circle");
      dot.setAttribute("r", "0");
      group.appendChild(dot);
    }
    return Array.prototype.slice.call(group.querySelectorAll("circle"));
  }
  function paintTrail(dots, points) {
    var n = points.length;
    dots.forEach(function (dot, i) {
      var index = i - (TRAIL - n);
      if (index < 0) { dot.setAttribute("r", "0"); return; }
      var point = points[index];
      var t = n <= 1 ? 1 : index / (n - 1);
      dot.setAttribute("cx", point.x.toFixed(1));
      dot.setAttribute("cy", point.y.toFixed(1));
      dot.setAttribute("r", (TAIL + (HEAD - TAIL) * t).toFixed(2));
    });
  }
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll(".btn-glass-root").forEach(function (root) {
    var btn = root.querySelector("[data-glass]");
    if (!btn) return;
    var dots = ensureDots(root.querySelector("[data-glass-trail]"));
    var points = [];
    var fadeTimer = 0, raf = 0;
    function draw() { raf = 0; paintTrail(dots, points); }
    function queue() { if (!raf) raf = window.requestAnimationFrame(draw); }
    function sample(x, y) {
      var last = points[points.length - 1];
      if (last && Math.hypot(x - last.x, y - last.y) < MIN_DIST) return;
      points.push({ x: x, y: y });
      if (points.length > TRAIL) points.shift();
      queue();
    }
    function onMove(event) {
      if (btn.disabled || reduced.matches) return;
      btn.classList.remove("is-leaving");
      btn.classList.add("is-lit");
      var p = writeLight(btn, event.clientX, event.clientY);
      sample(p.x, p.y);
    }
    function onEnter(event) {
      if (btn.disabled) return;
      window.clearTimeout(fadeTimer);
      points.length = 0;
      paintTrail(dots, points);
      btn.classList.remove("is-leaving");
      btn.classList.add("is-lit");
      if (!reduced.matches && event.clientX != null) {
        var p = writeLight(btn, event.clientX, event.clientY);
        sample(p.x, p.y);
      }
    }
    function onLeave() {
      btn.classList.remove("is-pressed", "is-lit");
      if (reduced.matches) { points.length = 0; paintTrail(dots, points); return; }
      btn.classList.add("is-leaving");
      window.clearTimeout(fadeTimer);
      fadeTimer = window.setTimeout(function () {
        points.length = 0;
        paintTrail(dots, points);
        btn.classList.remove("is-leaving");
      }, FADE_MS);
    }
    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerleave", onLeave);
    btn.addEventListener("pointerdown", function (event) {
      if (btn.disabled) return;
      btn.classList.add("is-pressed");
      if (!reduced.matches && event.clientX != null) writeLight(btn, event.clientX, event.clientY);
    });
    btn.addEventListener("pointerup", function () { btn.classList.remove("is-pressed"); });
    btn.addEventListener("pointercancel", function () { btn.classList.remove("is-pressed"); });
    btn.addEventListener("keydown", function (event) {
      if (!btn.disabled && (event.key === " " || event.key === "Enter")) btn.classList.add("is-pressed", "is-lit");
    });
    btn.addEventListener("keyup", function (event) {
      if (event.key === " " || event.key === "Enter") btn.classList.remove("is-pressed");
    });
    btn.addEventListener("blur", onLeave);
  });
})();
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Glass</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body { display: grid; place-items: center; background: #9aa1ad; }
    ${GLASS_CSS}
  </style>
</head>
<body>
  ${GLASS_MARKUP}
  <script>${GLASS_SCRIPT}</script>
</body>
</html>
`;

export const GLASS_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef } from "react";

const GLASS_CSS = ${JSON.stringify(GLASS_CSS)};
const TRAIL = 16, MIN_DIST = 4, HEAD = 6.4, TAIL = 0.7, FADE_MS = 560;

function writeLight(btn, clientX, clientY) {
  const rect = btn.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const nx = rect.width ? (x / rect.width) * 2 - 1 : 0;
  const ny = rect.height ? (y / rect.height) * 2 - 1 : 0;
  btn.style.setProperty("--mx", x + "px");
  btn.style.setProperty("--my", y + "px");
  btn.style.setProperty("--nx", nx.toFixed(3));
  btn.style.setProperty("--ny", ny.toFixed(3));
  btn.style.setProperty("--lx", (-nx).toFixed(3));
  btn.style.setProperty("--ly", (-ny).toFixed(3));
  return { x, y };
}
function ensureDots(svg) {
  if (!svg) return [];
  const ns = "http://www.w3.org/2000/svg";
  let group = svg.querySelector("[data-glass-goo]");
  if (!group) {
    group = document.createElementNS(ns, "g");
    group.setAttribute("data-glass-goo", "");
    group.setAttribute("filter", "url(#btn-glass-goo)");
    svg.appendChild(group);
  }
  while (group.childElementCount < TRAIL) {
    const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("r", "0");
    group.appendChild(dot);
  }
  return Array.from(group.querySelectorAll("circle"));
}
function paintTrail(dots, points) {
  const n = points.length;
  dots.forEach(function (dot, i) {
    const index = i - (TRAIL - n);
    if (index < 0) { dot.setAttribute("r", "0"); return; }
    const point = points[index];
    const t = n <= 1 ? 1 : index / (n - 1);
    dot.setAttribute("cx", point.x.toFixed(1));
    dot.setAttribute("cy", point.y.toFixed(1));
    dot.setAttribute("r", (TAIL + (HEAD - TAIL) * t).toFixed(2));
  });
}
function attachGlass(root) {
  if (!root) return function () {};
  const btn = root.querySelector("[data-glass]") || root;
  if (!btn || btn.tagName !== "BUTTON") return function () {};
  const dots = ensureDots(root.querySelector("[data-glass-trail]"));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const points = [];
  let fadeTimer = 0, raf = 0;
  function draw() { raf = 0; paintTrail(dots, points); }
  function queue() { if (!raf) raf = window.requestAnimationFrame(draw); }
  function sample(x, y) {
    const last = points[points.length - 1];
    if (last && Math.hypot(x - last.x, y - last.y) < MIN_DIST) return;
    points.push({ x, y });
    if (points.length > TRAIL) points.shift();
    queue();
  }
  function onMove(event) {
    if (btn.disabled || reduced.matches) return;
    btn.classList.remove("is-leaving");
    btn.classList.add("is-lit");
    const p = writeLight(btn, event.clientX, event.clientY);
    sample(p.x, p.y);
  }
  function onEnter(event) {
    if (btn.disabled) return;
    window.clearTimeout(fadeTimer);
    points.length = 0;
    paintTrail(dots, points);
    btn.classList.remove("is-leaving");
    btn.classList.add("is-lit");
    if (!reduced.matches && event.clientX != null) {
      const p = writeLight(btn, event.clientX, event.clientY);
      sample(p.x, p.y);
    }
  }
  function onLeave() {
    btn.classList.remove("is-pressed", "is-lit");
    if (reduced.matches) { points.length = 0; paintTrail(dots, points); return; }
    btn.classList.add("is-leaving");
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(function () {
      points.length = 0;
      paintTrail(dots, points);
      btn.classList.remove("is-leaving");
    }, FADE_MS);
  }
  function onDown(event) {
    if (btn.disabled) return;
    btn.classList.add("is-pressed");
    if (!reduced.matches && event.clientX != null) writeLight(btn, event.clientX, event.clientY);
  }
  function onUp() { btn.classList.remove("is-pressed"); }
  btn.addEventListener("pointerenter", onEnter);
  btn.addEventListener("pointermove", onMove);
  btn.addEventListener("pointerleave", onLeave);
  btn.addEventListener("pointerdown", onDown);
  btn.addEventListener("pointerup", onUp);
  btn.addEventListener("pointercancel", onUp);
  btn.addEventListener("blur", onLeave);
  return function () {
    window.clearTimeout(fadeTimer);
    if (raf) window.cancelAnimationFrame(raf);
    btn.classList.remove("is-lit", "is-pressed", "is-leaving");
    btn.removeEventListener("pointerenter", onEnter);
    btn.removeEventListener("pointermove", onMove);
    btn.removeEventListener("pointerleave", onLeave);
    btn.removeEventListener("pointerdown", onDown);
    btn.removeEventListener("pointerup", onUp);
    btn.removeEventListener("pointercancel", onUp);
    btn.removeEventListener("blur", onLeave);
  };
}

export function GlassButton({ label = "Continue", disabled = false, className = "", onClick, ...rest }) {
  const rootRef = useRef(null);
  useEffect(function () { return attachGlass(rootRef.current); }, []);
  return (
    <span className={["btn-glass-root", className].filter(Boolean).join(" ")} ref={rootRef}>
      <style>{GLASS_CSS}</style>
      <span className="btn-glass-field" aria-hidden="true" />
      <button type="button" className="btn-glass-btn" data-glass="" disabled={disabled} onClick={onClick} {...rest}>
        <span className="btn-glass-plate" aria-hidden="true" />
        <span className="btn-glass-rim" aria-hidden="true" />
        <svg className="btn-glass-trail" data-glass-trail="" aria-hidden="true">
          <defs>
            <filter id="btn-glass-goo" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        <span className="btn-glass-label">{label}</span>
      </button>
    </span>
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

export const GLASS_META = {
  id: "glass",
  name: "Glass",
  blurb: "Frosted capsule over a real field. Hover leaves a thinning liquid trail that fades out.",
  states: "idle, hover trail, leave fade, press, focus, disabled",
  keywords: [
    "glass",
    "frosted glass",
    "frosted capsule",
    "glassmorphism",
    "blur glass",
    "liquid trail",
    "hover trail",
    "thinning trail",
    "fade trail",
    "capsule button",
    "translucent",
    "frosted blur",
    "glass cta",
    "field overlay",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
