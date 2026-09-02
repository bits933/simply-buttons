import "./unseen-enter-button.css";

/* Unseen enter button — unseen.co's SOTD hero CTA (awwwards Site of the Day
   Feb 2023), rebuilt: a white pill where hover sweeps a dark fill up from the
   bottom edge while the label rolls out upward and a cloned label rolls in,
   and the arrow icon slides across. Pure CSS, interruptible transitions.
   Specimen for the Simply Buttons gallery. */

export function UnseenEnterButton({ label = "Enter", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-unseen-enter=""
      aria-label={label}
      className={["btn-unseen-enter", className].filter(Boolean).join(" ")}
      onClick={onClick ? (event) => onClick(event) : undefined}
      {...rest}
    >
      <span className="ue-fill" aria-hidden="true" />
      <span className="ue-text">
        <span className="ue-clip">
          <span className="ue-label">{label}</span>
          <span className="ue-label ue-label--clone" aria-hidden="true">{label}</span>
        </span>
      </span>
      <svg className="ue-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function UnseenEnterButtonPreview() {
  return (
    <div className="unseen-enter-root">
      <UnseenEnterButton />
    </div>
  );
}
