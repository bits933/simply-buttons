import "./neu-hover.css";

export function NeuHoverButton({
  label = "Soft",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      {...rest}
      type="button"
      className={["btn-neu-hover", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export function NeuHoverPreview() {
  return (
    <div className="btn-neu-root">
      <NeuHoverButton />
    </div>
  );
}
