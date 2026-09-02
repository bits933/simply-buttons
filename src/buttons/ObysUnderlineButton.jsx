import { useState } from "react";
import "./obys-underline-button.css";

/* Obys underline button — obys.agency's work-mode toggles (awwards Site of
   the Day May 2026 + Developer Award), rebuilt: typographic text buttons
   whose 1.34px underline draws in from the left when a mode activates and
   collapses to the right when it deactivates, in 0.8s
   cubic-bezier(0.16, 1, 0.3, 1). Click cycles the mode.
   Specimen for the Simply Buttons gallery. */

const MODES = ["Vertical", "Horizontal", "Grid"];

export function ObysUnderlineButton({ modes = MODES, className = "", onClick, ...rest }) {
  const [mode, setMode] = useState(0);

  function cycle() {
    setMode((m) => (m + 1) % modes.length);
  }

  return (
    <div className={["obys-underline-root", className].filter(Boolean).join(" ")}>
      {modes.map((m, i) => (
        <button
          key={m}
          type="button"
          data-obys-underline=""
          data-mode={m.toLowerCase()}
          aria-pressed={i === mode}
          className={i === mode ? "btn-obys-underline is-on" : "btn-obys-underline"}
          onClick={() => {
            setMode(i);
            if (onClick) onClick(m);
          }}
          {...rest}
        >
          {m}
        </button>
      ))}
      <button
        type="button"
        data-obys-cycle=""
        className="obys-cycle"
        onClick={cycle}
        aria-label="Cycle modes"
      >
        <span className="obys-cycle-mark" aria-hidden="true">↻</span>
      </button>
    </div>
  );
}

export function ObysUnderlineButtonPreview() {
  return (
    <div className="obys-stage">
      <ObysUnderlineButton />
    </div>
  );
}
