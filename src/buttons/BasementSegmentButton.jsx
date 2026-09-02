import { useState } from "react";
import "./basement-segment-button.css";

/* Basement segment button — basement.studio's HUMAN/MACHINE pill switch
   (awwwards Site of the Day + Developer Award Apr 2025), rebuilt: an
   uppercase segmented pill where the active side flips white→orange while
   a sliding indicator pill glides behind the active option, 0.42s
   cubic-bezier(0.22, 1, 0.36, 1). Specimen for the Simply Buttons gallery. */

export function BasementSegmentButton({
  options = ["Human", "Machine"],
  className = "",
  onChange,
  ...rest
}) {
  const [active, setActive] = useState(0);

  function select(i) {
    setActive(i);
    if (onChange) onChange(options[i], i);
  }

  return (
    <div
      className={["btn-basement-segment", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Mode"
      data-basement-segment=""
      data-active={active}
    >
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          className={i === active ? "bs-option is-active" : "bs-option"}
          aria-pressed={i === active}
          onClick={() => select(i)}
          {...(i === 0 ? rest : {})}
        >
          {option}
        </button>
      ))}
      <span className="bs-indicator" style={{ "--count": options.length, "--active": active }} aria-hidden="true" />
    </div>
  );
}

export function BasementSegmentButtonPreview() {
  return (
    <div className="basement-segment-root">
      <BasementSegmentButton />
    </div>
  );
}
