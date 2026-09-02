import "./codex-agent-button.css";

export function CodexAgentButton({
  label = "Run Codex",
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-codex-agent", className].filter(Boolean).join(" ")}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-codex-agent__mark" aria-hidden="true">&gt;_</span>
      <span className="btn-codex-agent__label">{label}</span>
    </button>
  );
}

export function CodexAgentButtonPreview() {
  return (
    <div className="btn-codex-agent-root">
      <CodexAgentButton />
    </div>
  );
}
