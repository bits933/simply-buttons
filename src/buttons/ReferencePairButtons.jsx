import { useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import "./reference-pair.css";

export function OrbitDropButton({ disabled = false, onClick, ...rest }) {
  return (
    <button
      type="button"
      className="btn-orbit"
      aria-label="Move down"
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-orbit-icon-window" aria-hidden="true">
        <span className="btn-orbit-icon btn-orbit-icon--current">
          <CaretDown size={12} weight="fill" />
        </span>
        <span className="btn-orbit-icon btn-orbit-icon--next">
          <CaretDown size={12} weight="fill" />
        </span>
      </span>
    </button>
  );
}

export function SignalCapsuleButton({
  label = "What we do",
  disabled = false,
  onClick,
  ...rest
}) {
  const [pulsing, setPulsing] = useState(false);
  const pulseTimer = useRef(0);

  function handleClick(event) {
    if (!disabled) {
      setPulsing(false);
      requestAnimationFrame(() => {
        setPulsing(true);
        window.clearTimeout(pulseTimer.current);
        pulseTimer.current = window.setTimeout(() => setPulsing(false), 650);
      });
    }
    onClick?.(event);
  }

  return (
    <div
      className={["btn-signal-wrap", pulsing ? "is-pulsing" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="btn-signal-pulse" aria-hidden="true" />
      <button
        type="button"
        className="btn-signal"
        disabled={disabled}
        onClick={handleClick}
        {...rest}
      >
        <span className="btn-signal-label">{label}</span>
      </button>
    </div>
  );
}

export function OrbitDropPreview() {
  return (
    <div className="btn-ref-root">
      <OrbitDropButton />
    </div>
  );
}

export function SignalCapsulePreview() {
  return (
    <div className="btn-ref-root">
      <SignalCapsuleButton />
    </div>
  );
}
