import { useEffect, useRef, useState } from "react";
import "./arrow-fill-button.css";

const COMPACT_LAYOUT_BREAKPOINT = 1280;
const PRESS_HOLD_MS = 450;

function ArrowRightIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function useCompactPress() {
  const [isPressed, setIsPressed] = useState(false);
  const releaseTimeoutRef = useRef(0);
  const compactRef = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${COMPACT_LAYOUT_BREAKPOINT - 1}px)`,
    );
    const sync = (event) => {
      compactRef.current = "matches" in event ? event.matches : mediaQuery.matches;
      if (!compactRef.current) setIsPressed(false);
    };
    sync(mediaQuery);
    mediaQuery.addEventListener("change", sync);
    return () => {
      mediaQuery.removeEventListener("change", sync);
      window.clearTimeout(releaseTimeoutRef.current);
    };
  }, []);

  const clearPressedState = () => {
    window.clearTimeout(releaseTimeoutRef.current);
    releaseTimeoutRef.current = window.setTimeout(() => {
      setIsPressed(false);
      releaseTimeoutRef.current = 0;
    }, PRESS_HOLD_MS);
  };

  const onPointerDown = (event) => {
    if (!compactRef.current || event.pointerType === "mouse") return;
    window.clearTimeout(releaseTimeoutRef.current);
    releaseTimeoutRef.current = 0;
    setIsPressed(true);
  };

  const onPointerUp = (event) => {
    if (!compactRef.current || event.pointerType === "mouse") return;
    clearPressedState();
  };

  return {
    isPressed,
    pointerHandlers: {
      onPointerDown,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}

export function ArrowFillButton({
  label = "Hover Me",
  onClick,
  ...rest
}) {
  const { isPressed, pointerHandlers } = useCompactPress();

  return (
    <button
      type="button"
      className="hpx-afb"
      aria-label={label}
      data-hpx-afb=""
      data-pressed={isPressed ? "true" : "false"}
      onClick={onClick}
      {...pointerHandlers}
      {...rest}
    >
      <span className="hpx-afb__label">{label}</span>
      <span aria-hidden="true" className="hpx-afb__circle" />
      <span aria-hidden="true" className="hpx-afb__mask">
        <span className="hpx-afb__mask-label">{label}</span>
      </span>
      <span aria-hidden="true" className="hpx-afb__icon">
        <ArrowRightIcon className="hpx-afb__icon-svg hpx-afb__icon-svg--enter" />
        <ArrowRightIcon className="hpx-afb__icon-svg hpx-afb__icon-svg--exit" />
      </span>
    </button>
  );
}

export function ArrowFillButtonPreview() {
  return (
    <div className="arrow-fill-root" data-hpx-afb="">
      <ArrowFillButton />
    </div>
  );
}

export default ArrowFillButton;
