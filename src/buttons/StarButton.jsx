import { useEffect, useRef, useState } from "react";
import { Lottie } from "lottie-react";
import starHover from "./lordicon-star/wired-flat-237-star-hover-pinch.json";
import "./star-button.css";
import {
  STAR_BUTTON,
  STAR_PATH,
  buildStarButtonCss,
} from "./star-button.tokens.js";

const STYLE_ID = "btn-star-styles";
const POP_MS = Number.parseInt(STAR_BUTTON.popMs, 10);

function ensureStarStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = buildStarButtonCss();
  document.head.appendChild(tag);
}

if (typeof document !== "undefined") ensureStarStyles();

function StarGlyph() {
  return (
    <svg
      className="btn-star-silhouette"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

export function StarButton({
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);
  const [popping, setPopping] = useState(false);
  const popTimer = useRef(0);
  const lottieRef = useRef(null);
  const hotRef = useRef(false);
  const pressedRef = useRef(false);

  pressedRef.current = pressed;

  useEffect(() => {
    ensureStarStyles();
    return () => window.clearTimeout(popTimer.current);
  }, []);

  function syncLottie() {
    const lottie = lottieRef.current;
    if (!lottie) return;
    if (hotRef.current || pressedRef.current) lottie.play();
    else lottie.stop();
  }

  function setHot(next) {
    if (disabled) return;
    hotRef.current = next;
    syncLottie();
  }

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    const next = !pressed;
    pressedRef.current = next;
    setPressed(next);
    if (next) {
      setPopping(true);
      window.clearTimeout(popTimer.current);
      popTimer.current = window.setTimeout(() => setPopping(false), POP_MS);
    } else {
      setPopping(false);
      window.clearTimeout(popTimer.current);
    }
    syncLottie();
  }

  const label = pressed ? STAR_BUTTON.labelOn : STAR_BUTTON.label;

  return (
    <div className="btn-star-root">
      <button
        type="button"
        {...rest}
        className={["btn-star-btn", popping ? "is-popping" : "", className]
          .filter(Boolean)
          .join(" ")}
        aria-pressed={pressed}
        aria-label={label}
        disabled={disabled}
        onPointerEnter={() => setHot(true)}
        onPointerLeave={() => setHot(false)}
        onFocus={() => setHot(true)}
        onBlur={() => setHot(false)}
        onClick={handleClick}
      >
        <span className="btn-star-side btn-star-side--label">
          <span className="btn-star-icon" aria-hidden="true">
            <StarGlyph />
            <Lottie
              src={starHover}
              autoplay={false}
              loop
              lottieRef={lottieRef}
              className="btn-star-lottie"
              subscriptions={{
                ready: () => {
                  if (!hotRef.current && !pressedRef.current) {
                    lottieRef.current?.stop();
                  }
                },
              }}
            />
          </span>
          <span className="btn-star-swap btn-star-swap--label">
            <span className="btn-star-line btn-star-line--out">
              {STAR_BUTTON.label}
            </span>
            <span className="btn-star-line btn-star-line--in">
              {STAR_BUTTON.labelOn}
            </span>
          </span>
        </span>
        <span className="btn-star-rule" aria-hidden="true" />
        <span className="btn-star-side btn-star-side--count">
          <span className="btn-star-plus" aria-hidden="true">
            {STAR_BUTTON.plus}
          </span>
          <span className="btn-star-swap btn-star-swap--count">
            <span className="btn-star-line btn-star-line--out">
              {STAR_BUTTON.countOff}
            </span>
            <span className="btn-star-line btn-star-line--in">
              {STAR_BUTTON.countOn}
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

export function StarPreview() {
  useEffect(() => {
    ensureStarStyles();
  }, []);

  return <StarButton />;
}
