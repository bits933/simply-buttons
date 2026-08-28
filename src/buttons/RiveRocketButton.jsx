import { useEffect, useRef } from "react";
import { Lottie } from "lottie-react";
import rocketHover from "./lordicon-rocket/wired-outline-489-rocket-hover-flying.json";
import "./rive-rocket.css";

function RocketRestMark() {
  return (
    <svg
      className="btn-rive-rocket-rest"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 430 430"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="12">
        <path
          stroke="currentColor"
          d="M185.56 148.57s-65.41-8.19-111.05 37.45c48.44 1.26 66.51 19.32 66.51 19.32m140.77 39.47s8.19 65.41-37.45 111.05c-1.26-48.44-19.32-66.51-19.32-66.51"
        />
        <path
          stroke="currentColor"
          d="m208.21 284.57-14.82 4.63c-14.8 4.63-30.95.66-41.92-10.31a41.68 41.68 0 0 1-10.31-41.92l4.64-14.82m131.56-27.98c-11.63 11.63-30.48 11.63-42.11 0s-11.63-30.48 0-42.1 30.48-11.63 42.11 0c11.63 11.62 11.63 30.47 0 42.1"
        />
        <path
          stroke="currentColor"
          d="M209.8 283.57c5.77 5.77 14.84 6.65 21.57 2.04 15.94-10.91 35.38-27.65 60.6-52.87 47.45-47.45 70-108.09 64.69-159.98-51.88-5.31-112.53 17.24-159.98 64.69-25.21 25.21-41.96 44.66-52.87 60.6-4.61 6.74-3.73 15.8 2.04 21.57z"
        />
        <path
          stroke="currentColor"
          d="M276.94 86.52s1.79 19.83 24.37 42.41 41.6 23.55 41.6 23.55"
        />
        <path
          stroke="currentColor"
          d="M135.81 335.34C124.55 346.6 95.65 355.11 73 357.37c3.26-23.66 10.76-51.55 22.03-62.81 11.26-11.26 29.52-11.26 40.78 0s11.26 29.52 0 40.78"
        />
      </g>
    </svg>
  );
}

function ArrowMark() {
  return (
    <svg
      className="btn-rive-rocket-arrow"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M4.77 11.943h13.321m1.025 0L11.943 4.77m7.173 7.173-7.173 7.173"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="square"
      />
    </svg>
  );
}

export function RiveRocketButton({
  label = "Get Started",
  className = "",
  onClick,
  ...rest
}) {
  const buttonRef = useRef(null);
  const lottieRef = useRef(null);
  const clickTimer = useRef(0);
  const edgeTimer = useRef(0);
  const rafRef = useRef(0);
  const hotRef = useRef(false);
  const cursor = useRef({ x: 0, y: 0, tx: 0, ty: 0, lift: 0, liftT: 0 });

  useEffect(() => {
    const tick = () => {
      const button = buttonRef.current;
      const c = cursor.current;
      c.x += (c.tx - c.x) * 0.16;
      c.y += (c.ty - c.y) * 0.16;
      c.lift += (c.liftT - c.lift) * 0.12;
      if (button) {
        button.style.setProperty("--btn-x", c.x.toFixed(4));
        button.style.setProperty("--btn-y", c.y.toFixed(4));
        button.style.setProperty("--lift", c.lift.toFixed(4));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(clickTimer.current);
      window.clearTimeout(edgeTimer.current);
    };
  }, []);

  function setHot(next) {
    window.clearTimeout(edgeTimer.current);
    const apply = () => {
      hotRef.current = next;
      const button = buttonRef.current;
      const lottie = lottieRef.current;
      if (button) button.classList.toggle("is-hot", next);
      cursor.current.liftT = next ? 1 : 0;
      if (!next) {
        cursor.current.tx = 0;
        cursor.current.ty = 0;
      }
      if (!lottie) return;
      if (next) lottie.play();
      else lottie.stop();
    };
    edgeTimer.current = window.setTimeout(apply, next ? 40 : 90);
  }

  function trackCursor(event) {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const nx = (rect.left + rect.width / 2 - event.clientX) / (rect.width / 2);
    const ny = (rect.top + rect.height / 2 - event.clientY) / (rect.height / 2);
    cursor.current.tx = Math.max(-1, Math.min(1, nx));
    cursor.current.ty = Math.max(-1, Math.min(1, ny));
  }

  function handleClick(event) {
    setHot(true);
    window.clearTimeout(clickTimer.current);
    clickTimer.current = window.setTimeout(() => {
      const button = buttonRef.current;
      setHot(Boolean(button?.matches(":hover, :focus-visible")));
    }, 1500);
    onClick?.(event);
  }

  return (
    <button
      {...rest}
      ref={buttonRef}
      type="button"
      className={["btn-rive-rocket", className].filter(Boolean).join(" ")}
      onPointerEnter={(event) => {
        setHot(true);
        trackCursor(event);
      }}
      onPointerMove={trackCursor}
      onPointerLeave={() => {
        setHot(false);
        buttonRef.current?.classList.remove("is-press");
      }}
      onPointerDown={() => buttonRef.current?.classList.add("is-press")}
      onPointerUp={() => buttonRef.current?.classList.remove("is-press")}
      onPointerCancel={() => {
        setHot(false);
        buttonRef.current?.classList.remove("is-press");
      }}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
      onClick={handleClick}
    >
      <span className="btn-rive-rocket-panel">
        <span className="btn-rive-rocket-inner">
          <ArrowMark />
          <span className="btn-rive-rocket-label">{label}</span>
          <span className="btn-rive-rocket-icon" aria-hidden="true">
            <RocketRestMark />
            <Lottie
              src={rocketHover}
              autoplay={false}
              loop
              lottieRef={lottieRef}
              className="btn-rive-rocket-lottie"
              subscriptions={{
                ready: () => {
                  if (!hotRef.current) lottieRef.current?.stop();
                },
              }}
            />
          </span>
        </span>
      </span>
    </button>
  );
}

export function RiveRocketPreview() {
  return (
    <div className="btn-rive-rocket-root">
      <RiveRocketButton />
    </div>
  );
}
