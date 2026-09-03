import React from "react";
import "./grigoletti-framer-button.css";

export function GrigolettiFramerButton({
  label = "Official Framer Pro Expert",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className="gfb-framer-btn"
      aria-label="Official Framer Pro Expert"
      onClick={onClick}
      {...rest}
    >
      <svg className="gfb-logo" viewBox="0 0 14 21" aria-hidden="true">
        <path d="M0 0h14v7H7zm0 7h14l-7 7H0zm0 7h7v7z" />
      </svg>
      <span className="gfb-label">Official Framer Pro Expert</span>
    </button>
  );
}

export function GrigolettiFramerButtonPreview() {
  return (
    <div className="gfb-root" data-grigoletti-framer>
      <GrigolettiFramerButton />
    </div>
  );
}

export default GrigolettiFramerButton;
