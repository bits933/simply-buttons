import { useEffect, useRef } from "react";

const CELL = 14;
const RADIUS = 210;
const DISPLACEMENT = 64;
const BAND_SPEED = 42000;
const TILT = Math.PI / 6;
const GDX = Math.cos(TILT);
const GDY = Math.sin(TILT);
const GLYPHS = [".", ":", "+", "*"];
const FONTS = {
  sm: '6px "IBM Plex Mono", monospace',
  md: '8px "IBM Plex Mono", monospace',
  lg: '10px "IBM Plex Mono", monospace',
};

function hash(cx, cy) {
  return Math.abs(cx * 31 + cy * 17);
}

function smooth(t) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

function bandAlpha(u) {
  if (u < 0.28) return 0;
  if (u < 0.52) return smooth((u - 0.28) / 0.24);
  return 1;
}

function bandColor(u, colors) {
  if (u < 0.55) return colors.h1;
  if (u < 0.8) return colors.h2;
  return colors.h3;
}

export function TopbarBand() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bar = canvas.closest(".topbar");
    if (!bar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = 0;
    let live = false;
    let width = 0;
    let height = 0;
    let mx = 0;
    let my = 0;
    let ex = 0;
    let ey = 0;
    let field = 0;
    let colors = {
      h1: "#7c2d12",
      h2: "#ea580c",
      h3: "#fdba74",
    };

    function readColors() {
      const cs = getComputedStyle(bar);
      colors = {
        h1: cs.getPropertyValue("--band-h1").trim() || "#7c2d12",
        h2: cs.getPropertyValue("--band-h2").trim() || "#ea580c",
        h3: cs.getPropertyValue("--band-h3").trim() || "#fdba74",
      };
    }

    function resize() {
      width = bar.clientWidth;
      height = bar.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      if (field < 0.015) return;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      const ox = (width - cols * CELL) / 2 + CELL / 2;
      const oy = (height - rows * CELL) / 2 + CELL / 2;

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const cx = ox + c * CELL;
          const cy = oy + r * CELL;

          const u = cx / width;
          const ba = bandAlpha(u);
          if (ba < 0.03) continue;

          const h = hash(c, r);

          let px = cx;
          let py = cy;
          let fade = 0;

          const dx = cx - ex;
          const dy = cy - ey;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS) {
            const t = 1 - dist / RADIUS;
            const f = t * t * (3 - 2 * t) * field;
            const ux = dist > 1 ? dx / dist : ex <= width / 2 ? -1 : 1;
            const uy = dist > 1 ? dy / dist : 0;
            px += ux * f * DISPLACEMENT;
            py += uy * f * DISPLACEMENT;
            fade = f;
          }

          const alpha =
            (0.3 + (h % 5) * 0.09) * field * ba * (1 - fade * 0.92);
          if (alpha < 0.02) continue;

          ctx.globalAlpha = alpha;
          ctx.fillStyle = bandColor(u, colors);
          ctx.font = fade > 0.55 ? FONTS.sm : fade > 0.2 ? FONTS.md : FONTS.lg;
          ctx.fillText(GLYPHS[h % GLYPHS.length], px, py);
        }
      }
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      const dt = last ? Math.min(48, now - last) : 16.7;
      last = now;
      const k = Math.min(2.5, Math.max(0.25, dt / 16.7));

      ex += (mx - ex) * Math.min(1, 0.09 * k);
      ey += (my - ey) * Math.min(1, 0.09 * k);
      field += ((live ? 1 : 0) - field) * Math.min(1, 0.065 * k);

      draw(now);

      if (live || field > 0.015) {
        raf = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, width, height);
        raf = 0;
        last = 0;
      }
    }

    function start() {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    }

    function onMove(event) {
      const r = bar.getBoundingClientRect();
      mx = event.clientX - r.left;
      my = event.clientY - r.top;
      start();
    }

    function onEnter() {
      live = true;
      readColors();
      start();
    }

    function onLeave() {
      live = false;
      start();
    }

    const themeObserver = new MutationObserver(() => readColors());
    themeObserver.observe(document.documentElement, { attributes: true });
    const sizeObserver = new ResizeObserver(() => {
      resize();
      if (!raf) draw(performance.now());
    });
    sizeObserver.observe(bar);

    resize();
    readColors();

    bar.addEventListener("pointermove", onMove);
    bar.addEventListener("pointerenter", onEnter);
    bar.addEventListener("pointerleave", onLeave);
    bar.addEventListener("focusin", onEnter);
    bar.addEventListener("focusout", onLeave);

    return () => {
      bar.removeEventListener("pointermove", onMove);
      bar.removeEventListener("pointerenter", onEnter);
      bar.removeEventListener("pointerleave", onLeave);
      bar.removeEventListener("focusin", onEnter);
      bar.removeEventListener("focusout", onLeave);
      themeObserver.disconnect();
      sizeObserver.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="band" aria-hidden="true">
      <div className="band-flow band-base" />
      <div className="band-flow band-tint" />
      <canvas ref={canvasRef} className="band-canvas" />
    </div>
  );
}
