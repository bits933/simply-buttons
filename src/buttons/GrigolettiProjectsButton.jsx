import React from "react";
import "./grigoletti-projects-button.css";

export function GrigolettiProjectsButton({
  label = "PROJECTS",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className="gp-proj-btn"
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span className="gp-layer-rest">{label}</span>
      <span className="gp-layer-hover" aria-hidden="true">{label}</span>
    </button>
  );
}

export function GrigolettiProjectsButtonPreview() {
  return (
    <div className="gp-root" data-grigoletti-projects>
      <GrigolettiProjectsButton />
    </div>
  );
}

export default GrigolettiProjectsButton;
