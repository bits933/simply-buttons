import React from "react";
import "./grigoletti-services-button.css";

export function GrigolettiServicesButton({
  label = "SERVICES",
  onClick,
  ...rest
}) {
  return (
    <div className="gs-container">
      <div className="gs-group">
        <button
          type="button"
          className="gs-serv-btn"
          aria-label={label}
          onClick={onClick}
          {...rest}
        >
          <span className="gs-layer-rest">{label}</span>
          <span className="gs-layer-hover" aria-hidden="true">{label}</span>
        </button>
      </div>
    </div>
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
