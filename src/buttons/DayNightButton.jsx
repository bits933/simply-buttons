import "./day-night.css";

function SunIcon() {
  return (
    <svg className="btn-day-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2.5v2.2M12 19.3v2.2M4.93 4.93l1.56 1.56M17.51 17.51l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.93 19.07l1.56-1.56M17.51 6.49l1.56-1.56"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="btn-day-moon" viewBox="0 0 30 30" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M10.244141,3.9980469A12,12 0 0 0 3,15 12,12 0 0 0 15,27 12,12 0 0 0 25.900391,19.992188 12,12 0 0 1 21.142578,20.990234 12,12 0 0 1 9.1425781,8.9902344 12,12 0 0 1 10.244141,3.9980469Z"
      />
    </svg>
  );
}

export function DayNightButton({ disabled = false, className = "", ...rest }) {
  return (
    <div className={["btn-day-toggle", className].filter(Boolean).join(" ")}>
      <input
        className="btn-day-hit"
        type="checkbox"
        disabled={disabled}
        aria-label="Toggle night mode"
        {...rest}
      />
      <span className="btn-day-face" />
      <span className="btn-day-label">
        <SunIcon />
        <MoonIcon />
      </span>
    </div>
  );
}

export function DayNightPreview() {
  return (
    <div className="btn-day-root">
      <DayNightButton />
    </div>
  );
}
