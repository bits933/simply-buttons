import "./form-studio.css";

export function FormStudioButton({
  label = "Studio",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-form-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-form-border" aria-hidden="true" />
      <span className="btn-form-label">{label}</span>
    </button>
  );
}

export function FormStudioPreview() {
  return (
    <div className="btn-form-root">
      <FormStudioButton />
    </div>
  );
}
