import { useEffect, useRef } from "react";
import {
  LETTER_SCRAMBLE_LABEL,
  attachLetterScramble,
} from "./letter-scramble.js";
import "./letter-scramble.css";

function cellsFor(label) {
  return [...label].map((character, index) => (
    <span className="btn-lscram-cell" key={`${character}-${index}`}>
      {character}
    </span>
  ));
}

export function LetterScrambleButton({
  label = LETTER_SCRAMBLE_LABEL,
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const buttonRef = useRef(null);

  useEffect(() => attachLetterScramble(buttonRef.current), [label, disabled]);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={["btn-lscram-btn", className].filter(Boolean).join(" ")}
      data-text={label}
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-lscram-label" aria-hidden="true">
        {cellsFor(label)}
      </span>
    </button>
  );
}

export function LetterScramblePreview() {
  return (
    <div className="btn-lscram-root">
      <LetterScrambleButton />
    </div>
  );
}
