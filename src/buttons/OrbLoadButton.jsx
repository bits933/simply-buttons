import { useEffect, useState } from "react";
import "./orb-load.css";

const LOAD_MS = 3600;

const PIXELS = [
  { cls: "btn-orb-px--1", x: 8, y: 0 },
  { cls: "btn-orb-px--2", x: 12, y: 4 },
  { cls: "btn-orb-px--3", x: 16, y: 8 },
  { cls: "btn-orb-px--4", x: 12, y: 12 },
  { cls: "btn-orb-px--5", x: 8, y: 16 },
  { cls: "btn-orb-px--6", x: 4, y: 12 },
  { cls: "btn-orb-px--7", x: 0, y: 8 },
  { cls: "btn-orb-px--8", x: 4, y: 4 },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M9 5.5 16.5 12 9 18.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
      {PIXELS.map((p) => (
        <rect
          key={p.cls}
          className={`btn-orb-px ${p.cls}`}
          x={p.x}
          y={p.y}
          width="4"
          height="4"
        />
      ))}
    </svg>
  );
}

export function OrbLoadButton({
  disabled = false,
  className = "",
  loadMs = LOAD_MS,
  onClick,
  ...rest
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const id = window.setTimeout(() => setLoading(false), loadMs);
    return () => window.clearTimeout(id);
  }, [loading, loadMs]);

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || disabled || loading) return;
    setLoading(true);
  }

  return (
    <button
      type="button"
      className={["btn-orb-btn", loading ? "is-loading" : "", className]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={loading ? "Loading" : "Send"}
      onClick={handleClick}
      {...rest}
    >
      <span className="btn-orb-core" aria-hidden="true" />
      <span className="btn-orb-light" aria-hidden="true">
        <span className="btn-orb-fill" />
        <span className="btn-orb-sheen" />
      </span>
      <span className="btn-orb-arrow">
        <ArrowIcon />
      </span>
      <span className="btn-orb-loader">
        <DiamondIcon />
      </span>
    </button>
  );
}

export function OrbLoadPreview() {
  return (
    <div className="btn-orb-root">
      <OrbLoadButton />
    </div>
  );
}
