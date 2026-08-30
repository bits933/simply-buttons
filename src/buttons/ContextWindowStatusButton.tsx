import { useEffect, useRef, useState } from "react";

export type ContextWindowStatusButtonProps = {
  usedTokens?: number;
  maxTokens?: number;
  onCompress?: () => void;
};

type Phase = "idle" | "exiting" | "compressing" | "compressed" | "returning";

const CIRCLE_LENGTH = 2 * Math.PI * 6.5;

function clampTokens(value: number, max: number) {
  return Math.min(max, Math.max(0, Number.isFinite(value) ? value : 0));
}

function formatTokens(value: number) {
  if (value >= 1_000_000) return `${Number((value / 1_000_000).toFixed(1))}M`;
  if (value >= 1_000) return `${Number((value / 1_000).toFixed(1))}K`;
  return String(Math.round(value));
}

const STYLES = `
.context-window-button {
  --context-bg: #f2f0f7;
  --context-bg-hover: #ebe8f4;
  --context-ink: #2c2835;
  --context-track: #d5cfdf;
  --context-arc: #7057a8;
  --context-dot-base: #d8cfee;
  --context-dot-fill: #fff;
  --context-dot-dense: #7057a8;
  --context-shimmer-base: #2c2835;
  --context-shimmer-accent: #7057a8;
  --context-ease-out: cubic-bezier(.23, 1, .32, 1);
  --context-ease-in-out: cubic-bezier(.77, 0, .175, 1);
  position: relative;
  isolation: isolate;
  display: inline-grid;
  box-sizing: border-box;
  height: 38px;
  padding: 0 12px;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--context-ink) 11%, transparent);
  border-radius: 999px;
  appearance: none;
  background: var(--context-bg);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 62%);
  color: var(--context-ink);
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 160ms ease, border-color 160ms ease, transform 140ms var(--context-ease-out);
}
.context-window-button__idle {
  display: inline-flex;
  grid-area: 1 / 1;
  align-items: center;
  gap: 8px;
  opacity: 1;
  transform: translateX(0);
  transition: opacity 220ms var(--context-ease-out), transform 220ms var(--context-ease-out);
}
.context-window-button__pie { display: block; width: 17px; height: 17px; flex: 0 0 17px; overflow: visible; }
.context-window-button__track, .context-window-button__arc { fill: none; stroke-width: 2.5; }
.context-window-button__track { stroke: var(--context-track); }
.context-window-button__arc { stroke: var(--context-arc); stroke-linecap: round; transition: stroke-dashoffset 520ms var(--context-ease-in-out); }
.context-window-button__readout { font-variant-numeric: tabular-nums; letter-spacing: -.015em; }
.context-window-button__matrix {
  position: absolute;
  z-index: 1;
  inset: 3px 4px;
  overflow: hidden;
  border-radius: 999px;
  contain: paint;
  opacity: 0;
  pointer-events: none;
  transition: opacity 420ms var(--context-ease-out);
}
.context-window-button__square-field {
  position: absolute;
  inset: 0;
  opacity: .35;
  background-color: #111d38;
  background-image:
    radial-gradient(circle at center, rgba(59, 130, 246, 0.45) 0%, rgba(37, 99, 235, 0.2) 65%, transparent 75%),
    linear-gradient(to right, rgba(15, 23, 42, 0.8) 0.75px, transparent 0.75px),
    linear-gradient(to bottom, rgba(15, 23, 42, 0.8) 0.75px, transparent 0.75px);
  background-size: 3.5px 3.5px, 3.5px 3.5px, 3.5px 3.5px;
  background-position: 1.75px 1.75px, 0 0, 0 0;
  -webkit-mask-image: linear-gradient(90deg, #000 0 20%, rgb(0 0 0 / .92) 36%, rgb(0 0 0 / .62) 67%, rgb(0 0 0 / .32) 86%, rgb(0 0 0 / .18) 100%);
  mask-image: linear-gradient(90deg, #000 0 20%, rgb(0 0 0 / .92) 36%, rgb(0 0 0 / .62) 67%, rgb(0 0 0 / .32) 86%, rgb(0 0 0 / .18) 100%);
}
.context-window-button__square-fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0;
  background-color: #1e40af;
  background-image:
    radial-gradient(circle at center, #93c5fd 0%, #3b82f6 40%, #2563eb 75%, transparent 85%),
    linear-gradient(to right, rgba(15, 23, 42, 0.75) 0.75px, transparent 0.75px),
    linear-gradient(to bottom, rgba(15, 23, 42, 0.75) 0.75px, transparent 0.75px);
  background-size: 3.5px 3.5px, 3.5px 3.5px, 3.5px 3.5px;
  background-position: 1.75px 1.75px, 0 0, 0 0;
  box-shadow: 0 0 14px rgba(59, 130, 246, 0.7);
  overflow: hidden;
  border-radius: 999px;
}
.context-window-button__square-fill::after {
  content: "";
  position: absolute;
  inset: 0 0 0 auto;
  width: 14px;
  background: linear-gradient(90deg, transparent 0%, rgba(147, 197, 253, 0.6) 40%, #ffffff 100%);
  box-shadow: 0 0 10px #60a5fa, 0 0 18px #3b82f6;
}
.context-window-button__status { position: absolute; z-index: 2; inset: 0; display: grid; place-items: center; pointer-events: none; }
.context-window-button__label { grid-area: 1 / 1; opacity: 0; font-weight: 650; letter-spacing: -.01em; transition: opacity 420ms var(--context-ease-out); }
.context-window-button__label--compressing { color: var(--context-shimmer-base); background: linear-gradient(100deg, var(--context-shimmer-base) 0%, var(--context-shimmer-base) 35%, var(--context-shimmer-accent) 50%, var(--context-shimmer-base) 65%, var(--context-shimmer-base) 100%); background-size: 220% 100%; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.context-window-button[data-phase="exiting"] .context-window-button__idle,
.context-window-button[data-phase="compressing"] .context-window-button__idle,
.context-window-button[data-phase="compressed"] .context-window-button__idle { opacity: 0; transform: translateX(10px); }
.context-window-button[data-phase="returning"] .context-window-button__idle { opacity: 1; transform: translateX(0); }
.context-window-button[data-phase="compressing"] .context-window-button__matrix { opacity: 1; }
.context-window-button[data-phase="compressing"] .context-window-button__square-fill { animation: context-square-fill 3s var(--context-ease-in-out) both; }
.context-window-button[data-phase="compressed"] .context-window-button__square-fill { width: 100%; }
.context-window-button[data-phase="compressing"] .context-window-button__label--compressing,
.context-window-button[data-phase="compressed"] .context-window-button__label--compressed { opacity: 1; }
.context-window-button[data-phase="compressing"] .context-window-button__label--compressing { animation: context-text-shimmer 1.8s ease-in-out infinite; }
.context-window-button[data-phase="compressed"] .context-window-button__label--compressed { color: var(--context-ink); animation: context-compressed-pop 600ms var(--context-ease-out) both; }
.context-window-button[data-phase="idle"]:active { transform: scale(.98); }
.context-window-button:focus-visible { outline: 2px solid var(--context-arc); outline-offset: 3px; }
@media (hover: hover) and (pointer: fine) { .context-window-button[data-phase="idle"]:hover { background: var(--context-bg-hover); } }
@keyframes context-square-fill { from { width: 0; } to { width: 100%; } }
@keyframes context-text-shimmer { to { background-position: -220% 0; } }
@keyframes context-compressed-pop { 0% { opacity: 0; transform: scale(.82); } 55% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
@media (prefers-color-scheme: dark) {
  .context-window-button { --context-bg: #151a28; --context-bg-hover: #1c2336; --context-ink: #f0f4ff; --context-track: #2a3652; --context-arc: #3b82f6; --context-shimmer-base: #f0f4ff; --context-shimmer-accent: #93c5fd; box-shadow: inset 0 1px 0 rgb(255 255 255 / 7%); }
}
:root[data-theme="light"] .context-window-button { --context-bg: #f0f4fc; --context-bg-hover: #e5edf9; --context-ink: #1e293b; --context-track: #cbd5e1; --context-arc: #2563eb; --context-shimmer-base: #1e293b; --context-shimmer-accent: #2563eb; box-shadow: inset 0 1px 0 rgb(255 255 255 / 62%); }
:root[data-theme="dark"] .context-window-button { --context-bg: #151a28; --context-bg-hover: #1c2336; --context-ink: #f0f4ff; --context-track: #2a3652; --context-arc: #3b82f6; --context-shimmer-base: #f0f4ff; --context-shimmer-accent: #93c5fd; box-shadow: inset 0 1px 0 rgb(255 255 255 / 7%); }
@media (prefers-reduced-motion: reduce) {
  .context-window-button, .context-window-button__idle, .context-window-button__arc, .context-window-button__label { transform: none !important; }
  .context-window-button__matrix { display: none; }
  .context-window-button__idle, .context-window-button__label, .context-window-button__arc { transition: opacity 200ms ease !important; animation: none !important; }
}
`;

export default function ContextWindowStatusButton({
  usedTokens = 200_000,
  maxTokens = 1_000_000,
  onCompress,
}: ContextWindowStatusButtonProps) {
  const safeMax = Math.max(1, Number.isFinite(maxTokens) ? maxTokens : 1_000_000);
  const [currentUsed, setCurrentUsed] = useState(() => clampTokens(usedTokens, safeMax));
  const [phase, setPhase] = useState<Phase>("idle");
  const [lockedWidth, setLockedWidth] = useState<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);
  const timers = useRef<number[]>([]);
  const usedRatio = currentUsed / safeMax;

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  function schedule(callback: () => void, delay: number) {
    timers.current.push(window.setTimeout(callback, delay));
  }

  function beginReturn(nextUsed: number) {
    setCurrentUsed(nextUsed);
    setPhase("returning");
  }

  function finish() {
    setPhase("idle");
    busyRef.current = false;
    timers.current = [];
    onCompress?.();
  }

  function handleClick() {
    if (busyRef.current) return;
    busyRef.current = true;
    setLockedWidth((width) => width ?? buttonRef.current?.getBoundingClientRect().width ?? null);

    const nextUsed = Math.round(safeMax * 0.01);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      setPhase("compressing");
      schedule(() => setPhase("compressed"), 500);
      schedule(() => beginReturn(nextUsed), 1100);
      schedule(() => finish(), 1350);
      return;
    }

    setPhase("exiting");
    schedule(() => setPhase("compressing"), 220);
    schedule(() => setPhase("compressed"), 3220);
    schedule(() => beginReturn(nextUsed), 4120);
    schedule(() => finish(), 4700);
  }

  return (
    <>
      <style>{STYLES}</style>
      <button
        ref={buttonRef}
        type="button"
        className="context-window-button"
        data-phase={phase}
        aria-label={`Context ${formatTokens(currentUsed)} of ${formatTokens(safeMax)}, compress`}
        aria-busy={phase !== "idle"}
        onClick={handleClick}
        style={lockedWidth === null ? undefined : { width: lockedWidth }}
      >
        <span className="context-window-button__idle" aria-hidden="true">
          <svg className="context-window-button__pie" viewBox="0 0 18 18">
            <circle className="context-window-button__track" cx="9" cy="9" r="6.5" />
            <circle
              className="context-window-button__arc"
              cx="9"
              cy="9"
              r="6.5"
              pathLength={CIRCLE_LENGTH}
              strokeDasharray={CIRCLE_LENGTH}
              strokeDashoffset={CIRCLE_LENGTH * (1 - usedRatio)}
              transform="rotate(-90 9 9)"
            />
          </svg>
          <span className="context-window-button__readout">
            {formatTokens(currentUsed)} / {formatTokens(safeMax)}
          </span>
        </span>

        <span className="context-window-button__matrix" aria-hidden="true">
          <span className="context-window-button__square-field" />
          <span className="context-window-button__square-fill" />
        </span>

        <span className="context-window-button__status" aria-hidden="true">
          <span className="context-window-button__label context-window-button__label--compressing">compressing</span>
          <span className="context-window-button__label context-window-button__label--compressed">compressed</span>
        </span>
      </button>
    </>
  );
}

export const ContextWindowStatusPreview = ContextWindowStatusButton;
