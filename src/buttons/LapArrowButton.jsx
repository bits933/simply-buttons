import "./lap-arrow.css";

function ArrowIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4 10h11M11 5.5 15.5 10 11 14.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LapArrowStroke() {
  return (
    <svg className="btn-lapa-frame" viewBox="0 0 58 58" aria-hidden="true">
      <circle
        className="btn-lapa-track"
        cx="29"
        cy="29"
        r="28.25"
        pathLength="100"
      />
      <circle
        className="btn-lapa-run"
        cx="29"
        cy="29"
        r="28.25"
        pathLength="100"
      />
    </svg>
  );
}

export function LapArrowButton({
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-lapa-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-label="Next"
      onClick={onClick}
      {...rest}
    >
      <LapArrowStroke />
      <span className="btn-lapa-copy">
        <ArrowIcon className="btn-lapa-icon btn-lapa-icon--out" />
        <ArrowIcon className="btn-lapa-icon btn-lapa-icon--in" />
      </span>
    </button>
  );
}

export function LapArrowPreview() {
  return (
    <div className="btn-lapa-root">
      <LapArrowButton />
    </div>
  );
}
