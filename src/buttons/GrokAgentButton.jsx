import "./grok-agent-button.css";

function GrokMark() {
  return (
    <span className="btn-grok-agent__mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M3 20V9a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H9" />
        <path d="M1 23 23 1" />
      </svg>
    </span>
  );
}

export function GrokAgentButton({
  label = "Ask Grok",
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-grok-agent", className].filter(Boolean).join(" ")}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <GrokMark />
      <span className="btn-grok-agent__label">{label}</span>
    </button>
  );
}

export function GrokAgentButtonPreview() {
  return <div className="btn-grok-agent-root"><GrokAgentButton /></div>;
}
