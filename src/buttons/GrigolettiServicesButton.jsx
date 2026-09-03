import React from "react";
import "./grigoletti-services-button.css";

export function GrigolettiServicesButton({
  label = "Services",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className="gs-serv-btn"
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span>{label}</span>
      <svg className="gs-chevron" viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

export function GrigolettiServicesButtonPreview() {
  return (
    <div className="gs-root" data-grigoletti-services>
      <GrigolettiServicesButton />
    </div>
  );
}

export default GrigolettiServicesButton;
