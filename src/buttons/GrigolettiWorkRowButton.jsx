import React from "react";
import "./grigoletti-work-row-button.css";

export function GrigolettiWorkRowButton({
  label = "THÖMUS",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className="gwr-work-btn"
      aria-label="2026 Bikes THÖMUS project"
      onClick={onClick}
      {...rest}
    >
      <div className="gwr-left">
        <span className="gwr-meta">2026, BIKES</span>
        <div className="gwr-thumb-wrapper">
          <img
            className="gwr-thumb"
            src="/grigoletti-thoemus.png"
            alt="Thömus Oberrider bike project"
            width="68"
            height="44"
          />
        </div>
        <div className="gwr-title-box">
          <span className="gwr-title">THÖMUS</span>
          <span className="gwr-badge">Live Website</span>
        </div>
      </div>
      <svg className="gwr-arrow" viewBox="0 0 24 24" aria-hidden="true">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </button>
  );
}

export function GrigolettiWorkRowButtonPreview() {
  return (
    <div className="gwr-root" data-grigoletti-work-row>
      <GrigolettiWorkRowButton />
    </div>
  );
}

export default GrigolettiWorkRowButton;
