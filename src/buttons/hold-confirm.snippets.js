const HOLD_CSS = `
.btn-hold-wrap {
  --hold-face: #171717;
  --hold-bar: #f5f5f5;
  --hold-stroke: rgba(23, 23, 23, 0.1);
  --hold-focus: #171717;
  --hold-success-bg: #d1fae5;
  --hold-success-ink: #065f46;
  --hold-ease: cubic-bezier(0.22, 1, 0.36, 1);
  position: relative;
  display: inline-flex;
}
.btn-hold-btn {
  --hold: 0%;
  appearance: none;
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 190px;
  min-height: 44px;
  padding: 0 20px;
  border: 1px solid var(--hold-stroke);
  border-radius: 8px;
  background: var(--hold-face);
  color: #fff;
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  touch-action: none;
  -webkit-touch-callout: none;
  transition:
    background-color 320ms var(--hold-ease),
    border-color 320ms var(--hold-ease),
    filter 120ms cubic-bezier(0, 0, 0.2, 1),
    transform 120ms cubic-bezier(0, 0, 0.2, 1);
}
.btn-hold-btn *, .btn-hold-btn *::before, .btn-hold-btn *::after { box-sizing: border-box; }
.btn-hold-btn.is-holding { transform: scale(0.985); cursor: progress; }
.btn-hold-btn.is-done {
  background: var(--hold-success-bg);
  border-color: rgba(6, 95, 70, 0.22);
  animation: btn-hold-pop 420ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-hold-bar {
  position: absolute; inset: 0 auto 0 0; z-index: 0;
  width: var(--hold); background: var(--hold-bar);
  border-radius: 7px 0 0 7px; pointer-events: none;
  transition: opacity 240ms var(--hold-ease);
}
.btn-hold-bar::after {
  content: ""; position: absolute; top: 0; bottom: 0; right: -2px; width: 16px;
  background: linear-gradient(90deg, transparent, rgba(23, 23, 23, 0.22));
  opacity: 0; transition: opacity 180ms var(--hold-ease);
}
.btn-hold-btn.is-holding .btn-hold-bar::after { opacity: 1; }
.btn-hold-btn.is-done .btn-hold-bar { opacity: 0; }
.btn-hold-btn.is-draining .btn-hold-bar {
  transition: opacity 240ms var(--hold-ease), width 240ms var(--hold-ease);
}
.btn-hold-label {
  position: relative; z-index: 1;
  display: grid; place-items: center; min-height: 1.15em;
  mix-blend-mode: difference; white-space: nowrap;
}
.btn-hold-word {
  grid-area: 1 / 1;
  display: inline-flex; align-items: center; gap: 6px;
  transition: opacity 260ms var(--hold-ease), transform 320ms var(--hold-ease);
}
.btn-hold-word--done { opacity: 0; transform: translateY(8px) scale(0.92); }
.btn-hold-btn.is-done .btn-hold-label { mix-blend-mode: normal; color: var(--hold-success-ink); }
.btn-hold-btn.is-done .btn-hold-word--idle { opacity: 0; transform: translateY(-8px); }
.btn-hold-btn.is-done .btn-hold-word--done { opacity: 1; transform: none; }
.btn-hold-check { width: 13px; height: 13px; flex: 0 0 auto; }
.btn-hold-check path {
  fill: none; stroke: currentColor; stroke-width: 2.4;
  stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 21; stroke-dashoffset: 0;
}
.btn-hold-btn.is-done .btn-hold-check path {
  stroke-dashoffset: 21;
  animation: btn-hold-draw 340ms 130ms var(--hold-ease) forwards;
}
.btn-hold-confetti { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
.btn-hold-confetti i {
  position: absolute; left: 50%; top: 50%;
  width: var(--pw, 4px); height: var(--ph, 4px);
  background: var(--pcolor, #22c55e); border-radius: var(--shp, 999px); opacity: 0;
}
.btn-hold-wrap.is-bursting .btn-hold-confetti i {
  animation: btn-hold-confetti var(--cdur, 720ms) cubic-bezier(0.16, 1, 0.3, 1) var(--cdelay, 0ms) forwards;
}
.btn-hold-btn:focus { outline: none; }
.btn-hold-btn:focus-visible { outline: 2px solid rgba(23, 23, 23, 0.1); outline-offset: 3px; }
.btn-hold-btn:hover:not(:disabled):not(.is-done) { filter: brightness(1.08); }
.btn-hold-btn:active:not(:disabled):not(.is-holding):not(.is-done) { transform: scale(0.98); }
.btn-hold-btn:disabled { cursor: not-allowed; opacity: 0.42; }
@keyframes btn-hold-pop { 0% { transform: scale(0.985); } 45% { transform: scale(1.035); } 100% { transform: scale(1); } }
@keyframes btn-hold-draw { to { stroke-dashoffset: 0; } }
@keyframes btn-hold-confetti {
  0% { opacity: 0; transform: translate(-50%, -50%) rotate(0deg) scale(0.4); }
  14% { opacity: 1; }
  62% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(-50% + var(--tx, 0px)), calc(-50% + var(--ty, -20px))) rotate(var(--rot, 180deg)) scale(0.85); }
}
@media (prefers-reduced-motion: reduce) {
  .btn-hold-btn, .btn-hold-bar, .btn-hold-bar::after, .btn-hold-word { transition: none; }
  .btn-hold-btn.is-done, .btn-hold-btn.is-done .btn-hold-check path, .btn-hold-confetti i { animation: none; }
  .btn-hold-btn.is-done .btn-hold-check path { stroke-dashoffset: 0; }
  .btn-hold-confetti i { display: none; }
}
`.trim();

const HOLD_MARKUP = `
<span class="btn-hold-wrap" data-hold="850" data-reset="2600">
  <button class="btn-hold-btn" type="button" aria-label="Hold to confirm">
    <span class="btn-hold-bar" aria-hidden="true"></span>
    <span class="btn-hold-label" aria-hidden="true">
      <span class="btn-hold-word btn-hold-word--idle">Hold to confirm</span>
      <span class="btn-hold-word btn-hold-word--done">
        <svg class="btn-hold-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M4.5 12.5l5 5 10-11" />
        </svg>
        Confirmed
      </span>
    </span>
  </button>
  <span class="btn-hold-confetti" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
</span>
`.trim();

const HOLD_SCRIPT = `
(function () {
  var COLORS = ["#22c55e", "#4ade80", "#86efac", "#d4d4d8", "#a3a3a3"];
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function sprinkle(root) {
    root.querySelectorAll(".btn-hold-confetti i").forEach(function (piece, i) {
      var angle = (Math.PI * 2 * i) / 14 + (Math.random() - 0.5) * 0.9;
      var dist = 26 + Math.random() * 44;
      piece.style.setProperty("--tx", Math.cos(angle) * dist + "px");
      piece.style.setProperty("--ty", Math.sin(angle) * dist - 6 + "px");
      piece.style.setProperty("--rot", Math.round((Math.random() - 0.5) * 540) + "deg");
      piece.style.setProperty("--pw", (3 + Math.random() * 3.5).toFixed(1) + "px");
      piece.style.setProperty("--ph", (3 + Math.random() * 4).toFixed(1) + "px");
      piece.style.setProperty("--pcolor", COLORS[i % COLORS.length]);
      piece.style.setProperty("--shp", Math.random() > 0.5 ? "999px" : "1.5px");
      piece.style.setProperty("--cdur", Math.round(520 + Math.random() * 360) + "ms");
      piece.style.setProperty("--cdelay", Math.round(Math.random() * 90) + "ms");
    });
  }

  document.querySelectorAll(".btn-hold-wrap").forEach(function (wrap) {
    var button = wrap.querySelector(".btn-hold-btn");
    var holdMs = Number(wrap.getAttribute("data-hold") || 850);
    var resetMs = Number(wrap.getAttribute("data-reset") || 2600);
    var raf = 0, resetTimer = 0, burstTimer = 0;
    var t0 = 0, startFill = 0, phase = "idle";

    function setFill(value) {
      button.style.setProperty("--hold", value + "%");
    }

    function complete() {
      window.clearTimeout(resetTimer);
      cancelAnimationFrame(raf);
      setFill(100);
      phase = "done";
      button.classList.remove("is-holding", "is-draining");
      button.classList.add("is-done");
      button.setAttribute("aria-pressed", "true");
      if (!reduced) {
        sprinkle(wrap);
        wrap.classList.remove("is-bursting");
        void wrap.offsetWidth;
        wrap.classList.add("is-bursting");
        window.clearTimeout(burstTimer);
        burstTimer = window.setTimeout(function () {
          wrap.classList.remove("is-bursting");
        }, 1000);
      }
      resetTimer = window.setTimeout(function () {
        phase = "idle";
        button.classList.remove("is-done");
        button.removeAttribute("aria-pressed");
        setFill(0);
      }, resetMs);
    }

    function beginHold() {
      if (button.disabled || phase === "done") return;
      window.clearTimeout(resetTimer);
      phase = "holding";
      button.classList.remove("is-draining");
      button.classList.add("is-holding");
      startFill = 0;
      t0 = performance.now();
      cancelAnimationFrame(raf);
      function tick(now) {
        var next = Math.min(100, startFill + ((now - t0) / holdMs) * 100);
        setFill(next);
        if (next >= 100) { complete(); return; }
        raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }

    function endHold() {
      if (phase !== "holding") return;
      cancelAnimationFrame(raf);
      phase = "idle";
      button.classList.remove("is-holding");
      button.classList.add("is-draining");
      setFill(0);
    }

    button.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      try { button.setPointerCapture(event.pointerId); } catch (e) {}
      beginHold();
    });
    button.addEventListener("pointerup", endHold);
    button.addEventListener("pointercancel", endHold);
    button.addEventListener("keydown", function (event) {
      if ((event.key === " " || event.key === "Enter") && !event.repeat) {
        event.preventDefault();
        beginHold();
      }
    });
    button.addEventListener("keyup", function (event) {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        endHold();
      }
    });
    button.addEventListener("blur", endHold);
    button.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  });
})();
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hold to confirm</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #eef0f3; }
    ${HOLD_CSS}
  </style>
</head>
<body>
  ${HOLD_MARKUP}
  <script>
    ${HOLD_SCRIPT}
  </script>
</body>
</html>
`;

export const HOLD_CONFIRM_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef, useState } from "react";

const HOLD_CSS = ${JSON.stringify(HOLD_CSS)};
const PIECES = 14;
const BURST_MS = 1000;
const COLORS = ["#22c55e", "#4ade80", "#86efac", "#d4d4d8", "#a3a3a3"];

function sprinkle(root) {
  if (!root) return;
  root.querySelectorAll("i").forEach((piece, i) => {
    const angle = (Math.PI * 2 * i) / PIECES + (Math.random() - 0.5) * 0.9;
    const dist = 26 + Math.random() * 44;
    piece.style.setProperty("--tx", \`\${Math.cos(angle) * dist}px\`);
    piece.style.setProperty("--ty", \`\${Math.sin(angle) * dist - 6}px\`);
    piece.style.setProperty("--rot", \`\${Math.round((Math.random() - 0.5) * 540)}deg\`);
    piece.style.setProperty("--pw", \`\${(3 + Math.random() * 3.5).toFixed(1)}px\`);
    piece.style.setProperty("--ph", \`\${(3 + Math.random() * 4).toFixed(1)}px\`);
    piece.style.setProperty("--pcolor", COLORS[i % COLORS.length]);
    piece.style.setProperty("--shp", Math.random() > 0.5 ? "999px" : "1.5px");
    piece.style.setProperty("--cdur", \`\${520 + Math.round(Math.random() * 360)}ms\`);
    piece.style.setProperty("--cdelay", \`\${Math.round(Math.random() * 90)}ms\`);
  });
}

export default function HoldConfirmButton({
  label = "Hold to confirm",
  successLabel = "Confirmed",
  holdMs = 850,
  resetMs = 2600,
  disabled = false,
  onConfirm,
}) {
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [fill, setFill] = useState(0);
  const [draining, setDraining] = useState(false);
  const [bursting, setBursting] = useState(false);
  const confettiRef = useRef(null);
  const rafRef = useRef(0);
  const resetTimer = useRef(0);
  const burstTimer = useRef(0);
  const t0Ref = useRef(0);
  const startFillRef = useRef(0);
  const phaseRef = useRef("idle");
  const stylesReady = useRef(false);

  if (typeof document !== "undefined" && !stylesReady.current) {
    if (!document.getElementById("btn-hold-styles")) {
      const tag = document.createElement("style");
      tag.id = "btn-hold-styles";
      tag.textContent = HOLD_CSS;
      document.head.appendChild(tag);
    }
    stylesReady.current = true;
  }

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(resetTimer.current);
      window.clearTimeout(burstTimer.current);
    },
    [],
  );

  function complete() {
    window.cancelAnimationFrame(rafRef.current);
    setFill(100);
    setDraining(false);
    setPhase("done");
    onConfirm?.();
    if (!reduced) {
      sprinkle(confettiRef.current);
      setBursting(true);
      window.clearTimeout(burstTimer.current);
      burstTimer.current = window.setTimeout(() => setBursting(false), BURST_MS);
    }
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setPhase("idle");
      setFill(0);
    }, resetMs);
  }

  function beginHold() {
    if (disabled || phaseRef.current === "done") return;
    window.clearTimeout(resetTimer.current);
    setPhase("holding");
    setDraining(false);
    startFillRef.current = 0;
    t0Ref.current = performance.now();
    window.cancelAnimationFrame(rafRef.current);
    const tick = (now) => {
      const next = Math.min(100, startFillRef.current + ((now - t0Ref.current) / holdMs) * 100);
      setFill(next);
      if (next >= 100) { complete(); return; }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
  }

  function endHold() {
    if (phaseRef.current !== "holding") return;
    window.cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    setDraining(true);
    setFill(0);
  }

  function handlePointerDown(event) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch (e) {}
    beginHold();
  }

  function handleKeyDown(event) {
    if ((event.key === " " || event.key === "Enter") && !event.repeat) {
      event.preventDefault();
      beginHold();
    }
  }

  function handleKeyUp(event) {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      endHold();
    }
  }

  return (
    <span className={"btn-hold-wrap" + (bursting ? " is-bursting" : "")}>
      <button
        type="button"
        className={
          "btn-hold-btn" +
          (phase === "holding" ? " is-holding" : "") +
          (phase === "done" ? " is-done" : "") +
          (draining ? " is-draining" : "")
        }
        style={{ "--hold": \`\${fill}%\` }}
        disabled={disabled}
        aria-pressed={phase === "done" || undefined}
        aria-busy={phase === "holding" || undefined}
        aria-label={phase === "done" ? successLabel : label}
        onPointerDown={handlePointerDown}
        onPointerUp={endHold}
        onPointerCancel={endHold}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={endHold}
        onContextMenu={(event) => event.preventDefault()}
      >
        <span className="btn-hold-bar" aria-hidden="true" />
        <span className="btn-hold-label" aria-hidden="true">
          <span className="btn-hold-word btn-hold-word--idle">{label}</span>
          <span className="btn-hold-word btn-hold-word--done">
            <svg className="btn-hold-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4.5 12.5l5 5 10-11" />
            </svg>
            {successLabel}
          </span>
        </span>
      </button>
      <span className="btn-hold-confetti" ref={confettiRef} aria-hidden="true">
        {Array.from({ length: PIECES }, (_, i) => <i key={i} />)}
      </span>
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

export const HOLD_CONFIRM_META = {
  id: "hold-confirm",
  name: "Hold confirm",
  blurb: "Press and hold fills left to right; release early drains it back, full hold flips to green with confetti.",
  states: "idle, holding, draining, done, focus, disabled",
  keywords: [
    "hold confirm",
    "cta",
    "hold",
    "confirm",
    "press and hold",
    "fill",
    "confetti",
    "destructive",
    "long press",
    "drain",
    "progress hold",
    "green success",
    "hover",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
