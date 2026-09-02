import "./exo-circle-button.css";

/* Exo circle button — exoape.com's "The Studio" CTA (awwwards Site of the Day
   May 2022 + Developer Award), rebuilt: a text label with a separate circle
   glyph. On hover the dark circle fill scales up from 0, an arrow fades in
   over it, and the label underline draws out from the left. Pure CSS.
   Specimen for the Simply Buttons gallery. */

export function ExoCircleButton({ label = "The Studio", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-exo-circle=""
      aria-label={label}
      className={["btn-exo-circle", className].filter(Boolean).join(" ")}
      onClick={onClick ? (event) => onClick(event) : undefined}
      {...rest}
    >
      <span className="ec-label">
        <span className="ec-label-text">{label}</span>
        <span className="ec-underline" aria-hidden="true" />
      </span>
      <span className="ec-circle" aria-hidden="true">
        <svg className="ec-ring" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="21" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="ec-fill" />
        <svg className="ec-icon" viewBox="0 0 24 24" fill="none">
          <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

export function ExoCircleButtonPreview() {
  return (
    <div className="exo-circle-root">
      <ExoCircleButton />
    </div>
  );
}
