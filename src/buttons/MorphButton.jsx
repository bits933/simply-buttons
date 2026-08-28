import { useEffect, useRef, useState } from "react";
import "./morph.css";

const OPEN_MS = 2200;

function MorphTick() {
  return (
    <svg
      className="btn-morph-tick"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path className="btn-morph-tick-path" d="M3.2 8.2 L6.4 11.2 L12.8 4.6" />
    </svg>
  );
}

export function MorphButton({
  label = "Send",
  successLabel = "Sent",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const resetTimer = useRef(0);

  useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current);
    },
    [],
  );

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || disabled || open) return;

    setOpen(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setOpen(false), OPEN_MS);
  }

  return (
    <button
      type="button"
      className={["btn-morph-btn", open ? "is-open" : "", className]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      aria-live="polite"
      aria-label={open ? successLabel : label}
      onClick={handleClick}
      {...rest}
    >
      <span className="btn-morph-lbl">{label}</span>
      <span className="btn-morph-alt">
        <MorphTick />
        <span className="btn-morph-success">{successLabel}</span>
      </span>
    </button>
  );
}

export function MorphPreview() {
  return (
    <div className="btn-morph-root">
      <MorphButton />
    </div>
  );
}
