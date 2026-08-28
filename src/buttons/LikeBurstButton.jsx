import { useEffect, useRef, useState } from "react";
import "./like-burst.css";

const PARTICLE_COUNT = 8;
const BURST_MS = 640;
const SPRING_MS = 380;

function spray(root) {
  const dots = root.querySelectorAll("i");
  dots.forEach((dot) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 12 + Math.random() * 14;
    dot.style.setProperty("--px", `${Math.cos(angle) * dist}px`);
    dot.style.setProperty("--py", `${Math.sin(angle) * dist}px`);
    dot.style.setProperty("--pdur", `${480 + Math.random() * 220}ms`);
    dot.style.setProperty("--pdelay", `${Math.random() * 40}ms`);
    dot.style.setProperty("--p-end-scale", (0.35 + Math.random() * 0.4).toFixed(2));
    dot.style.setProperty("--psize", (0.7 + Math.random() * 0.7).toFixed(2));
  });
}

function HeartIcon() {
  return (
    <svg
      className="btn-like-heart"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

export function LikeBurstButton({
  label = "Like",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [liked, setLiked] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [sprung, setSprung] = useState(false);
  const particlesRef = useRef(null);
  const burstTimer = useRef(0);
  const springTimer = useRef(0);

  useEffect(
    () => () => {
      window.clearTimeout(burstTimer.current);
      window.clearTimeout(springTimer.current);
    },
    [],
  );

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;

    const next = !liked;
    setLiked(next);
    setSprung(false);
    window.clearTimeout(springTimer.current);
    requestAnimationFrame(() => {
      setSprung(true);
      springTimer.current = window.setTimeout(() => setSprung(false), SPRING_MS);
    });

    if (next && particlesRef.current) {
      spray(particlesRef.current);
      setBursting(false);
      requestAnimationFrame(() => {
        setBursting(true);
        window.clearTimeout(burstTimer.current);
        burstTimer.current = window.setTimeout(() => setBursting(false), BURST_MS);
      });
    }
  }

  return (
    <button
      type="button"
      className={[
        "btn-like-btn",
        bursting ? "is-bursting" : "",
        sprung ? "is-sprung" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-liked={liked ? "true" : "false"}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      <span className="btn-like-icon">
        <HeartIcon />
      </span>
      <span className="btn-like-particles" ref={particlesRef} aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <i key={i} />
        ))}
      </span>
      <span className="btn-like-label">{label}</span>
    </button>
  );
}

export function LikeBurstPreview() {
  return (
    <div className="btn-like-root">
      <LikeBurstButton />
    </div>
  );
}
