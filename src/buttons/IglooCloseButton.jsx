import { useEffect, useRef } from "react";
import "./igloo-close.css";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const SCRAMBLE_MS = 400;
const SHOW_MS = 250;
const STEPS = 3;
const DISPLACE = 0.055;
const HOLD_MS = 280;
const GAP_MS = 180;

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

function randChar() {
  return CHARS[(Math.random() * CHARS.length) | 0];
}

function hash21(n) {
  const s = Math.sin(n) * 43758.5453;
  return s - Math.floor(s);
}

function Corner({ pos }) {
  return (
    <span className={`btn-igloo-corner btn-igloo-corner--${pos}`}>
      <i className="btn-igloo-arm btn-igloo-arm--h" />
      <i className="btn-igloo-arm btn-igloo-arm--v btn-igloo-arm--v0" />
      <i className="btn-igloo-arm btn-igloo-arm--v btn-igloo-arm--v1" />
      <i className="btn-igloo-arm btn-igloo-arm--v btn-igloo-arm--v2" />
    </span>
  );
}

function scrambleOnce(el, text, reduced, alive) {
  if (!el) return Promise.resolve();
  if (reduced) {
    el.textContent = text;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const t0 = performance.now();
    const tick = (now) => {
      if (!alive()) {
        resolve();
        return;
      }
      const p = Math.min(1, (now - t0) / SCRAMBLE_MS);
      let out = "";
      for (let i = 0; i < text.length; i += 1) {
        const revealAt = (i + 0.35) / (text.length + 0.35);
        out += p >= revealAt || text[i] === " " ? text[i] : randChar();
      }
      el.textContent = out;
      if (p < 1) {
        window.requestAnimationFrame(tick);
        return;
      }
      el.textContent = text;
      resolve();
    };
    window.requestAnimationFrame(tick);
  });
}

function collectParts(btn) {
  return PARTS.map((p) => ({ ...p, el: btn.querySelector(p.sel) })).filter((p) => p.el);
}

function applyStep(parts, step, uRand, width) {
  const seed = step / STEPS + uRand * 3.342;
  for (const p of parts) {
    const g = hash21(p.uv[0] * 19.19 + p.uv[1] * 78.23 + seed) * 2 - 1;
    p.el.style.transform = `translateX(${(g * DISPLACE * width).toFixed(2)}px)`;
  }
}

function resetParts(parts, frame) {
  parts.forEach((p) => {
    p.el.style.transform = "";
  });
  if (frame) frame.style.opacity = "";
}

function glitchOnce(btn, reduced, alive) {
  if (!btn || reduced) return Promise.resolve();
  const frame = btn.querySelector(".btn-igloo-frame");
  const parts = collectParts(btn);
  const t0 = performance.now();
  const uRand = Math.random();
  const width = btn.offsetWidth || 132;
  let lastStep = -1;

  return new Promise((resolve) => {
    const tick = (now) => {
      if (!alive()) {
        resetParts(parts, frame);
        resolve();
        return;
      }
      const uShow = Math.min(1, (now - t0) / SHOW_MS);
      const step = Math.floor(uShow * STEPS);
      if (step !== lastStep && uShow < 1) {
        lastStep = step;
        applyStep(parts, step, uRand, width);
      }
      if (frame) {
        const flick = Math.sin(uShow * 30 + uRand * 12.4242) * 0.15 + 0.85;
        frame.style.opacity = flick.toFixed(3);
      }
      if (uShow < 1) {
        window.requestAnimationFrame(tick);
        return;
      }
      resetParts(parts, frame);
      resolve();
    };
    window.requestAnimationFrame(tick);
  });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function attachIglooClose(btn) {
  if (!btn) return () => {};
  const label = btn.querySelector(".btn-igloo-label");
  const frame = btn.querySelector(".btn-igloo-frame");
  const text = (label?.dataset.text || label?.textContent || "Close").trim();
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  let hovering = false;
  let run = 0;

  function reset() {
    collectParts(btn).forEach((p) => {
      p.el.style.transform = "";
    });
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

  function onEnter() {
    if (btn.disabled) return;
    hovering = true;
    run += 1;
    loop(run);
  }

  function onLeave() {
    hovering = false;
    run += 1;
    if (label) label.textContent = text;
    reset();
  }

  btn.addEventListener("pointerenter", onEnter);
  btn.addEventListener("pointerleave", onLeave);
  btn.addEventListener("focus", onEnter);
  btn.addEventListener("blur", onLeave);

  return () => {
    hovering = false;
    run += 1;
    btn.removeEventListener("pointerenter", onEnter);
    btn.removeEventListener("pointerleave", onLeave);
    btn.removeEventListener("focus", onEnter);
    btn.removeEventListener("blur", onLeave);
    if (label) label.textContent = text;
    reset();
  };
}

export function IglooCloseButton({
  label = "Close",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const btnRef = useRef(null);

  useEffect(() => attachIglooClose(btnRef.current), []);

  return (
    <button
      ref={btnRef}
      type="button"
      className={["btn-igloo-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-igloo-frame" aria-hidden="true">
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />
      </span>
      <span className="btn-igloo-label" data-text={label}>
        {label}
      </span>
    </button>
  );
}

export function IglooClosePreview() {
  return (
    <div className="btn-igloo-root">
      <IglooCloseButton />
    </div>
  );
}
