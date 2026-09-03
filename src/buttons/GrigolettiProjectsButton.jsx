import React from "react";
import "./grigoletti-projects-button.css";

export function GrigolettiProjectsButton({
  label = "See Projects",
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
      <span>{label}</span>
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
