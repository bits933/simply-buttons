import { useEffect, useRef, useState } from "react";
import "./online-status-button.css";

/* Online status button — green-dot "Online" chip that toggles to a red-accent
   "Offline" state: the dot bursts into a ring and an X draws itself inside.
   Original specimen for the Simply Buttons gallery (not a replica). */

export function OnlineStatusButton({ label = "Online", offLabel = "Offline", className = "", onClick, ...rest }) {
  const [offline, setOffline] = useState(false);
  const btnRef = useRef(null);
  const onLabelRef = useRef(null);
  const offLabelRef = useRef(null);
  const pingRef = useRef(null);
  const chromeRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    const labels = btn && btn.querySelector(".btn-online-status__labels");
    if (!btn || !labels) return;
    if (chromeRef.current === null) {
      chromeRef.current = btn.offsetWidth - labels.offsetWidth;
    }
    const target = offline ? offLabelRef.current : onLabelRef.current;
    if (target) btn.style.width = target.offsetWidth + chromeRef.current + "px";
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
      const t = offline ? offLabelRef.current : onLabelRef.current;
      if (t) btn.style.width = t.offsetWidth + chromeRef.current + "px";
    });
  }, [offline]);

  const toggle = (event) => {
    const next = !offline;
    setOffline(next);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (pingRef.current && !reduced && pingRef.current.animate) {
      pingRef.current.animate(
        [
          { opacity: 0.4, transform: "scale(0.6)" },
          { opacity: 0, transform: "scale(2.4)" },
        ],
        { duration: 500, easing: "cubic-bezier(0, 0, 0.2, 1)" }
      );
    }
    if (onClick) onClick(event);
  };

  return (
    <button
      ref={btnRef}
      type="button"
      data-online-status=""
      role="switch"
      aria-checked={offline ? "false" : "true"}
      className={["btn-online-status", offline ? "is--offline" : "", className].filter(Boolean).join(" ")}
      onClick={toggle}
      {...rest}
    >
      <span className="btn-online-status__icon" aria-hidden="true">
        <span className="btn-online-status__dot"></span>
        <svg className="btn-online-status__mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="btn-online-status__ring" cx="12" cy="12" r="8" />
          <line className="btn-online-status__x is--first" x1="9" y1="9" x2="15" y2="15" pathLength="100" />
          <line className="btn-online-status__x is--second" x1="15" y1="9" x2="9" y2="15" pathLength="100" />
        </svg>
        <span className="btn-online-status__ping" ref={pingRef}></span>
      </span>
      <span className="btn-online-status__labels">
        <span className="btn-online-status__label is--on" ref={onLabelRef}>{label}</span>
        <span className="btn-online-status__label is--off" aria-hidden="true" ref={offLabelRef}>{offLabel}</span>
      </span>
    </button>
  );
}

export function OnlineStatusButtonPreview() {
  return (
    <div className="online-status-root">
      <OnlineStatusButton />
    </div>
  );
}
