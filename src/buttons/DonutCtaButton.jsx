import "./donut-cta-button.css";

/* Donut CTA — donut-studio.com's primary pill CTA, rebuilt: a transparent
   fully-rounded pill with a 2px electric-yellow border and bold uppercase
   Helvetica letters. Hover (or keyboard focus) floods the pill bottom-up with
   hot pink while each letter rolls to a near-black copy that stays readable on
   the fill. Pure CSS interaction — no JS state, no timers.
   Specimen for the Simply Buttons gallery. */

export function DonutCtaButton({ label = "Contact", className = "", onClick, ...rest }) {
  const letters = label.split("");

  return (
    <button
      type="button"
      data-donut-cta=""
      aria-label={label}
      className={["btn-donut-cta", className].filter(Boolean).join(" ")}
      onClick={onClick ? (event) => onClick(event) : undefined}
      {...rest}
    >
      <span className="dc-fill" aria-hidden="true" />
      <span className="dc-label" aria-hidden="true">
        {letters.map((ch, i) => (
          <span className="dc-letter" key={i} style={{ "--i": i }}>
            <span className="dc-letter__stack">
              <span className="dc-letter__copy">{ch === " " ? "\u00A0" : ch}</span>
              <span className="dc-letter__copy dc-letter__copy--alt">{ch === " " ? "\u00A0" : ch}</span>
            </span>
          </span>
        ))}
      </span>
    </button>
  );
}

export function DonutCtaButtonPreview() {
  return (
    <div className="donut-cta-root">
      <DonutCtaButton />
    </div>
  );
}
