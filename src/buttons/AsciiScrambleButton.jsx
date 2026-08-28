import { useEffect, useRef, useState } from "react";
import { ASCII_SCRAMBLE_MS, buildAsciiScrambleFrame } from "./ascii-scramble.js";
import "./ascii-scramble.css";

export function AsciiScrambleButton({
  label = "WORK",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [active, setActive] = useState(false);
  const [displayedLabel, setDisplayedLabel] = useState(label);
  const activeRef = useRef(false);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const frameRef = useRef(0);
  const labelRef = useRef(label);

  labelRef.current = label;

  function cancelAnimation() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  }

  function setInteraction(nextActive) {
    cancelAnimation();
    activeRef.current = nextActive && !disabled;
    setActive(activeRef.current);

    if (!activeRef.current) {
      setDisplayedLabel(labelRef.current);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayedLabel(labelRef.current);
      return;
    }

    const startedAt = performance.now();
    const frameInterval = 1000 / 30;
    let lastTextUpdate = -Infinity;
    let tick = 0;

    function renderFrame(now) {
      if (!activeRef.current) return;
      const progress = Math.min(1, (now - startedAt) / ASCII_SCRAMBLE_MS);
      if (now - lastTextUpdate >= frameInterval || progress === 1) {
        setDisplayedLabel(buildAsciiScrambleFrame(labelRef.current, progress, tick));
        lastTextUpdate = now;
        tick += 1;
      }

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(renderFrame);
      } else {
        frameRef.current = 0;
      }
    }

    frameRef.current = requestAnimationFrame(renderFrame);
  }

  function syncInteraction() {
    setInteraction(hoverRef.current || focusRef.current);
  }

  function handlePointerEnter(event) {
    if (disabled || event.pointerType === "touch") return;
    hoverRef.current = true;
    syncInteraction();
  }

  function handlePointerLeave(event) {
    if (event.pointerType === "touch") return;
    hoverRef.current = false;
    syncInteraction();
  }

  function handleFocus(event) {
    focusRef.current = event.currentTarget.matches(":focus-visible");
    syncInteraction();
  }

  function handleBlur() {
    focusRef.current = false;
    syncInteraction();
  }

  useEffect(() => {
    if (disabled) {
      hoverRef.current = false;
      focusRef.current = false;
      setDisplayedLabel(label);
      setInteraction(false);
    } else if (!activeRef.current) {
      setDisplayedLabel(label);
    }
  }, [disabled, label]);

  useEffect(() => {
    return () => cancelAnimation();
  }, []);

  const buttonClassName = [
    "btn-ascii-scramble-button",
    active ? "is-active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      type="button"
      className={buttonClassName}
      disabled={disabled}
      aria-label={label}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={onClick}
    >
      <span className="btn-ascii-scramble-visual" aria-hidden="true">
        <span className="btn-ascii-scramble-label">
          {[...displayedLabel].map((character, index) => (
            <span key={index} className="btn-ascii-scramble-cell">{character}</span>
          ))}
        </span>
        <span className="btn-ascii-scramble-symbol">( + )</span>
      </span>
    </button>
  );
}

export function AsciiScramblePreview() {
  return (
    <div className="btn-ascii-scramble-preview">
      <AsciiScrambleButton />
    </div>
  );
}
