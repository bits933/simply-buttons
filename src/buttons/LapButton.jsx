import "./lap-button.css";

const LABEL = "START EXPERIENCE";

function LapStroke() {
  return (
    <svg className="btn-lap-frame" aria-hidden="true">
      <rect
        className="btn-lap-track"
        x="1.25"
        y="1.25"
        width="calc(100% - 2.5px)"
        height="calc(100% - 2.5px)"
        rx="28.25"
        ry="28.25"
        pathLength="100"
      />
      <rect
        className="btn-lap-run"
        x="1.25"
        y="1.25"
        width="calc(100% - 2.5px)"
        height="calc(100% - 2.5px)"
        rx="28.25"
        ry="28.25"
        pathLength="100"
      />
    </svg>
  );
}

export function LapButton({
  label = LABEL,
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-lap-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <LapStroke />
      <span className="btn-lap-copy">
        <span className="btn-lap-line btn-lap-line--out">{label}</span>
        <span className="btn-lap-line btn-lap-line--in" aria-hidden="true">
          {label}
        </span>
      </span>
    </button>
  );
}

export function LapButtonPreview() {
  return (
    <div className="btn-lap-root">
      <LapButton />
    </div>
  );
}
