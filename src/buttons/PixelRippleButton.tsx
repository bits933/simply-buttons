import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

export type PixelRippleButtonProps = {
  label?: string;
  onClick?: () => void;
};

type Point = { x: number; y: number; time: number };
type Ripple = Point;
type Tile = { x: number; y: number; width: number; height: number; noise: number; row: number };

const COLUMNS = 42;
const ROWS = 13;
const GUTTER = 1.25;
const RIPPLE_SPEED = 1;
const TRAIL_LIFETIME = 640;
const RIPPLE_LIFETIME = 720;
const TOP_BLUE = [73, 112, 225];
const BOTTOM_BLUE = [39, 79, 207];
const POINTER_BLUE = [126, 155, 242];
const RIPPLE_BLUE = [220, 247, 255];

function mix(from: number[], to: number[], amount: number) {
  return from.map((value, index) => Math.round(value + (to[index] - value) * amount));
}

function color(rgb: number[]) {
  return `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})`;
}

function hash(index: number) {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function distance(a: Point, x: number, y: number) {
  return Math.hypot(a.x - x, a.y - y);
}

const STYLES = `
.pixel-ripple-button { position:relative; isolation:isolate; display:grid; place-items:center; width:240px; height:64px; padding:0; overflow:hidden; border:0; border-radius:999px; background:#1F46BD; box-shadow:0 10px 28px rgb(73 112 225 / 35%), inset 0 1px 0 rgb(255 255 255 / 18%); color:#FFFFFF; cursor:pointer; font:600 16px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; letter-spacing:-.025em; touch-action:manipulation; -webkit-tap-highlight-color:transparent; transition:transform 160ms cubic-bezier(.2,.9,.25,1),box-shadow 180ms ease; }
.pixel-ripple-button:hover { box-shadow:0 12px 32px rgb(73 112 225 / 42%), inset 0 1px 0 rgb(255 255 255 / 21%); }
.pixel-ripple-button:active { transform:scale(.98); transition-duration:80ms; }
.pixel-ripple-button:focus-visible { outline:3px solid rgb(73 112 225 / 38%); outline-offset:4px; }
.pixel-ripple-button__canvas { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.pixel-ripple-button__flash { position:absolute; inset:0; opacity:0; background:rgb(219 242 255 / 58%); pointer-events:none; transition:opacity 120ms ease; }
.pixel-ripple-button--flash .pixel-ripple-button__flash { opacity:1; }
.pixel-ripple-button__label { position:relative; z-index:1; pointer-events:none; text-shadow:0 1px 1px rgb(19 54 144 / 28%); }
.pixel-ripple-demo { position:relative; display:grid; width:100%; min-height:172px; place-items:center; overflow:hidden; isolation:isolate; background:#F7FAFD; }
.pixel-ripple-demo::before,.pixel-ripple-demo::after { content:""; position:absolute; z-index:-1; width:390px; height:390px; border:1px solid rgb(73 112 225 / 8%); border-radius:50%; }
.pixel-ripple-demo::after { width:255px; height:255px; border-color:rgb(73 112 225 / 11%); }
@media (prefers-reduced-motion:reduce) { .pixel-ripple-button { transition:background-color 120ms ease,box-shadow 120ms ease; } .pixel-ripple-button:active { transform:none; } }
`;

export default function PixelRippleButton({
  label = "Get started",
  onClick,
}: PixelRippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tilesRef = useRef<Tile[]>([]);
  const trailRef = useRef<Point[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const frameRef = useRef(0);
  const renderRef = useRef<(time: number) => void>(() => {});
  const pointerInsideRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const flashTimerRef = useRef(0);
  const [flash, setFlash] = useState(false);

  function wake() {
    if (!frameRef.current) {
      frameRef.current = window.requestAnimationFrame((time) => renderRef.current(time));
    }
  }

  function pointFrom(clientX: number, clientY: number): Point | null {
    const bounds = buttonRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    return { x: clientX - bounds.left, y: clientY - bounds.top, time: performance.now() };
  }

  function addTrail(point: Point) {
    const previous = trailRef.current.at(-1);
    if (!previous || distance(previous, point.x, point.y) > 2.5) trailRef.current.push(point);
    wake();
  }

  function addRipple(point: Point) {
    if (reducedMotionRef.current) {
      setFlash(true);
      window.clearTimeout(flashTimerRef.current);
      flashTimerRef.current = window.setTimeout(() => setFlash(false), 120);
      return;
    }
    ripplesRef.current.push(point);
    wake();
  }

  useEffect(() => {
    const button = buttonRef.current;
    const canvas = canvasRef.current;
    if (!button || !canvas) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => { reducedMotionRef.current = media.matches; };
    updateMotion();
    media.addEventListener?.("change", updateMotion);

    function measure() {
      const bounds = button.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas.height = Math.max(1, Math.round(bounds.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const width = bounds.width;
      const height = bounds.height;
      const tileWidth = (width - (COLUMNS - 1) * GUTTER) / COLUMNS;
      const tileHeight = (height - (ROWS - 1) * GUTTER) / ROWS;
      tilesRef.current = Array.from({ length: ROWS * COLUMNS }, (_, index) => {
        const row = Math.floor(index / COLUMNS);
        const column = index % COLUMNS;
        return {
          x: column * (tileWidth + GUTTER),
          y: row * (tileHeight + GUTTER),
          width: tileWidth,
          height: tileHeight,
          noise: 0.92 + hash(index) * 0.16,
          row,
        };
      });
      wake();
    }

    function render(time: number) {
      frameRef.current = 0;
      const bounds = button.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;
      const contextWidth = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
      if (Math.abs(contextWidth - width) > 0.5) measure();

      context.clearRect(0, 0, width, height);
      context.save();
      context.beginPath();
      context.roundRect(0, 0, width, height, height / 2);
      context.clip();

      trailRef.current = trailRef.current.filter((point) => time - point.time < TRAIL_LIFETIME);
      ripplesRef.current = ripplesRef.current.filter((ripple) => time - ripple.time < RIPPLE_LIFETIME);

      for (const tile of tilesRef.current) {
        const centerX = tile.x + tile.width / 2;
        const centerY = tile.y + tile.height / 2;
        const verticalMix = tile.row / (ROWS - 1);
        const base = mix(TOP_BLUE, BOTTOM_BLUE, verticalMix).map((value) => Math.round(value * tile.noise));
        let pointerStrength = 0;
        let rippleStrength = 0;

        for (const trail of trailRef.current) {
          const age = (time - trail.time) / TRAIL_LIFETIME;
          const falloff = Math.max(0, 1 - distance(trail, centerX, centerY) / 56);
          pointerStrength = Math.max(pointerStrength, falloff * falloff * (1 - age));
        }

        for (const ripple of ripplesRef.current) {
          const impact = time - ripple.time - distance(ripple, centerX, centerY) / RIPPLE_SPEED;
          if (impact < 0) continue;
          const crest = Math.exp(-Math.pow(impact / 13, 2));
          const afterglow = 0.3 * Math.exp(-impact / 200);
          rippleStrength = Math.max(rippleStrength, Math.min(1, crest + afterglow));
        }

        const lit = mix(base, POINTER_BLUE, Math.min(0.82, pointerStrength * 0.8));
        context.fillStyle = color(mix(lit, RIPPLE_BLUE, Math.min(0.98, rippleStrength)));
        context.beginPath();
        context.roundRect(tile.x, tile.y, tile.width, tile.height, 1);
        context.fill();
      }

      context.restore();
      if (pointerInsideRef.current || trailRef.current.length || ripplesRef.current.length) wake();
    }

    renderRef.current = render;
    const observer = new ResizeObserver(measure);
    observer.observe(button);
    measure();

    return () => {
      observer.disconnect();
      media.removeEventListener?.("change", updateMotion);
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      window.clearTimeout(flashTimerRef.current);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const point = pointFrom(event.clientX, event.clientY);
    if (point) addTrail(point);
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    const point = pointFrom(event.clientX, event.clientY);
    if (point) addRipple(point);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.repeat || (event.key !== "Enter" && event.key !== " ")) return;
    const bounds = buttonRef.current?.getBoundingClientRect();
    if (bounds) addRipple({ x: bounds.width / 2, y: bounds.height / 2, time: performance.now() });
  }

  return (
    <>
      <style>{STYLES}</style>
      <button
        ref={buttonRef}
        type="button"
        className={flash ? "pixel-ripple-button pixel-ripple-button--flash" : "pixel-ripple-button"}
        aria-label={label}
        onClick={onClick}
        onPointerEnter={(event) => {
          pointerInsideRef.current = true;
          const point = pointFrom(event.clientX, event.clientY);
          if (point) addTrail(point);
        }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerLeave={() => {
          pointerInsideRef.current = false;
          wake();
        }}
        onKeyDown={handleKeyDown}
      >
        <canvas ref={canvasRef} className="pixel-ripple-button__canvas" aria-hidden="true" />
        <span className="pixel-ripple-button__flash" aria-hidden="true" />
        <span className="pixel-ripple-button__label">{label}</span>
      </button>
    </>
  );
}

export function PixelRipplePreview() {
  return <div className="pixel-ripple-demo"><PixelRippleButton /></div>;
}
