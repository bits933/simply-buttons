import "./wipe-cta.css";

export function WipeCtaButton({
  label = "Motion+",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-wipe-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-wipe-copy">{label}</span>
      <span className="btn-wipe-copy btn-wipe-copy--hover" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}

export function WipeCtaPreview() {
  return (
    <div className="btn-wipe-root">
      <WipeCtaButton />
    </div>
  );
}
