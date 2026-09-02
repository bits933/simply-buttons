import { useEffect, useRef, useState } from "react";
import "./loco-shuffle-button.css";

/* Loco shuffle button — locomotive.ca's "Let's talk" header CTA (awwwards
   Site of the Day + Site of the Month Mar 2023), rebuilt: a borderless
   text CTA where hovering runs four rounds of whole-word Fisher–Yates
   character shuffle over 250ms, then restores the label from its
   aria-label. Mouse-leaving mid-scramble kills the loop and restores.
   Specimen for the Simply Buttons gallery. */

const ROUNDS = 4;
const TICK_MS = 250 / 8;

function fisherYates(chars) {
  const out = [...chars];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function LocoShuffleButton({ label = "Let's talk", className = "", onClick, ...rest }) {
  const [shown, setShown] = useState(label);
  const timerRef = useRef(0);

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  function scramble() {
    window.clearInterval(timerRef.current);
    const chars = label.split("");
    let frame = 0;
    timerRef.current = window.setInterval(() => {
      frame += 1;
      if (frame >= ROUNDS * 2) {
        window.clearInterval(timerRef.current);
        setShown(label);
        return;
      }
      setShown(fisherYates(chars).join(""));
    }, TICK_MS);
  }

  function restore() {
    window.clearInterval(timerRef.current);
    setShown(label);
  }

  return (
    <button
      type="button"
      data-loco-shuffle=""
      aria-label={label}
      className={["btn-loco-shuffle", className].filter(Boolean).join(" ")}
      onMouseEnter={scramble}
      onFocus={scramble}
      onMouseLeave={restore}
      onBlur={restore}
      onClick={onClick ? (event) => onClick(event) : undefined}
      {...rest}
    >
      {shown}
    </button>
  );
}

export function LocoShuffleButtonPreview() {
  return (
    <div className="loco-shuffle-root">
      <LocoShuffleButton />
    </div>
  );
}
