const FILL_LOAD_CSS = `
.btn-fill-btn {
  --fill-face: #171717;
  --fill-bar: #f5f5f5;
  --fill-stroke: color-mix(in srgb, var(--fill-face) 10%, transparent);
  --fill-focus: #171717;
  --fill-ease: cubic-bezier(0.338, 0.015, 0.395, 0.959);
  --fill-stagger: 45ms;
  --fill-roll: 320ms;
  --fill: 0%;
  appearance: none;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 168px;
  min-height: 44px;
  padding: 0 20px;
  border: 1px solid var(--fill-stroke);
  border-radius: 8px;
  background: var(--fill-face);
  background-clip: padding-box;
  color: #fff;
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1;
  cursor: pointer;
  transition: filter 120ms cubic-bezier(0, 0, 0.2, 1), transform 90ms cubic-bezier(0, 0, 0.2, 1);
}
.btn-fill-btn *,
.btn-fill-btn *::before,
.btn-fill-btn *::after { box-sizing: border-box; }
.btn-fill-bar {
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 0;
  width: var(--fill);
  background: var(--fill-bar);
  pointer-events: none;
  opacity: 0;
  border-start-start-radius: inherit;
  border-end-start-radius: inherit;
}
.btn-fill-btn.is-loading .btn-fill-bar { opacity: 1; }
.btn-fill-label {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 1.15em;
  color: #fff;
  mix-blend-mode: difference;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.btn-fill-window {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 9.6em;
  height: 1.15em;
  overflow: hidden;
}
.btn-fill-line {
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-fill-char {
  overflow: hidden;
  height: 1.15em;
  line-height: 1.15em;
}
.btn-fill-char.is-space { width: 0.32em; }
.btn-fill-glyph {
  display: block;
  transform: translateY(0);
  transition: transform var(--fill-roll) var(--fill-ease);
  transition-delay: calc(var(--i, 0) * var(--fill-stagger));
}
.btn-fill-line--in .btn-fill-glyph { transform: translateY(100%); }
.btn-fill-btn.is-exiting .btn-fill-line--out .btn-fill-glyph { transform: translateY(-100%); }
.btn-fill-btn.is-entering .btn-fill-line--in .btn-fill-glyph { transform: translateY(0); }
.btn-fill-btn:focus { outline: none; }
.btn-fill-btn:focus-visible { outline: 2px solid var(--fill-focus); outline-offset: 3px; }
.btn-fill-btn:hover:not(:disabled) { filter: brightness(1.08); }
.btn-fill-btn:active:not(:disabled):not([aria-busy="true"]) { transform: scale(0.98); }
.btn-fill-btn:disabled:not([aria-busy="true"]) { cursor: not-allowed; opacity: 0.42; }
.btn-fill-btn[aria-busy="true"] { cursor: progress; }
@media (prefers-reduced-motion: reduce) {
  .btn-fill-btn, .btn-fill-glyph { transition: none; }
  .btn-fill-btn:active:not(:disabled) { transform: none; }
}
`.trim();

const FILL_LOAD_SCRIPT = `
(function () {
  var STAGGER = 45;
  var ROLL = 320;
  var DURATION = 2400;
  var HOLD = 600;
  var IDLE = "Get started";
  var START = "0%";

  function sCurve(t) {
    var x = Math.min(1, Math.max(0, t));
    return x * x * x * (x * (x * 6 - 15) + 10);
  }

  function rollMs(length) {
    return Math.max(0, length - 1) * STAGGER + ROLL;
  }

  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function line(text, incoming) {
    var row = document.createElement("span");
    row.className = incoming ? "btn-fill-line btn-fill-line--in" : "btn-fill-line btn-fill-line--out";
    Array.from(text).forEach(function (char, i) {
      var cell = document.createElement("span");
      cell.className = char === " " ? "btn-fill-char is-space" : "btn-fill-char";
      var glyph = document.createElement("span");
      glyph.className = "btn-fill-glyph";
      glyph.style.setProperty("--i", String(i));
      glyph.textContent = char === " " ? "\\u00a0" : char;
      cell.appendChild(glyph);
      row.appendChild(cell);
    });
    return row;
  }

  function mountLine(label, text, incoming) {
    var windowEl = document.createElement("span");
    windowEl.className = "btn-fill-window";
    windowEl.appendChild(line(text, incoming));
    label.replaceChildren(windowEl);
  }

  function attach(button) {
    var label = button.querySelector("[data-fill-label]");
    var busy = false;
    var raf = 0;
    var timers = [];

    function clearTimers() {
      window.cancelAnimationFrame(raf);
      timers.forEach(function (id) { window.clearTimeout(id); });
      timers = [];
    }

    function setFill(n) {
      button.style.setProperty("--fill", n + "%");
    }

    function setBusy(next) {
      busy = next;
      button.disabled = next;
      if (next) button.setAttribute("aria-busy", "true");
      else button.removeAttribute("aria-busy");
    }

    function reset() {
      clearTimers();
      setFill(0);
      setBusy(false);
      button.classList.remove("is-exiting", "is-entering", "is-loading");
      button.setAttribute("aria-label", IDLE);
      label.textContent = IDLE;
    }

    function startLoad() {
      button.classList.remove("is-exiting", "is-entering");
      button.classList.add("is-loading");
      label.textContent = "0%";
      setFill(0);
      var t0 = performance.now();
      var skipCurve = reduced();

      function tick(now) {
        var linear = Math.min(1, (now - t0) / DURATION);
        var eased = skipCurve ? linear : sCurve(linear);
        var n = Math.round(eased * 100);
        setFill(n);
        label.textContent = n + "%";
        button.setAttribute("aria-label", n + " percent");
        if (linear < 1) {
          raf = window.requestAnimationFrame(tick);
          return;
        }
        setFill(100);
        label.textContent = "100%";
        button.setAttribute("aria-label", "100 percent");
        timers.push(window.setTimeout(reset, HOLD));
      }

      raf = window.requestAnimationFrame(tick);
    }

    function startEnter() {
      button.classList.remove("is-exiting");
      mountLine(label, START, true);
      window.requestAnimationFrame(function () {
        button.classList.add("is-entering");
      });
      timers.push(window.setTimeout(startLoad, rollMs(START.length)));
    }

    function startExit() {
      mountLine(label, IDLE, false);
      window.requestAnimationFrame(function () {
        button.classList.add("is-exiting");
      });
      timers.push(window.setTimeout(startEnter, rollMs(IDLE.length)));
    }

    button.addEventListener("click", function () {
      if (busy) return;
      setBusy(true);
      setFill(0);
      if (reduced()) startLoad();
      else startExit();
    });
  }

  document.querySelectorAll(".btn-fill-btn").forEach(attach);
})();
`.trim();

const FILL_LOAD_MARKUP = `
<button class="btn-fill-btn" type="button" aria-label="Get started">
  <span class="btn-fill-bar" aria-hidden="true"></span>
  <span class="btn-fill-label" data-fill-label aria-hidden="true">Get started</span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fill load</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #eef0f3; }
    ${FILL_LOAD_CSS}
  </style>
</head>
<body>
  ${FILL_LOAD_MARKUP}
  <script>
    ${FILL_LOAD_SCRIPT}
  </script>
</body>
</html>
`;

export const FILL_LOAD_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef, useState } from "react";

const FILL_LOAD_CSS = ${JSON.stringify(FILL_LOAD_CSS)};
const STAGGER_MS = 45;
const ROLL_MS = 320;
const IDLE_LABEL = "Get started";
const START_COUNT = "0%";

function sCurve(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function rollMs(length) {
  return Math.max(0, length - 1) * STAGGER_MS + ROLL_MS;
}

function CharLine({ text, incoming }) {
  return (
    <span className={incoming ? "btn-fill-line btn-fill-line--in" : "btn-fill-line btn-fill-line--out"}>
      {Array.from(text).map((char, i) => (
        <span key={(incoming ? "in-" : "out-") + i} className={char === " " ? "btn-fill-char is-space" : "btn-fill-char"}>
          <span className="btn-fill-glyph" style={{ "--i": i }}>
            {char === " " ? "\\u00a0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function FillLoadButton({
  label = IDLE_LABEL,
  durationMs = 2400,
  holdMs = 600,
  disabled = false,
}) {
  const [phase, setPhase] = useState("rest");
  const [armed, setArmed] = useState(false);
  const [percent, setPercent] = useState(0);
  const btnRef = useRef(null);
  const rafRef = useRef(0);
  const timersRef = useRef([]);

  useEffect(() => {
    if (document.getElementById("btn-fill-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-fill-styles";
    tag.textContent = FILL_LOAD_CSS;
    document.head.appendChild(tag);
  }, []);

  function clearTimers() {
    window.cancelAnimationFrame(rafRef.current);
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (phase !== "exiting" && phase !== "entering") {
      setArmed(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => setArmed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  function reduced() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function writeFill(next) {
    if (btnRef.current) btnRef.current.style.setProperty("--fill", next + "%");
    setPercent(next);
  }

  function reset() {
    clearTimers();
    writeFill(0);
    setPhase("rest");
    setArmed(false);
  }

  function startLoad() {
    setPhase("loading");
    writeFill(0);
    const t0 = performance.now();
    const skipCurve = reduced();
    const tick = (now) => {
      const linear = Math.min(1, (now - t0) / durationMs);
      const eased = skipCurve ? linear : sCurve(linear);
      writeFill(Math.round(eased * 100));
      if (linear < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }
      writeFill(100);
      setPhase("done");
      timersRef.current.push(window.setTimeout(reset, holdMs));
    };
    rafRef.current = window.requestAnimationFrame(tick);
  }

  function handleClick() {
    if (disabled || phase !== "rest") return;
    writeFill(0);
    if (reduced()) {
      startLoad();
      return;
    }
    setPhase("exiting");
    const enter = window.setTimeout(function () {
      setPhase("entering");
      timersRef.current.push(window.setTimeout(startLoad, rollMs(START_COUNT.length)));
    }, rollMs(label.length));
    timersRef.current.push(enter);
  }

  const busy = phase !== "rest";
  const exiting = phase === "exiting";
  const entering = phase === "entering";
  const loading = phase === "loading" || phase === "done";

  return (
    <button
      ref={btnRef}
      type="button"
      className={
        "btn-fill-btn" +
        (exiting && armed ? " is-exiting" : "") +
        (entering && armed ? " is-entering" : "") +
        (loading ? " is-loading" : "")
      }
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      aria-label={phase === "rest" || phase === "exiting" ? label : percent + " percent"}
      onClick={handleClick}
    >
      <span className="btn-fill-bar" aria-hidden="true" />
      <span className="btn-fill-label" aria-hidden="true">
        {exiting ? (
          <span className="btn-fill-window">
            <CharLine text={label} />
          </span>
        ) : entering ? (
          <span className="btn-fill-window">
            <CharLine text={START_COUNT} incoming />
          </span>
        ) : phase === "rest" ? (
          label
        ) : (
          percent + "%"
        )}
      </span>
    </button>
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

export const FILL_LOAD_META = {
  id: "fill-load",
  name: "Fill load",
  blurb: "Determinate fill and a live percent after click.",
  states: "default, hover, focus, active, loading, disabled",
  keywords: [
    "fill load",
    "loader",
    "fill",
    "percent",
    "progress",
    "determinate",
    "spinner",
    "loading",
    "progress bar",
    "live percent",
    "download progress",
    "hover",
    "busy",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
