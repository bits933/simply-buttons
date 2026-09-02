import { useEffect, useLayoutEffect, useRef } from "react";
import {
  createLaunchState,
  stepLaunchFrame,
  LAUNCH_VERT_GLSL,
  LAUNCH_FRAG_GLSL,
} from "./designcode-cta.launch.js";
import "./designcode-cta.css";

const POWER2_OUT = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const POINTER_RANGE = 15;

function backOut(t, s = 1.7) {
  const p = t - 1;
  return p * p * ((s + 1) * p + s) + 1;
}

function readTranslate(el) {
  const value = getComputedStyle(el).translate;
  if (!value || value === "none") return { x: 0, y: 0 };
  const parts = value.trim().split(/\s+/);
  return {
    x: Number.parseFloat(parts[0]) || 0,
    y: Number.parseFloat(parts[1]) || 0,
  };
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function DesigncodeCtaButton({
  label = "Dive in with us",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const wrapRef = useRef(null);
  const buttonRef = useRef(null);
  const innerRef = useRef(null);
  const canvasRef = useRef(null);
  const disabledRef = useRef(disabled);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);

  disabledRef.current = disabled;

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      wrap.style.opacity = "1";
      wrap.style.transform = "scale(1)";
      wrap.style.filter = "none";
      return;
    }

    let introRaf = 0;
    const introStart = performance.now();
    const introDuration = 1200;

    const tickIntro = (now) => {
      const t = Math.min(1, (now - introStart) / introDuration);
      const eased = backOut(t, 1.7);
      wrap.style.opacity = String(Math.min(1, Math.max(0, eased)));
      wrap.style.transform = `scale(${0.6 + 0.4 * eased})`;
      wrap.style.filter = `blur(${Math.max(0, 10 * (1 - t * 1.2))}px)`;
      if (t < 1) {
        introRaf = window.requestAnimationFrame(tickIntro);
        return;
      }
      wrap.style.opacity = "1";
      wrap.style.transform = "scale(1)";
      wrap.style.filter = "none";
      introRaf = 0;
    };

    introRaf = window.requestAnimationFrame(tickIntro);

    let pointerAnim = null;

    const onPointerMove = (event) => {
      const current = readTranslate(wrap);
      const rect = wrap.getBoundingClientRect();
      const restCx = rect.left + rect.width / 2 - current.x;
      const restCy = rect.top + rect.height / 2 - current.y;
      const targetX = Math.max(
        -POINTER_RANGE,
        Math.min(POINTER_RANGE, event.clientX - restCx),
      );
      const targetY = Math.max(
        -POINTER_RANGE,
        Math.min(POINTER_RANGE, event.clientY - restCy),
      );

      pointerAnim?.cancel();
      pointerAnim = wrap.animate(
        [
          { translate: `${current.x}px ${current.y}px` },
          { translate: `${targetX}px ${targetY}px` },
        ],
        {
          duration: 2000,
          easing: POWER2_OUT,
          fill: "forwards",
        },
      );
    };

    document.addEventListener("mousemove", onPointerMove, { passive: true });

    return () => {
      if (introRaf) window.cancelAnimationFrame(introRaf);
      pointerAnim?.cancel();
      document.removeEventListener("mousemove", onPointerMove);
    };
  }, []);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const inner = innerRef.current;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!button || !inner || !canvas) return;

    let state = createLaunchState();
    let last = performance.now();
    let frameId = 0;
    let running = false;
    let disposed = false;
    let inView = true;
    let reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hoverOrFocus = () =>
      !disabledRef.current && (hoverRef.current || focusRef.current);

    const gl = canvas.getContext("webgl");
    if (!gl) {
      button.dataset.launchFallback = "true";
      return;
    }

    const program = gl.createProgram();
    const vert = compileShader(gl, gl.VERTEX_SHADER, LAUNCH_VERT_GLSL);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, LAUNCH_FRAG_GLSL);
    if (!program || !vert || !frag) {
      button.dataset.launchFallback = "true";
      if (vert) gl.deleteShader(vert);
      if (frag) gl.deleteShader(frag);
      if (program) gl.deleteProgram(program);
      return;
    }

    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    gl.deleteShader(vert);
    gl.deleteShader(frag);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      button.dataset.launchFallback = "true";
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );

    const locP = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(locP);
    gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "u_res"),
      time: gl.getUniformLocation(program, "u_time"),
      warp: gl.getUniformLocation(program, "u_warp"),
      flash: gl.getUniformLocation(program, "u_flash"),
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(inner.clientWidth * dpr));
      const height = Math.max(1, Math.round(inner.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const setActive = (active) => {
      canvas.dataset.animationActive = active ? "true" : "false";
    };

    const draw = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      state = stepLaunchFrame(state, dt, {
        hover: hoverOrFocus(),
        click: false,
      });
      resize();
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.time, reducedMotion ? 2.5 : state.time);
      gl.uniform1f(uniforms.warp, state.warp);
      gl.uniform1f(uniforms.flash, state.flash);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const stop = () => {
      running = false;
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      setActive(false);
    };

    const loop = (now) => {
      if (disposed || !running) return;
      draw(now);
      frameId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (
        running ||
        disposed ||
        !inView ||
        reducedMotion ||
        document.visibilityState === "hidden"
      ) {
        return;
      }
      running = true;
      last = performance.now();
      setActive(true);
      frameId = window.requestAnimationFrame(loop);
    };

    const syncPlayback = () => {
      if (inView && !reducedMotion && document.visibilityState === "visible") {
        start();
        return;
      }
      stop();
      draw(performance.now());
    };

    const onEnter = () => {
      hoverRef.current = true;
    };
    const onLeave = () => {
      hoverRef.current = false;
    };
    const onFocus = () => {
      focusRef.current = true;
    };
    const onBlur = () => {
      focusRef.current = false;
    };
    const onLaunchClick = () => {
      if (disabledRef.current) return;
      state = stepLaunchFrame(state, 0, {
        hover: hoverOrFocus(),
        click: true,
      });
    };

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observeTarget = wrap || button;

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            resize();
            if (!running) draw(performance.now());
          })
        : null;

    const intersectionObserver =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              inView = entries.some((entry) => entry.isIntersecting);
              syncPlayback();
            },
            { threshold: 0.08, rootMargin: "0px 0px -3% 0px" },
          )
        : null;

    const onResize = () => {
      resize();
      if (!running) draw(performance.now());
    };
    const onVisibility = () => syncPlayback();
    const onMotionChange = () => {
      reducedMotion = media.matches;
      syncPlayback();
    };

    resizeObserver?.observe(inner);
    intersectionObserver?.observe(observeTarget);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    media.addEventListener?.("change", onMotionChange);
    // Hover on wrap matches live; focus on the control for keyboard warp.
    (wrap || button).addEventListener("mouseenter", onEnter);
    (wrap || button).addEventListener("mouseleave", onLeave);
    button.addEventListener("focus", onFocus);
    button.addEventListener("blur", onBlur);
    button.addEventListener("click", onLaunchClick);

    last = performance.now();
    resize();
    const box = observeTarget.getBoundingClientRect();
    inView = box.bottom > 0 && box.top < window.innerHeight;
    setActive(false);
    draw(performance.now());
    syncPlayback();

    return () => {
      disposed = true;
      stop();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener?.("change", onMotionChange);
      (wrap || button).removeEventListener("mouseenter", onEnter);
      (wrap || button).removeEventListener("mouseleave", onLeave);
      button.removeEventListener("focus", onFocus);
      button.removeEventListener("blur", onBlur);
      button.removeEventListener("click", onLaunchClick);
      delete canvas.dataset.animationActive;
      delete button.dataset.launchFallback;
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [disabled]);

  return (
    <div
      ref={wrapRef}
      className={["space-launch-button-wrap", className].filter(Boolean).join(" ")}
    >
      <button
        ref={buttonRef}
        className="space-launch-button"
        {...rest}
        type="button"
        disabled={disabled}
        aria-disabled={disabled || undefined}
        onClick={onClick}
      >
        <span ref={innerRef} className="space-launch-button-inner">
          <canvas
            ref={canvasRef}
            className="space-launch-button-canvas"
            aria-hidden="true"
          />
          <span className="space-launch-button-label">{label}</span>
        </span>
      </button>
    </div>
  );
}

export function DesigncodeCtaPreview() {
  return (
    <div className="space-launch-button-cluster">
      <DesigncodeCtaButton />
    </div>
  );
}
