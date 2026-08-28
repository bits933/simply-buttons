import "./glossy-bubble.css";

export function GlossyBubbleButton({
  label = "Button",
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-bubble-btn", className].filter(Boolean).join(" ")}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-bubble-text">{label}</span>
      <div className="btn-bubble-blob btn-bubble-blob--left" aria-hidden="true" />
      <div className="btn-bubble-blob btn-bubble-blob--right" aria-hidden="true" />
      <div className="btn-bubble-fluid" aria-hidden="true" />
    </button>
  );
}

export function GlossyBubblePreview() {
  return (
    <div className="btn-bubble-root">
      <GlossyBubbleButton />
    </div>
  );
}
