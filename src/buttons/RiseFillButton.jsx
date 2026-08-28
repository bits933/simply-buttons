import "./rise-fill.css";

export function RiseFillButton({
  label = "Chapter II",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-rise-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-rise-fill" aria-hidden="true" />
      <span className="btn-rise-copy">
        <span className="btn-rise-label">{label}</span>
        <span className="btn-rise-mark" aria-hidden="true" />
      </span>
      <span className="btn-rise-line" aria-hidden="true" />
    </button>
  );
}

export function RiseFillPreview() {
  return (
    <div className="btn-rise-root">
      <RiseFillButton />
    </div>
  );
}
