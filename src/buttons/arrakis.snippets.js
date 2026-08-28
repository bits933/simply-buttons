import fluidSrc from "./arrakis-fluid.js?raw";

const FLUID_INLINE = fluidSrc.replace(/^export /gm, "");

const ARRAKIS_CSS = `
.btn-arrakis-root,
.btn-arrakis-btn {
  --arrakis-dust: #fbf6ec;
  --arrakis-sand: #fbefd6;
  --arrakis-night: #1b1613;
  --arrakis-ease: cubic-bezier(0.4, 0, 0.2, 1);
  --arrakis-focus: #1b1613;
}
.btn-arrakis-root {
  display: inline-flex;
}
:root[data-theme="dark"] .btn-arrakis-root,
:root[data-theme="dark"] .btn-arrakis-btn {
  --arrakis-focus: #fbf6ec;
}
.btn-arrakis-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  appearance: none;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  border-radius: 0.125rem;
  padding: 0.5625rem 0.875rem;
  background-color: var(--arrakis-dust);
  color: var(--arrakis-night);
  border: 1px solid var(--arrakis-dust);
  font: inherit;
  transition:
    color 0.25s var(--arrakis-ease),
    background-color 0.25s var(--arrakis-ease),
    border-color 0.25s var(--arrakis-ease),
    transform 80ms var(--arrakis-ease);
}
.btn-arrakis-btn:hover:not(:disabled) {
  background-color: var(--arrakis-sand);
}
.btn-arrakis-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.btn-arrakis-btn:focus { outline: none; }
.btn-arrakis-btn:focus-visible {
  outline: 2px solid var(--arrakis-focus);
  outline-offset: 4px;
}
.btn-arrakis-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.btn-arrakis-fx {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  border-radius: inherit;
  pointer-events: none;
}
.btn-arrakis-fx canvas {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.35s ease-out;
}
.btn-arrakis-label {
  position: relative;
  z-index: 10;
  font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  font-weight: 400;
  line-height: 1.2;
  font-size: clamp(0.875rem, 0.8375rem + 0.125vw, 0.9375rem);
}
@media (prefers-reduced-motion: reduce) {
  .btn-arrakis-btn,
  .btn-arrakis-fx canvas { transition: none; }
  .btn-arrakis-btn:active:not(:disabled) { transform: none; }
}
`;

const ARRAKIS_BOOT = `
function unitDir(event, rect) {
  if (!event || event.clientX == null) return { dirX: -1, dirY: 0 };
  var dx = event.clientX - (rect.left + rect.width / 2);
  var dy = rect.top + rect.height / 2 - event.clientY;
  var len = Math.hypot(dx, dy);
  if (len < 1) return { dirX: -1, dirY: 0 };
  return { dirX: dx / len, dirY: dy / len };
}

function attachArrakis(root) {
  if (!root) return function () {};
  var btn = root.querySelector("[data-arrakis]") || root;
  var fx = root.querySelector("[data-arrakis-fx]");
  if (!btn || btn.tagName !== "BUTTON" || !fx) return function () {};

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var live = null;

  function mount(event) {
    if (live || btn.disabled || reduced.matches) return;
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    fx.appendChild(canvas);

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = fx.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    var fluid = createArrakisFluid(canvas);
    if (!fluid) { canvas.remove(); return; }
    requestAnimationFrame(function () { canvas.style.opacity = "1"; });
    var dir = unitDir(event, rect);
    fluid.start({ dirX: dir.dirX, dirY: dir.dirY, tone: 0 });

    var session = { canvas: canvas, fluid: fluid, raf: 0, pending: null, onMove: null };
    live = session;

    function flush() {
      session.raf = 0;
      if (session.pending) {
        session.fluid.trail(session.pending.x, session.pending.y);
        session.pending = null;
      }
    }

    session.onMove = function (moveEvent) {
      var box = fx.getBoundingClientRect();
      if (!box.width || !box.height) return;
      session.pending = {
        x: (moveEvent.clientX - box.left) / box.width,
        y: 1 - (moveEvent.clientY - box.top) / box.height
      };
      if (session.raf === 0) session.raf = requestAnimationFrame(flush);
    };
    btn.addEventListener("pointermove", session.onMove);
  }

  function unmount() {
    var session = live;
    if (!session) return;
    live = null;
    btn.removeEventListener("pointermove", session.onMove);
    if (session.raf) cancelAnimationFrame(session.raf);
    session.canvas.style.opacity = "0";
    setTimeout(function () {
      session.fluid.stop();
      session.canvas.remove();
    }, reduced.matches ? 0 : 350);
  }

  function onEnter(event) { mount(event); }
  function onLeave() { unmount(); }
  function onFocus(event) {
    if (event.target !== btn) return;
    if (!btn.matches(":focus-visible")) return;
    mount(null);
  }

  btn.addEventListener("pointerenter", onEnter);
  btn.addEventListener("pointerleave", onLeave);
  btn.addEventListener("focus", onFocus);
  btn.addEventListener("blur", onLeave);

  return function () {
    unmount();
    btn.removeEventListener("pointerenter", onEnter);
    btn.removeEventListener("pointerleave", onLeave);
    btn.removeEventListener("focus", onFocus);
    btn.removeEventListener("blur", onLeave);
  };
}
`;

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Arrakis CTA</title>
<style>
  html, body { margin: 0; min-height: 100%; }
  body {
    display: grid;
    place-items: center;
    background: #0b0907;
    font-family: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
  }
  ${ARRAKIS_CSS}
</style>
</head>
<body>
  <span class="btn-arrakis-root" id="arrakis-root">
    <button type="button" class="btn-arrakis-btn" data-arrakis>
      <span class="btn-arrakis-fx" data-arrakis-fx aria-hidden="true"></span>
      <span class="btn-arrakis-label">Request a demo</span>
    </button>
  </span>
<script>
${FLUID_INLINE}
${ARRAKIS_BOOT}
attachArrakis(document.getElementById("arrakis-root"));
</script>
</body>
</html>
`;

export const ARRAKIS_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef } from "react";

const CSS = ${JSON.stringify(ARRAKIS_CSS)};
${FLUID_INLINE}
${ARRAKIS_BOOT}

export default function ArrakisButton({
  label = "Request a demo",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("btn-arrakis-styles")) {
      const tag = document.createElement("style");
      tag.id = "btn-arrakis-styles";
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    return attachArrakis(rootRef.current);
  }, []);

  return (
    <span className={["btn-arrakis-root", className].filter(Boolean).join(" ")} ref={rootRef}>
      <button
        type="button"
        className="btn-arrakis-btn"
        data-arrakis=""
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        <span className="btn-arrakis-fx" data-arrakis-fx="" aria-hidden="true" />
        <span className="btn-arrakis-label">{label}</span>
      </button>
    </span>
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

export const ARRAKIS_META = {
  id: "arrakis",
  name: "Arrakis CTA",
  blurb: "Cream “Request a demo” plate. Hover dissolves rolling dunes that carve a groove along the cursor.",
  states: "default, hover fluid, leave fade, focus, disabled",
  keywords: [
    "arrakis",
    "arrakis cta",
    "request a demo",
    "demo cta",
    "dune dissolve",
    "rolling dunes",
    "sand groove",
    "cursor carve",
    "cream plate",
    "desert hover",
    "fluid dunes",
    "sand trail",
    "demo button",
    "dune cta",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
