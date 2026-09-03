import React, { useState, useRef, useEffect } from "react";
import "./grigoletti-services-button.css";

const SERVICES_LIST = [
  { idx: "01", title: "Framer Development" },
  { idx: "02", title: "Web Design" },
  { idx: "03", title: "Webflow to Framer" },
  { idx: "04", title: "SEO & Optimization" },
];

export function GrigolettiServicesButton({
  label = "SERVICES",
  onClick,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="gs-container"
      data-open={open ? "true" : "false"}
    >
      <div className="gs-group">
        <button
          type="button"
          className="gs-serv-btn"
          aria-label={label}
          onClick={(e) => {
            setOpen((prev) => !prev);
            if (onClick) onClick(e);
          }}
          {...rest}
        >
          <span className="gs-layer-rest">{label}</span>
          <span className="gs-layer-hover" aria-hidden="true">{label}</span>
        </button>

        <button
          type="button"
          className="gs-toggle-btn"
          aria-label="Toggle services menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className="gs-layer-rest">
            <svg className="gs-chevron" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
          <span className="gs-layer-hover" aria-hidden="true">
            <svg className="gs-chevron" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </div>

      {open && (
        <div className="gs-dropdown" role="menu">
          {SERVICES_LIST.map((s) => (
            <button
              key={s.idx}
              type="button"
              className="gs-menu-item"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="gs-menu-idx">({s.idx})</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      )}
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
