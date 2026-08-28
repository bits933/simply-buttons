import { useEffect, useRef } from "react";
import "./tracker.css";

const ENTER = 72;
const EXIT = 104;
const SPAN = 42;
const ARM = 14;
const GAP = 10;
const GAP_PRESS = 5;
const DOT = 5;

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function distToRect(px, py, rect) {
  const dx = Math.max(rect.left - px, 0, px - rect.right);
  const dy = Math.max(rect.top - py, 0, py - rect.bottom);
  return Math.hypot(dx, dy);
}

export function attachTracker(root) {
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
  let inside = false;
  let pressed = false;
  let locked = false;
  let raf = 0;

  function local(event) {
    const r = root.getBoundingClientRect();
    mouse.x = event.clientX - r.left;
    mouse.y = event.clientY - r.top;
  }

  function restRect() {
    return {
      left: btn.offsetLeft,
      top: btn.offsetTop,
      right: btn.offsetLeft + btn.offsetWidth,
      bottom: btn.offsetTop + btn.offsetHeight,
    };
  }

  function visualRect() {
    const rr = root.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    return {
      left: br.left - rr.left,
      top: br.top - rr.top,
      right: br.right - rr.left,
      bottom: br.bottom - rr.top,
    };
  }

  function snap() {
    for (const c of corners) {
      c.x = mouse.x + (c.sx * SPAN) / 2;
      c.y = mouse.y + (c.sy * SPAN) / 2;
    }
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
    raf = window.requestAnimationFrame(frame);
    if (!inside || btn.disabled) {
      if (locked) resetPull();
      return;
    }

    const rest = restRect();
    const d = distToRect(mouse.x, mouse.y, rest);
    if (!locked && d < ENTER) locked = true;
    else if (locked && d > EXIT) locked = false;

    btn.style.setProperty("--press", locked && pressed ? "0.97" : "1");

    const gap = locked && pressed ? GAP_PRESS : GAP;
    const vis = visualRect();
    const k = reducedMq.matches ? 1 : locked ? 0.2 : 0.16;
    for (const c of corners) {
      const cx = locked
        ? c.sx < 0
          ? vis.left - gap
          : vis.right + gap
        : mouse.x + (c.sx * SPAN) / 2;
      const cy = locked
        ? c.sy < 0
          ? vis.top - gap
          : vis.bottom + gap
        : mouse.y + (c.sy * SPAN) / 2;
      c.x = lerp(c.x, cx, k);
      c.y = lerp(c.y, cy, k);
      c.el.style.transform = `translate3d(${(c.x - (c.sx > 0 ? ARM : 0)).toFixed(2)}px,${(
        c.y - (c.sy > 0 ? ARM : 0)
      ).toFixed(2)}px,0)`;
    }

    const dk = reducedMq.matches ? 1 : 0.42;
    dotS.x = lerp(dotS.x, mouse.x, dk);
    dotS.y = lerp(dotS.y, mouse.y, dk);
    dot.style.transform = `translate3d(${(dotS.x - DOT).toFixed(2)}px,${(dotS.y - DOT).toFixed(2)}px,0)`;
    dot.classList.toggle("is-hidden", locked);
  }

  function onEnter(event) {
    if (event.pointerType === "touch") return;
    local(event);
    inside = true;
    snap();
    root.classList.add("is-live");
  }

  function onMove(event) {
    if (event.pointerType === "touch") return;
    local(event);
  }

  function onLeave() {
    inside = false;
    root.classList.remove("is-live");
    resetPull();
  }

  function onDown(event) {
    if (btn.disabled) return;
    if (event.target === btn || btn.contains(event.target)) setPressed(true);
  }

  function onUp() {
    setPressed(false);
  }

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

export function TrackerButton({
  label = "Button",
  disabled = false,
  className = "",
  ...rest
}) {
  const rootRef = useRef(null);

  useEffect(() => attachTracker(rootRef.current), []);

  return (
    <div
      ref={rootRef}
      className={["btn-track-root", className].filter(Boolean).join(" ")}
    >
      <button
        type="button"
        className="btn-track-btn"
        data-tracker
        disabled={disabled}
        {...rest}
      >
        <span className="btn-track-label">{label}</span>
      </button>
      <span className="btn-track-corner btn-track-corner--tl" aria-hidden="true" />
      <span className="btn-track-corner btn-track-corner--tr" aria-hidden="true" />
      <span className="btn-track-corner btn-track-corner--bl" aria-hidden="true" />
      <span className="btn-track-corner btn-track-corner--br" aria-hidden="true" />
      <span className="btn-track-dot" aria-hidden="true" />
    </div>
  );
}

export function TrackerPreview() {
  return <TrackerButton />;
}
