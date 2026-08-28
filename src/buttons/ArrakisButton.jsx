import { useEffect, useRef } from "react";
import { createArrakisFluid } from "./arrakis-fluid.js";
import "./arrakis.css";

function unitDir(event, rect) {
  if (!event || event.clientX == null) return { dirX: -1, dirY: 0 };
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = rect.top + rect.height / 2 - event.clientY;
  const len = Math.hypot(dx, dy);
  if (len < 1) return { dirX: -1, dirY: 0 };
  return { dirX: dx / len, dirY: dy / len };
}

export function attachArrakis(root) {
  if (!root) return () => {};
  const btn = root.querySelector("[data-arrakis]") || root;
  const fx = root.querySelector("[data-arrakis-fx]");
  if (!btn || btn.tagName !== "BUTTON" || !fx) return () => {};

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let live = null;

  function mount(event) {
    if (live || btn.disabled || reduced.matches) return;

    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    fx.appendChild(canvas);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = fx.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const fluid = createArrakisFluid(canvas);
    if (!fluid) {
      canvas.remove();
      return;
    }

    window.requestAnimationFrame(() => {
      canvas.style.opacity = "1";
    });

    const dir = unitDir(event, rect);
    fluid.start({ dirX: dir.dirX, dirY: dir.dirY, tone: 0 });

    const session = { canvas, fluid, raf: 0, pending: null, onMove: null };
    live = session;

    const flush = () => {
      session.raf = 0;
      if (session.pending) {
        session.fluid.trail(session.pending.x, session.pending.y);
        session.pending = null;
      }
    };

    session.onMove = (moveEvent) => {
      const box = fx.getBoundingClientRect();
      if (!box.width || !box.height) return;
      session.pending = {
        x: (moveEvent.clientX - box.left) / box.width,
        y: 1 - (moveEvent.clientY - box.top) / box.height,
      };
      if (session.raf === 0) session.raf = window.requestAnimationFrame(flush);
    };

    btn.addEventListener("pointermove", session.onMove);
  }

  function unmount() {
    const session = live;
    if (!session) return;
    live = null;
    btn.removeEventListener("pointermove", session.onMove);
    if (session.raf) window.cancelAnimationFrame(session.raf);
    session.canvas.style.opacity = "0";
    window.setTimeout(() => {
      session.fluid.stop();
      session.canvas.remove();
    }, reduced.matches ? 0 : 350);
  }

  function onEnter(event) {
    mount(event);
  }

  function onLeave() {
    unmount();
  }

  function onFocus(event) {
    if (event.target !== btn) return;
    if (!btn.matches(":focus-visible")) return;
    mount(null);
  }

  btn.addEventListener("pointerenter", onEnter);
  btn.addEventListener("pointerleave", onLeave);
  btn.addEventListener("focus", onFocus);
  btn.addEventListener("blur", onLeave);

  return () => {
    unmount();
    btn.removeEventListener("pointerenter", onEnter);
    btn.removeEventListener("pointerleave", onLeave);
    btn.removeEventListener("focus", onFocus);
    btn.removeEventListener("blur", onLeave);
  };
}

export function ArrakisButton({
  label = "Request a demo",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const rootRef = useRef(null);

  useEffect(() => attachArrakis(rootRef.current), []);

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

export function ArrakisPreview() {
  return <ArrakisButton />;
}
