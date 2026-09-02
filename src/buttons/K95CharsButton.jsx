import { useState } from "react";
import "./k95-chars-button.css";

/* K95 chars button — k95.it's frosted nav menu pill (awwwards Site of the
   Day Aug 2026), rebuilt: a backdrop-blur glass pill whose label is built
   from per-character 1em-high masked spans; clicking rolls every character
   upward by 1em, swapping the phrase MENU ↔ ×CLOSE. Pure CSS transitions
   driven by a data-phase attribute. Specimen for the Simply Buttons gallery. */

export function K95CharsButton({
  label = "Menu",
  altLabel = "×Close",
  className = "",
  onClick,
  ...rest
}) {
  const [phase, setPhase] = useState("closed");

  function handleClick(event) {
    setPhase((p) => (p === "open" ? "closed" : "open"));
    if (onClick) onClick(event);
  }

  return (
    <button
      type="button"
      data-k95-chars=""
      data-phase={phase}
      aria-expanded={phase === "open"}
      aria-label={phase === "open" ? "Close menu" : "Open menu"}
      className={["btn-k95-chars", className].filter(Boolean).join(" ")}
      onClick={handleClick}
      {...rest}
    >
      <span className="kc-chars" aria-hidden="true">
        {(altLabel.length >= label.length ? altLabel : label).split("").map((ch, i) => (
          <span className="kc-char" key={i} style={{ "--i": i }}>
            <span className="kc-stack">
              <span className="kc-copy">{label[i] === undefined || label[i] === " " ? "\u00A0" : label[i]}</span>
              <span className="kc-copy kc-copy--alt">{ch === " " ? "\u00A0" : ch}</span>
            </span>
          </span>
        ))}
      </span>
    </button>
  );
}

export function K95CharsButtonPreview() {
  return (
    <div className="k95-chars-root">
      <K95CharsButton />
    </div>
  );
}
