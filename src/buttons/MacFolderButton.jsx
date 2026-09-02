import { useState } from "react";
import "./mac-folder-button.css";

/* Mac folder button — a modern Apple-style folder. Click opens it with
   spring-restrained motion: the front tips forward, a deep-blue interior
   appears, and three rounded file cards float out in a gentle fan. Motion is
   transitions — not keyframes — so a second click mid-flight retargets
   everything from its current on-screen value: the animation is interruptible,
   reversible at any instant, and input is never locked.
   Specimen assembly for the Simply Buttons gallery. */

/* File cards peek out of the folder mouth — a tidy, slightly fanned stack that
   stays mostly inside the folder (only its top edge clears the mouth). */
const PAPERS = [
  { i: 0, dx: "-6px", dy: "6px", rot: "-5deg", s: "0.95", d: "460ms" },
  { i: 1, dx: "0px", dy: "8px", rot: "0deg", s: "1", d: "560ms" },
  { i: 2, dx: "6px", dy: "7px", rot: "4deg", s: "0.97", d: "480ms" },
];

export function MacFolderButton({ label = "Documents", className = "", onClick, ...rest }) {
  const [phase, setPhase] = useState("closed");

  return (
    <button
      type="button"
      data-mac-folder=""
      data-phase={phase}
      aria-expanded={phase === "open"}
      className={["btn-mac-folder", className].filter(Boolean).join(" ")}
      onClick={(event) => {
        setPhase((p) => (p === "open" ? "closed" : "open"));
        if (onClick) onClick(event);
      }}
      {...rest}
    >
      <span className="mf-stage" aria-hidden="true">
        <span className="mf-back">
          <svg viewBox="0 0 80 56" fill="none">
            <defs>
              <linearGradient id="mf-lid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#6ec6ff" />
                <stop offset="1" stopColor="#3ea0ff" />
              </linearGradient>
            </defs>
            <path
              d="M4 14 C4 9 7 6 12 6 L28 6 C30 6 32 7 33 9 L36 13 L68 13 C73 13 76 16 76 21 L76 46 C76 51 73 54 68 54 L12 54 C7 54 4 51 4 46 Z"
              fill="url(#mf-lid)"
            />
          </svg>
        </span>
        <span className="mf-interior">
          <svg viewBox="0 0 80 56" fill="none">
            <defs>
              <linearGradient id="mf-inner" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0c3f8e" />
                <stop offset="1" stopColor="#0a67d6" />
              </linearGradient>
            </defs>
            <path
              d="M8 12 L72 12 L72 46 C72 51 69 54 64 54 L16 54 C11 54 8 51 8 46 Z"
              fill="url(#mf-inner)"
            />
          </svg>
        </span>
        {PAPERS.map((p) => (
          <span
            className="mf-paper"
            key={p.i}
            style={{ "--i": p.i, "--dx": p.dx, "--dy": p.dy, "--rot": p.rot, "--s": p.s, "--d": p.d }}
          >
            <svg viewBox="0 0 14 9" fill="none">
              <rect x="1" y="1" width="12" height="7" rx="2.5" fill="#ffffff" />
              <path d="M4 3.5 H10 M4 5.5 H8" stroke="#c7cdd8" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
        ))}
        <span className="mf-front">
          <svg viewBox="0 0 80 56" fill="none">
            <defs>
              <linearGradient id="mf-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#54b8ff" />
                <stop offset="1" stopColor="#2890f0" />
              </linearGradient>
            </defs>
            <path
              d="M6 18 C6 13 9 10 14 10 L66 10 C71 10 74 13 74 18 L74 46 C74 51 71 54 66 54 L14 54 C9 54 6 51 6 46 Z"
              fill="url(#mf-face)"
            />
            <path d="M10 16 L70 16" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </span>
      <span className="mf-caption">{label}</span>
    </button>
  );
}

export function MacFolderButtonPreview() {
  return (
    <div className="mac-folder-root">
      <MacFolderButton />
    </div>
  );
}
