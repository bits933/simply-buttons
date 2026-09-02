import "./zajno-underline-button.css";

/* Zajno underline button — zajno.com's `.li_` work links (awwwards Site of
   the Day Jul 2023), rebuilt: a lowercase text button whose underline is
   split into two halves — on hover one half slides in from -102% while the
   resting half slides out to +102%, so the line reads as one continuous
   wipe crossing the word. Hover also flips the ink red. Pure CSS.
   Specimen for the Simply Buttons gallery. */

export function ZajnoUnderlineButton({ label = "work", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-zajno-underline=""
      aria-label={label}
      className={["btn-zajno-underline", className].filter(Boolean).join(" ")}
      onClick={onClick ? (event) => onClick(event) : undefined}
      {...rest}
    >
      {label}
    </button>
  );
}

export function ZajnoUnderlineButtonPreview() {
  return (
    <div className="zajno-underline-root">
      <ZajnoUnderlineButton />
    </div>
  );
}
