import { useEffect, useState } from "react";
import "./split-flap.css";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function FlapSlot({ char, delay = 0, speed = 65 }) {
  const isSpace = char === " ";
  const targetChar = char.toUpperCase();
  const [displayChar, setDisplayChar] = useState(isSpace ? " " : " ");
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (isSpace) return;

    let timer;
    let flipTimeout;
    const startDelay = setTimeout(() => {
      const totalSteps = 6 + Math.floor(Math.random() * 5);
      let step = 0;

      const interval = setInterval(() => {
        step++;
        if (step >= totalSteps) {
          clearInterval(interval);
          setDisplayChar(targetChar);
          setFlipping(true);
          flipTimeout = setTimeout(() => setFlipping(false), 160);
        } else {
          const nextRandom =
            CHARS[Math.floor(Math.random() * (CHARS.length - 1)) + 1];
          setDisplayChar(nextRandom);
          setFlipping(true);
          flipTimeout = setTimeout(() => setFlipping(false), speed);
        }
      }, speed);

      timer = interval;
    }, delay);

    return () => {
      clearTimeout(startDelay);
      clearInterval(timer);
      clearTimeout(flipTimeout);
    };
  }, [targetChar, isSpace, delay, speed]);

  if (isSpace) {
    return <span className="split-flap-slot is-space" aria-hidden="true" />;
  }

  return (
    <span className={`split-flap-slot ${flipping ? "is-flipping" : ""}`} aria-hidden="true">
      {/* Top half */}
      <span className="split-flap-half split-flap-top">
        <span className="split-flap-glyph">{displayChar}</span>
      </span>
      {/* Bottom half */}
      <span className="split-flap-half split-flap-bottom">
        <span className="split-flap-glyph">{displayChar}</span>
      </span>
      {/* Center divider seam */}
      <span className="split-flap-divider" />
    </span>
  );
}

export function SplitFlapText({
  text,
  lines,
  speed = 60,
  className = "",
}) {
  const [key, setKey] = useState(0);
  const resolvedLines =
    lines ?? (text ? (Array.isArray(text) ? text : text.split("\n")) : ["Simply", "Buttons"]);
  let globalCharIndex = 0;

  return (
    <span
      className={["split-flap-text", className].filter(Boolean).join(" ")}
      role="text"
      aria-label={resolvedLines.join(" ")}
      onClick={() => setKey((k) => k + 1)}
      title="Click to replay flip animation"
    >
      {resolvedLines.map((line, lineIdx) => (
        <span key={`${key}-line-${lineIdx}`} className="split-flap-line">
          {line.split("").map((c) => {
            const currentIdx = globalCharIndex++;
            return (
              <FlapSlot
                key={`${key}-${currentIdx}`}
                char={c}
                delay={currentIdx * 75}
                speed={speed}
              />
            );
          })}
        </span>
      ))}
    </span>
  );
}
