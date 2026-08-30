import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

export type PixelRippleButtonProps = {
  label?: string;
  onClick?: () => void;
};

type Point = { x: number; y: number; time: number };
type Ripple = Point;
type Tile = { x: number; y: number; width: number; height: number; noise: number; row: number };
type Sparkle = { index: number; startTime: number; duration: number };

const COLUMNS = 42;
const ROWS = 13;
const GUTTER = 1.25;
const RIPPLE_SPEED = 0.48;
const TRAIL_LIFETIME = 680;
const RIPPLE_LIFETIME = 1400;
const TOP_CYAN = [63, 210, 237];
const BOTTOM_CYAN = [25, 165, 192];
const RIPPLE_CYAN = [225, 252, 255];

function mix(from: number[], to: number[], amount: number) {
  return from.map((value, index) => Math.round(value + (to[index] - value) * amount));
}

function addLift(base: number[], amount: number) {
  return base.map((value) => Math.min(255, value + 255 * amount));
}

function hash(index: number) {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function distance(a: Point, x: number, y: number) {
  return Math.hypot(a.x - x, a.y - y);
}

const STYLES = `
.pixel-ripple-button { position:relative; isolation:isolate; display:grid; place-items:center; width:240px; height:64px; padding:0; overflow:hidden; border:0; border-radius:999px; background:#0e5369; box-shadow:0 8px 22px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06), inset 0 1.5px 1px rgb(255 255 255 / 10%), inset 0 -2px 6px rgb(3 25 35 / 40%), inset 0 0 16px rgb(63 210 237 / 35%); color:#FFFFFF; cursor:pointer; font:600 16px/1 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; letter-spacing:-.025em; touch-action:manipulation; -webkit-tap-highlight-color:transparent; transition:transform 160ms cubic-bezier(.2,.9,.25,1),box-shadow 180ms ease; }
.pixel-ripple-button::after { content:""; position:absolute; z-index:1; inset:0; border-radius:inherit; pointer-events:none; box-shadow:inset 0 1.5px 1.5px rgb(255 255 255 / 12%), inset 0 -3px 8px rgb(3 25 35 / 45%), inset 0 0 18px rgb(63 210 237 / 30%); }
.pixel-ripple-button:hover { box-shadow:0 12px 28px rgba(0, 0, 0, 0.16), 0 3px 8px rgba(0, 0, 0, 0.08), inset 0 1.5px 1px rgb(255 255 255 / 14%), inset 0 -2px 6px rgb(3 25 35 / 35%), inset 0 0 20px rgb(63 210 237 / 45%); }
.pixel-ripple-button:active { transform:scale(.98); transition-duration:80ms; }
.pixel-ripple-button:focus-visible { outline:3px solid rgb(63 210 237 / 55%); outline-offset:4px; }
.pixel-ripple-button__canvas { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.pixel-ripple-button__flash { position:absolute; z-index:2; inset:0; opacity:0; background:rgb(63 210 237 / 35%); pointer-events:none; transition:opacity 120ms ease; }
.pixel-ripple-button--flash .pixel-ripple-button__flash { opacity:1; }
.pixel-ripple-button__label { position:relative; z-index:2; pointer-events:none; text-shadow:0 1px 2px rgb(2 25 35 / 75%); }
.pixel-ripple-demo { position:relative; display:grid; width:100%; min-height:172px; place-items:center; overflow:hidden; isolation:isolate; background:transparent; }
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
  const sparklesRef = useRef<Sparkle[]>([]);
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
          noise: 0.25 + hash(index) * 0.30,
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
      const maxDist = Math.hypot(width, height);
      const contextWidth = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
      if (Math.abs(contextWidth - width) > 0.5) measure();

      context.clearRect(0, 0, width, height);
      context.save();
      context.beginPath();
      context.roundRect(0, 0, width, height, height / 2);
      context.clip();

      trailRef.current = trailRef.current.filter((point) => time - point.time < TRAIL_LIFETIME);
      ripplesRef.current = ripplesRef.current.filter((ripple) => time - ripple.time < RIPPLE_LIFETIME);

      // Sparkle management: 2% of the dots sparkling at a time, up to +30% opacity increase
      const targetSparkleCount = Math.max(1, Math.round(tilesRef.current.length * 0.02));
      const sparkleMap = new Map<number, number>();

      if (!reducedMotionRef.current && tilesRef.current.length > 0) {
        sparklesRef.current = sparklesRef.current.filter(
          (s) => time < s.startTime + s.duration
        );

        const activeIndices = new Set(sparklesRef.current.map((s) => s.index));
        while (sparklesRef.current.length < targetSparkleCount) {
          const candidate = Math.floor(Math.random() * tilesRef.current.length);
          if (!activeIndices.has(candidate)) {
            activeIndices.add(candidate);
            sparklesRef.current.push({
              index: candidate,
              startTime: time + Math.random() * 120,
              duration: 900 + Math.random() * 600,
            });
          }
        }

        for (const sparkle of sparklesRef.current) {
          if (time >= sparkle.startTime) {
            const progress = (time - sparkle.startTime) / sparkle.duration;
            if (progress >= 0 && progress <= 1) {
              // Smooth sine wave pulse: 0 -> 1 -> 0
              const intensity = Math.sin(progress * Math.PI);
              // Max 30% opacity boost (not more than 30%)
              sparkleMap.set(sparkle.index, intensity * 0.30);
            }
          }
        }
      }

      for (let i = 0; i < tilesRef.current.length; i++) {
        const tile = tilesRef.current[i];
        const centerX = tile.x + tile.width / 2;
        const centerY = tile.y + tile.height / 2;
        const verticalMix = tile.row / (ROWS - 1);
        const baseRgb = mix(TOP_CYAN, BOTTOM_CYAN, verticalMix);
        let pointerStrength = 0;
        let rippleStrength = 0;
        let rippleFade = 1;

        for (const trail of trailRef.current) {
          const age = (time - trail.time) / TRAIL_LIFETIME;
          const dist = distance(trail, centerX, centerY);
          const normalizedDist = Math.min(1, dist / 76);
          const radialFalloff = Math.pow(Math.max(0, 1 - normalizedDist), 1.6);
          pointerStrength = Math.max(pointerStrength, radialFalloff * Math.max(0, 1 - age));
        }

        for (const ripple of ripplesRef.current) {
          const dist = distance(ripple, centerX, centerY);
          const waveRadius = (time - ripple.time) * RIPPLE_SPEED;
          const waveDiff = dist - waveRadius;
          const crest = Math.exp(-Math.pow(waveDiff / 22, 2));
          const afterglow = 0.22 * Math.exp(-(time - ripple.time) / 360) * (waveDiff < 0 ? 1 : 0);
          const travelRatio = Math.min(1, dist / (maxDist * 0.95));
          const distanceFade = Math.pow(Math.max(0, 1 - travelRatio), 1.35);
          const timeFade = Math.max(0, 1 - (time - ripple.time) / RIPPLE_LIFETIME);
          const localStrength = (crest + afterglow) * distanceFade * timeFade;
          if (localStrength > rippleStrength) {
            rippleStrength = localStrength;
            rippleFade = distanceFade;
          }
        }

        const sparkleBoost = sparkleMap.get(i) || 0;
        const hoverLift = tile.noise * (pointerStrength * 2.0);
        const hoverColorGlow = Math.max(pointerStrength * 0.45, sparkleBoost * 0.5);
        const tileOpacity = Math.min(1, tile.noise + sparkleBoost + hoverLift + rippleStrength * 0.75);
        const litBase = mix(baseRgb, RIPPLE_CYAN, hoverColorGlow);
        const tileRgb = mix(litBase, RIPPLE_CYAN, Math.min(0.92, rippleStrength * rippleFade * 1.2));

        context.fillStyle = `rgba(${tileRgb[0]}, ${tileRgb[1]}, ${tileRgb[2]}, ${tileOpacity.toFixed(3)})`;
        context.beginPath();
        context.roundRect(tile.x, tile.y, tile.width, tile.height, 1);
        context.fill();
      }

      context.restore();
      if (!reducedMotionRef.current || pointerInsideRef.current || trailRef.current.length || ripplesRef.current.length) {
        wake();
      }
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
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    pointerInsideRef.current = true;
    const point = pointFrom(event.clientX, event.clientY);
    if (point) addTrail(point);
  }

  function handlePointerEnter(event: PointerEvent<HTMLButtonElement>) {
    pointerInsideRef.current = true;
    const point = pointFrom(event.clientX, event.clientY);
    if (point) addTrail(point);
  }

  function handlePointerLeave() {
    pointerInsideRef.current = false;
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    const point = pointFrom(event.clientX, event.clientY);
    if (point) addRipple(point);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      const bounds = buttonRef.current?.getBoundingClientRect();
      if (!bounds) return;
      addRipple({
        x: bounds.width / 2,
        y: bounds.height / 2,
        time: performance.now(),
      });
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        className={`pixel-ripple-button ${flash ? "pixel-ripple-button--flash" : ""}`}
        onClick={onClick}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
      >
        <canvas ref={canvasRef} className="pixel-ripple-button__canvas" />
        <span className="pixel-ripple-button__flash" aria-hidden="true" />
        <span className="pixel-ripple-button__label">{label}</span>
      </button>
    </>
  );
}

export function PixelRipplePreview() {
  return (
    <div className="pixel-ripple-demo">
      <PixelRippleButton />
    </div>
  );
}
