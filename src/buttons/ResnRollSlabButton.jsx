import "./resn-roll-slab-button.css";

/* Resn roll slab — breakthroughenergy.org's KeyAreas CTA (awwards Site of
   the Day + Developer Award Jan 2026, built by Resn), rebuilt: a huge
   slab whose label is a stack of clipped lines that roll upward on an
   auto-cycle, cycling the site's campaign lines. Hover pauses the roll so
   the current line can be read. Specimen for the Simply Buttons gallery. */

const LINES = [
  "29 manufacturing companies",
  "26 electricity companies",
  "24 transportation companies",
];

export function ResnRollSlabButton({ lines = LINES, className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-resn-roll-slab=""
      className={["btn-resn-roll-slab", className].filter(Boolean).join(" ")}
      onClick={onClick ? (event) => onClick(event) : undefined}
      {...rest}
    >
      <span className="rs-window">
        <span className="rs-column">
          {lines.map((line) => (
            <span className="rs-line" key={line}>{line}</span>
          ))}
          <span className="rs-line" aria-hidden="true">{lines[0]}</span>
        </span>
      </span>
      <span className="rs-cta" aria-hidden="true">View</span>
    </button>
  );
}

export function ResnRollSlabButtonPreview() {
  return (
    <div className="resn-roll-slab-root">
      <ResnRollSlabButton />
    </div>
  );
}
