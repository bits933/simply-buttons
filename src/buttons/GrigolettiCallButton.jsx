import React from "react";
import "./grigoletti-call-button.css";

export function GrigolettiCallButton({
  label = "Book a call",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className="gc-call-btn"
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <img
        className="gc-avatar"
        src="/grigoletti-avatar.png"
        alt="Dario Grigoletti portrait thumbnail"
        width="28"
        height="28"
      />
      <span className="gc-label">{label}</span>
    </button>
  );
}

export function GrigolettiCallButtonPreview() {
  return (
    <div className="gc-root" data-grigoletti-call>
      <GrigolettiCallButton />
    </div>
  );
}

export default GrigolettiCallButton;
