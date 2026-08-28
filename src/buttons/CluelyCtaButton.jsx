import "./cluely-cta.css";

function AppleIcon() {
  return (
    <svg
      className="btn-cluely-icon"
      viewBox="0 0 27 26"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.0657 6.44451C15.6697 6.20767 16.4258 5.93555 17.5488 5.93555C19.3037 5.93555 21.1564 6.86179 22.3948 8.38999L23.1841 9.36399L22.0823 9.96225C19.4438 11.3951 19.8102 15.1728 22.552 16.1988L23.5986 16.5905L23.1351 17.6074C22.6396 18.6944 22.3823 19.224 21.7153 20.2268C20.6926 21.7696 19.2845 23.632 17.2408 23.651C15.9727 23.6629 14.964 22.7844 13.7066 22.7911C12.4408 22.7978 11.4114 23.6542 10.1357 23.6541H10.1266C8.11979 23.6364 6.72925 21.915 5.71591 20.3878C3.0736 16.4057 2.71935 11.7379 4.52639 8.98304C5.81307 7.02147 7.77676 5.93836 9.7493 5.93836C10.7341 5.93836 11.5325 6.2139 12.1555 6.43307C12.8153 6.66521 13.2281 6.80964 13.6827 6.80964C14.1573 6.80964 14.4732 6.6768 15.0657 6.44451Z"
        fill="currentColor"
      />
      <path
        d="M17.2132 3.63495C17.9598 2.67729 18.4693 1.38216 18.2636 0C17.044 0.0836494 15.6754 0.802611 14.8429 1.81343C14.0877 2.73045 13.463 4.09151 13.7054 5.41426C15.0359 5.4557 16.4134 4.66142 17.2132 3.63495Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CluelyCtaButton({
  label = "Get for Mac",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-cluely-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      {/* Background base */}
      <span className="btn-cluely-bg" aria-hidden="true" />
      {/* Hover gradient layer */}
      <span className="btn-cluely-hover-bg" aria-hidden="true" />
      {/* Cyan ambient aura blur nodes */}
      <span className="btn-cluely-glow" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      {/* Procedural noise overlay */}
      <span className="btn-cluely-noise" aria-hidden="true" />
      {/* Inner rim highlight */}
      <span className="btn-cluely-rim" aria-hidden="true" />

      {/* Label and Apple icon */}
      <span className="btn-cluely-content">
        <AppleIcon />
        <span>{label}</span>
      </span>
    </button>
  );
}

export function CluelyCtaPreview() {
  return (
    <div className="btn-cluely-root">
      <CluelyCtaButton label="Get for Mac" />
    </div>
  );
}
