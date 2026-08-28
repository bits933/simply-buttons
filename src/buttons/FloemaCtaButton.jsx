import { useEffect, useRef, useState } from "react";
import "./floema-cta.css";

export function FloemaUrbanIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15.6492 14.7367H10.2453V6.81263C10.2453 6.51422 10.5349 6.29854 10.8214 6.38422L16.0953 7.96785V14.2906C16.0953 14.5358 15.8944 14.7367 15.6492 14.7367ZM8.78281 14.7367H7.32031V10.3492H2.93281V14.7367H1.91645C1.66827 14.7367 1.47031 14.5358 1.47031 14.2906V3.03672H8.33668C8.5819 3.03672 8.78281 3.23763 8.78281 3.48286V14.7367ZM4.39531 14.2906V11.8117H5.41168C5.6569 11.8117 5.85781 12.0126 5.85781 12.2579V14.7367H4.84145C4.59622 14.7367 4.39531 14.5358 4.39531 14.2906ZM10.2453 4.68535V1.57422H0.0078125V16.1992H17.5578V6.88058L10.2453 4.68831V4.68535Z"
        fill="currentColor"
      />
      <path d="M7.31719 7.42383H2.92969V8.88633H7.31719V7.42383Z" fill="currentColor" />
      <path d="M7.31719 4.5H2.92969V5.9625H7.31719V4.5Z" fill="currentColor" />
      <path d="M15.3641 8.88672H10.9766V10.3492H15.3641V8.88672Z" fill="currentColor" />
      <path d="M15.3641 11.8125H10.9766V13.275H15.3641V11.8125Z" fill="currentColor" />
    </svg>
  );
}

export function FloemaCtaButton({
  label = "SEE URBAN PRODUCTS",
  theme = "light",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const labelSideRef = useRef(null);
  const [labelWidth, setLabelWidth] = useState(180);

  useEffect(() => {
    function measure() {
      if (labelSideRef.current) {
        const w = labelSideRef.current.getBoundingClientRect().width;
        if (w > 0) setLabelWidth(w);
      }
    }

    measure();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }

    const observer = new ResizeObserver(measure);
    if (labelSideRef.current) {
      observer.observe(labelSideRef.current);
    }

    return () => observer.disconnect();
  }, [label]);

  return (
    <button
      type="button"
      className={[
        "btn-floema-button",
        `theme-${theme}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      {/* SVG Gooey Filter definition */}
      <svg
        className="btn-floema-filter-svg"
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}
      >
        <defs>
          <filter id="floema-goo-effect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="btn-floema-container">
        {/* Gooey Filter Background Layer */}
        <div className="btn-floema-goo-layer" aria-hidden="true">
          <span className="btn-floema-blob btn-floema-blob--icon" />
          <span
            className="btn-floema-blob btn-floema-blob--label"
            style={{ width: `${labelWidth}px` }}
          />
        </div>

        {/* Crisp Foreground Content Layer */}
        <div className="btn-floema-content-layer">
          <span className="btn-floema-icon-side" aria-hidden="true">
            <span className="btn-floema-icon">
              <FloemaUrbanIcon />
            </span>
          </span>

          <span ref={labelSideRef} className="btn-floema-label-side">
            <span className="btn-floema-label">{label}</span>
          </span>
        </div>
      </div>
    </button>
  );
}

export function FloemaCtaPreview() {
  return (
    <div className="btn-floema-root">
      <FloemaCtaButton />
    </div>
  );
}
