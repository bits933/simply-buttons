import "./letter-roll.css";

export function LetterRollButton({
  label = "Button",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const letters = Array.from(label);

  return (
    <button
      type="button"
      className={["btn-roll-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-roll-track">
        <span className="btn-roll-mother">
          {letters.map((char, index) => (
            <span
              key={index}
              style={{ "--i": index }}
              className={char === " " ? "is-space" : undefined}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
        <span className="btn-roll-mother2" aria-hidden="true">
          {letters.map((char, index) => (
            <span
              key={index}
              style={{ "--i": index }}
              className={char === " " ? "is-space" : undefined}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
    </button>
  );
}

export function LetterRollPreview() {
  return (
    <div className="btn-roll-root">
      <LetterRollButton label="Button" />
    </div>
  );
}
