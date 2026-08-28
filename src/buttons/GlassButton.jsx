import { useEffect, useRef } from "react";
import "./glass.css";

const TRAIL = 16;
const MIN_DIST = 4;
const HEAD = 6.4;
const TAIL = 0.7;
const FADE_MS = 560;

function writeLight(btn, clientX, clientY) {
  const rect = btn.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const nx = rect.width ? (x / rect.width) * 2 - 1 : 0;
  const ny = rect.height ? (y / rect.height) * 2 - 1 : 0;
  btn.style.setProperty("--mx", `${x}px`);
  btn.style.setProperty("--my", `${y}px`);
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
    dot.setAttribute("cx", "0");
    dot.setAttribute("cy", "0");
    group.appendChild(dot);
  }
  return [...group.querySelectorAll("circle")];
}

function paintTrail(dots, points) {
  const n = points.length;
  dots.forEach((dot, i) => {
    const index = i - (TRAIL - n);
    if (index < 0) {
      dot.setAttribute("r", "0");
      return;
    }
    const point = points[index];
    const t = n <= 1 ? 1 : index / (n - 1);
    dot.setAttribute("cx", point.x.toFixed(1));
    dot.setAttribute("cy", point.y.toFixed(1));
    dot.setAttribute("r", (TAIL + (HEAD - TAIL) * t).toFixed(2));
  });
}

export function attachGlass(root) {
  if (!root) return () => {};
  const btn = root.querySelector("[data-glass]") || root;
  if (!btn || btn.tagName !== "BUTTON") return () => {};
  const svg = root.querySelector("[data-glass-trail]");
  const dots = ensureDots(svg);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const points = [];
  let fadeTimer = 0;
  let raf = 0;

  function draw() {
    raf = 0;
    paintTrail(dots, points);
  }

  function queue() {
    if (!raf) raf = window.requestAnimationFrame(draw);
  }

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
    const { x, y } = writeLight(btn, event.clientX, event.clientY);
    sample(x, y);
  }

  function onEnter(event) {
    if (btn.disabled) return;
    window.clearTimeout(fadeTimer);
    points.length = 0;
    paintTrail(dots, points);
    btn.classList.remove("is-leaving");
    btn.classList.add("is-lit");
    if (!reduced.matches && event.clientX != null) {
      const { x, y } = writeLight(btn, event.clientX, event.clientY);
      sample(x, y);
    }
  }

  function onLeave() {
    btn.classList.remove("is-pressed", "is-lit");
    if (reduced.matches) {
      points.length = 0;
      paintTrail(dots, points);
      return;
    }
    btn.classList.add("is-leaving");
    window.clearTimeout(fadeTimer);
    fadeTimer = window.setTimeout(() => {
      points.length = 0;
      paintTrail(dots, points);
      btn.classList.remove("is-leaving");
    }, FADE_MS);
  }

  function onDown(event) {
    if (btn.disabled) return;
    btn.classList.add("is-pressed");
    if (!reduced.matches && event.clientX != null) {
      writeLight(btn, event.clientX, event.clientY);
    }
  }

  function onUp() {
    btn.classList.remove("is-pressed");
  }

  function onKeyDown(event) {
    if (btn.disabled) return;
    if (event.key === " " || event.key === "Enter") {
      btn.classList.add("is-pressed", "is-lit");
    }
  }

  function onKeyUp(event) {
    if (event.key === " " || event.key === "Enter") {
      btn.classList.remove("is-pressed");
    }
  }

  btn.addEventListener("pointerenter", onEnter);
  btn.addEventListener("pointermove", onMove);
  btn.addEventListener("pointerleave", onLeave);
  btn.addEventListener("pointerdown", onDown);
  btn.addEventListener("pointerup", onUp);
  btn.addEventListener("pointercancel", onUp);
  btn.addEventListener("keydown", onKeyDown);
  btn.addEventListener("keyup", onKeyUp);
  btn.addEventListener("blur", onLeave);

  return () => {
    window.clearTimeout(fadeTimer);
    if (raf) window.cancelAnimationFrame(raf);
    btn.classList.remove("is-lit", "is-pressed", "is-leaving");
    points.length = 0;
    paintTrail(dots, points);
    btn.removeEventListener("pointerenter", onEnter);
    btn.removeEventListener("pointermove", onMove);
    btn.removeEventListener("pointerleave", onLeave);
    btn.removeEventListener("pointerdown", onDown);
    btn.removeEventListener("pointerup", onUp);
    btn.removeEventListener("pointercancel", onUp);
    btn.removeEventListener("keydown", onKeyDown);
    btn.removeEventListener("keyup", onKeyUp);
    btn.removeEventListener("blur", onLeave);
  };
}

export function GlassButton({
  label = "Continue",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const rootRef = useRef(null);

  useEffect(() => attachGlass(rootRef.current), []);

  return (
    <span className={["btn-glass-root", className].filter(Boolean).join(" ")} ref={rootRef}>
      <span className="btn-glass-field" aria-hidden="true" />
      <button
        type="button"
        className="btn-glass-btn"
        data-glass=""
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        <span className="btn-glass-plate" aria-hidden="true" />
        <span className="btn-glass-rim" aria-hidden="true" />
        <svg className="btn-glass-trail" data-glass-trail="" aria-hidden="true">
          <defs>
            <filter id="btn-glass-goo" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        <span className="btn-glass-label">{label}</span>
      </button>
    </span>
  );
}

export function GlassPreview() {
  return <GlassButton />;
}
