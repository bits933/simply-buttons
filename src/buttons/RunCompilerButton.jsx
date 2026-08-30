import { useEffect, useRef } from "react";
import "./run-compiler-button.css";
import "./run-compiler-light.css";

/* Run compiler button — terminal-style frame with three states: typewritten
   RUN_COMPILER with a blinking block caret; on click, a Windows XP style
   progress bar (green chunks in a sunken white track) fills left-to-right;
   then COMPILED types out the same way.
   Original specimen for the Simply Buttons gallery (not a replica). */

export function RunCompilerButton({
  label = "RUN_COMPILER",
  done = "COMPILED",
  className = "",
  onClick,
  ...rest
}) {
  const btnRef = useRef(null);
  const textRef = useRef(null);
  const labelRef = useRef(null);
  const caretRef = useRef(null);
  const stateRef = useRef("idle");
  const timersRef = useRef([]);

  useEffect(() => {
    const btn = btnRef.current;
    const text = textRef.current;
    const labelEl = labelRef.current;
    const caret = caretRef.current;
    if (!btn || !text || !labelEl || !caret) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = timersRef.current;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const clearAll = () => {
      timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
      timers.length = 0;
    };
    const type = (str, onDone) => {
      caret.classList.remove("is--blinking");
      if (reduced) {
        labelEl.textContent = str;
        caret.classList.add("is--blinking");
        if (onDone) onDone();
        return;
      }
      let i = 0;
      labelEl.textContent = "";
      const id = setInterval(() => {
        i += 1;
        labelEl.textContent = str.slice(0, i);
        if (i >= str.length) {
          clearInterval(id);
          caret.classList.add("is--blinking");
          if (onDone) onDone();
        }
      }, 55);
      timers.push(id);
    };
    const start = () => {
      stateRef.current = "typing";
      btn.classList.add("is--texted");
      type(label, () => { stateRef.current = "ready"; });
    };
    start();

    const handleClick = () => {
      if (stateRef.current === "ready") {
        stateRef.current = "loading";
        clearAll();
        caret.classList.remove("is--blinking");
        btn.classList.remove("is--texted");
        btn.classList.add("is--loading");
        const total = 6 * 110 + 420;
        later(() => {
          btn.classList.remove("is--loading");
          btn.classList.add("is--texted");
          labelEl.textContent = "";
          stateRef.current = "typing-done";
          type(done, () => { stateRef.current = "compiled"; });
        }, total);
      } else if (stateRef.current === "compiled") {
        stateRef.current = "typing";
        clearAll();
        btn.classList.remove("is--texted");
        labelEl.textContent = "";
        later(() => {
          btn.classList.add("is--texted");
          type(label, () => { stateRef.current = "ready"; });
        }, 120);
      }
    };

    btn.addEventListener("click", handleClick);
    return () => {
      btn.removeEventListener("click", handleClick);
      clearAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      data-run-compiler=""
      className={["btn-run-compiler", className].filter(Boolean).join(" ")}
      aria-live="polite"
      onClick={onClick}
      {...rest}
    >
      <span className="btn-run-compiler__text" ref={textRef}>
        <span ref={labelRef}></span>
        <span className="btn-run-compiler__caret" ref={caretRef}></span>
      </span>
      <span className="btn-run-compiler__loader" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className="btn-run-compiler__box" style={{ "--i": i }}></span>
        ))}
      </span>
    </button>
  );
}

export function RunCompilerButtonPreview() {
  return (
    <div className="run-compiler-root">
      <RunCompilerButton />
    </div>
  );
}
