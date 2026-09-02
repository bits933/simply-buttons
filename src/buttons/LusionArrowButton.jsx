import "./lusion-arrow-button.css";

/* Lusion arrow button — lusion.co's "Let's talk" header CTA (awwards Site
   of the Day May 2019 + Developer Award), rebuilt: a fully-rounded pill
   where hover slides the text +1.5em, collapses a three-dot cluster to 0,
   and flies an arrow in from -2.5em — 0.3s cubic-bezier(0.4, 0, 0.1, 1).
   Pure CSS. Specimen for the Simply Buttons gallery. */

export function LusionArrowButton({ label = "LET'S TALK", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-lusion-arrow=""
      aria-label={label}
      className={["btn-lusion-arrow", className].filter(Boolean).join(" ")}
      onClick={onClick ? (event) => onClick(event) : undefined}
      {...rest}
    >
      <span className="la-window">
        <span className="la-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="la-dots" aria-hidden="true">
          <span /><span /><span />
        </span>
      </span>
      <span className="la-label">{label}</span>
    </button>
  );
}

export function LusionArrowButtonPreview() {
  return (
    <div className="lusion-arrow-root">
      <LusionArrowButton />
    </div>
  );
}
