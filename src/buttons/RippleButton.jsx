import { useRef } from "react";
import "./ripple.css";

const RIPPLE_MS = 650;

function spawnRipple(btn, clientX, clientY) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.1;
  const wave = document.createElement("span");
  wave.className = "btn-ripple-wave";
  wave.style.width = `${size}px`;
  wave.style.height = `${size}px`;
  wave.style.left = `${clientX - rect.left - size / 2}px`;
  wave.style.top = `${clientY - rect.top - size / 2}px`;
  btn.appendChild(wave);
  window.setTimeout(() => wave.remove(), RIPPLE_MS);
}

export function RippleButton({
  label = "Ripple",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const btnRef = useRef(null);

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    const btn = btnRef.current;
    if (!btn) return;
    spawnRipple(btn, event.clientX, event.clientY);
  }

  return (
    <button
      ref={btnRef}
      type="button"
      className={["btn-ripple-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-label={label}
      onClick={handleClick}
      {...rest}
    >
      {label}
    </button>
  );
}

export function RipplePreview() {
  return (
    <div className="btn-ripple-root">
      <RippleButton />
    </div>
  );
}
