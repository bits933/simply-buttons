import "./lenis-swap-button.css";

/* Lenis swap button — the studiofreight.com/lenis SOTD-era CTA (awwwards
   Site of the Day + Developer Award Feb 2023), rebuilt from the archived
   production CSS: an uppercase slab whose visible label collapses
   scaleY(0) from the top while a hidden label grows in from the bottom
   (origin-swap), a fill wash rises behind, and a bordered icon square
   keeps its frame — 0.6s ease-out-expo throughout. Specimen for the
   Simply Buttons gallery. */

export function LenisSwapButton({
  label = "Get started",
  altLabel = "Scroll on",
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      data-lenis-swap=""
      aria-label={label}
      className={["btn-lenis-swap", className].filter(Boolean).join(" ")}
      onClick={onClick ? (event) => onClick(event) : undefined}
      {...rest}
    >
      <span className="ls-base" aria-hidden="true" />
      <span className="ls-wash" aria-hidden="true" />
      <span className="ls-text">
        <span className="ls-visible">{label}</span>
        <span className="ls-hidden" aria-hidden="true">{altLabel}</span>
      </span>
      <span className="ls-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 4v14M6 12l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

export function LenisSwapButtonPreview() {
  return (
    <div className="lenis-swap-root">
      <LenisSwapButton />
    </div>
  );
}
