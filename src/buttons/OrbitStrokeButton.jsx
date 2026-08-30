import { useEffect, useRef, useState } from "react";
import { TextShimmerWave } from "./text-shimmer-wave";
import "./orbit-stroke.css";

export function OrbitStrokeButton({
  label = "Send",
  className = "",
  onClick,
  ...props
}) {
  // Phase: "idle" | "sending" | "sent"
  const [phase, setPhase] = useState("idle");
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = (e) => {
    if (phase !== "idle") return;
    onClick?.(e);

    setPhase("sending");

    // 1. Sending state runs for 4000ms (4 seconds) with TextShimmerWave
    timerRef.current = setTimeout(() => {
      setPhase("sent");

      // 2. Sent state displays animated tick and holds for 1800ms before auto-resetting to idle
      timerRef.current = setTimeout(() => {
        setPhase("idle");
      }, 1800);
    }, 4000);
  };

  const isSending = phase === "sending";
  const isSent = phase === "sent";

  return (
    <button
      type="button"
      className={[
        "btn-orbit-stroke",
        isSending ? "is-sending" : "",
        isSent ? "is-sent" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
      aria-label={isSending ? "Sending" : isSent ? "Sent" : label}
      {...props}
    >
      <span className="btn-orbit-stroke-content">
        {isSending && (
          <TextShimmerWave
            duration={1}
            zDistance={10}
            xDistance={2}
            yDistance={-2}
            scaleDistance={1.1}
            rotateYDistance={10}
          >
            Sending
          </TextShimmerWave>
        )}
        {isSent && (
          <>
            <svg
              className="btn-orbit-stroke-tick"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path
                d="M3.5 8.5 L6.5 11.5 L12.5 4.5"
                className="btn-orbit-stroke-tick-path"
              />
            </svg>
            <span>Sent</span>
          </>
        )}
        {phase === "idle" && <span>{label}</span>}
      </span>
    </button>
  );
}

export function OrbitStrokePreview() {
  return (
    <div className="btn-orbit-stroke-root">
      <OrbitStrokeButton />
    </div>
  );
}
