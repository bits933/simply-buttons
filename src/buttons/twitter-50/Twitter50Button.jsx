import { useEffect, useRef } from "react";
import "./twitter-50.css";
import { TWITTER_50 } from "./catalog.js";

function innerFor(row) {
  const label = row.label;
  const k = row.kind;
  if (k === "glitch") {
    const garbage = ["x", "$", "≈", "ç", "&", "π", "_", "#"];
    return label.split("").map((ch, n) => (
      <span
        key={n}
        className="ch"
        style={{ "--i": n, "--g": `'${garbage[(n + 1) % 8]}'`, "--c1": `'${garbage[n % 8]}'`, "--c2": `'${garbage[(n + 3) % 8]}'` }}
      >
        {ch}
      </span>
    ));
  }
  if (k === "grid-spin") {
    return (
      <>
        <span className="lab">{label}</span>
        <span className="spin" aria-hidden="true" />
      </>
    );
  }
  if (k === "invert-spot") {
    return (
      <>
        <span className="spot" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "search-pill") {
    return (
      <>
        <span className="mag" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "overlay-cta") {
    return (
      <>
        <span className="play" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "send-email") {
    return <span className="lab">{label}</span>;
  }
  if (k === "scroll-mark") {
    return (
      <>
        <span className="lab">{label}</span>
        <span className="chev" aria-hidden="true">
          →
        </span>
      </>
    );
  }
  if (k === "explore-3d") {
    return (
      <>
        <span className="plane" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "dir-roll") {
    return (
      <>
        <span className="lab">{label}</span>
        <span className="east" aria-hidden="true" />
      </>
    );
  }
  if (k === "gravity") {
    return (
      <>
        <span className="orb" aria-hidden="true" />
        <span className="orb" aria-hidden="true" />
        <span className="orb" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "download-now") {
    return (
      <>
        <span className="disk" aria-hidden="true">
          💾
        </span>
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "giana-dir") {
    return (
      <>
        <span className="hit hit-w" />
        <span className="hit hit-e" />
        <span className="hit hit-n" />
        <span className="hit hit-s" />
        <span className="hit hit-c" />
        <span className="fill fill-w" aria-hidden="true" />
        <span className="fill fill-e" aria-hidden="true" />
        <span className="fill fill-n" aria-hidden="true" />
        <span className="fill fill-s" aria-hidden="true" />
        <span className="fill fill-c" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (["height", "conic-p3", "five-hovers", "candy-ghost", "tw-lab", "fifty-kit", "layer-step", "cq-shimmer"].includes(k)) {
    return <span className="lab">{label}</span>;
  }
  return label;
}

function boot(el, kind, id) {
  if (!el) return () => {};
  if (kind === "conic-p3" || kind === "invert-spot") {
    let tx = 50, ty = 50, cx = 50, cy = 50, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.setProperty("--mx", `${cx}%`);
      el.style.setProperty("--my", `${cy}%`);
      raf = Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    const on = (e) => {
      const r = el.getBoundingClientRect();
      if (kind === "invert-spot") {
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      } else {
        tx = ((e.clientX - r.left) / r.width) * 100;
        ty = ((e.clientY - r.top) / r.height) * 100;
        if (!raf) raf = requestAnimationFrame(tick);
      }
    };
    el.addEventListener("pointermove", on);
    el.addEventListener("pointerleave", () => {
      tx = 50; ty = 50;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    return () => {
      el.removeEventListener("pointermove", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }
  if (kind === "tw-ripple") {
    const on = (e) => {
      if (el.disabled) return;
      const r = el.getBoundingClientRect();
      const s = Math.max(r.width, r.height) * 1.1;
      const w = document.createElement("span");
      w.className = "wave";
      w.style.width = `${s}px`;
      w.style.height = `${s}px`;
      w.style.left = `${e.clientX - r.left - s / 2}px`;
      w.style.top = `${e.clientY - r.top - s / 2}px`;
      el.appendChild(w);
      window.setTimeout(() => w.remove(), 650);
    };
    el.addEventListener("click", on);
    return () => el.removeEventListener("click", on);
  }
  if (kind === "grid-spin" || kind === "disco") {
    const on = () => {
      if (el.disabled || el.getAttribute("aria-busy") === "true") return;
      el.setAttribute("aria-busy", "true");
      window.setTimeout(() => el.setAttribute("aria-busy", "false"), kind === "disco" ? 1600 : 1400);
    };
    el.addEventListener("click", on);
    return () => el.removeEventListener("click", on);
  }
  if (kind === "julius-glass") {
    const order = ["idle", "busy", "done"];
    const on = () => {
      if (el.disabled) return;
      const i = order.indexOf(el.getAttribute("data-state") || "idle");
      el.setAttribute("data-state", order[(i + 1) % order.length]);
    };
    el.addEventListener("click", on);
    return () => el.removeEventListener("click", on);
  }
  return () => {};
}

export function Twitter50Button({ row, disabled = false }) {
  const ref = useRef(null);
  useEffect(() => boot(ref.current, row.kind, row.id), [row.kind, row.id]);
  const busy = row.kind === "grid-spin" || row.kind === "disco" ? { "aria-busy": "false" } : {};
  const state = row.kind === "julius-glass" ? { "data-state": "idle" } : {};
  return (
    <button
      ref={ref}
      className={row.id}
      type="button"
      data-x50={row.id}
      aria-label={row.label}
      disabled={disabled}
      {...busy}
      {...state}
    >
      {innerFor(row)}
    </button>
  );
}

export function Twitter50Preview({ row }) {
  const ghosts = row.kind === "proximity";
  return (
    <div className={`${row.id}-root`}>
      {ghosts ? <span className={`${row.id}-ghost`} aria-hidden="true" /> : null}
      <Twitter50Button row={row} />
      {ghosts ? <span className={`${row.id}-ghost`} aria-hidden="true" /> : null}
    </div>
  );
}

export const TWITTER_50_PREVIEWS = Object.fromEntries(
  TWITTER_50.map((row) => {
    function Preview() {
      return <Twitter50Preview row={row} />;
    }
    Preview.displayName = `Twitter50Preview_${row.id}`;
    return [row.id, Preview];
  })
);
