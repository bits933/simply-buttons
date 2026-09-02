/* Shooting stars snippets — self-contained HTML / React / Node stacks.
   Inlines chrome CSS, launch stepper, starfield GLSL, and WebGL runtime. */

const CSS = `.space-launch-button-wrap {
  display: inline-flex;
  flex-shrink: 0;
  max-width: none;
  opacity: 0;
  transform: scale(0.6);
  filter: blur(10px);
}

.space-launch-button {
  position: relative;
  display: block;
  width: auto;
  min-width: 15.5rem;
  max-width: none;
  height: 3.35rem;
  padding: 5px;
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  outline: none;
  text-decoration: none;
  background: linear-gradient(180deg, #3a3d52, #15151f 55%, #262838);
  box-shadow: 0 22px 44px #0f0c1859, 0 3px 10px #00000059, inset 0 1px #ffffff24;
  transition: transform 0.3s cubic-bezier(0.34, 1.4, 0.5, 1), box-shadow 0.3s ease;
  color: inherit;
  box-sizing: border-box;
  font: inherit;
}

.space-launch-button:hover:not([aria-disabled="true"]) {
  transform: translateY(-2px);
  box-shadow: 0 28px 56px #4338ca47, 0 4px 12px #0006, inset 0 1px #ffffff29;
}

.space-launch-button:active:not([aria-disabled="true"]) {
  transform: translateY(1px) scale(0.985);
}

.space-launch-button:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 5px;
}

.space-launch-button[aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.45;
  pointer-events: none;
}

.space-launch-button[data-launch-fallback="true"] .space-launch-button-inner {
  background: linear-gradient(180deg, #4338caf2, #312e81fa);
}

.space-launch-button-inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 2.45rem;
  padding: 0 1.25rem;
  overflow: hidden;
  border-radius: 10px;
  background: #06050a;
  box-shadow: inset 0 2px 8px #000000e6;
}

.space-launch-button-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  min-height: inherit;
  pointer-events: none;
}

.space-launch-button-label {
  position: relative;
  z-index: 1;
  pointer-events: none;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-indent: 0.28em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #eef2ff;
  text-shadow: 0 0 14px rgba(129, 140, 248, 0.55), 0 1px 6px rgba(0, 0, 0, 0.9);
}

.space-launch-button-cluster {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  max-width: none;
}

@media (prefers-reduced-motion: reduce) {
  .space-launch-button-wrap {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  .space-launch-button:hover:not([aria-disabled="true"]),
  .space-launch-button:active:not([aria-disabled="true"]) {
    transform: none;
  }
}
`;

const LAUNCH_VERT_GLSL = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const LAUNCH_FRAG_GLSL = `precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_warp;
uniform float u_flash;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p);
  vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);
}
float fbm(vec2 p){
  float v=0.0; float a=0.5;
  for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.07+vec2(13.1,5.7); a*=0.5; }
  return v;
}
void main(){
  vec2 sc = gl_FragCoord.xy / u_res;
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  float r = length(uv), rr = max(r, 0.08), a = atan(uv.y, uv.x), t = u_time;
  vec3 col = vec3(0.012, 0.011, 0.018);
  float hz = fbm(uv * 2.6 + vec2(t * 0.35, 1.7));
  col += vec3(0.08, 0.06, 0.18) * hz * (0.7 + 0.6 * u_warp);
  for (int i = 0; i < 3; i++) {
    float fi = float(i), ringN = 26.0 + fi * 9.0;
    vec2 sp = vec2((a / 6.28318 + 0.5) * ringN, (0.3 + fi * 0.22) / rr + t * (2.0 + fi * 1.2));
    vec2 cell = floor(sp), f = fract(sp);
    float h = hash(cell + fi * 17.31), on = step(0.68, h);
    vec2 c = vec2(0.2 + 0.6 * hash(cell + 4.7), 0.5), dlt = f - c;
    float sy = mix(130.0, 8.0, u_warp), star = on * exp(-(dlt.x * dlt.x * 150.0 + dlt.y * dlt.y * sy));
    float tw = (0.7 + 0.3 * sin(h * 81.0 + t * 9.0));
    vec3 sCol = mix(vec3(0.88, 0.9, 1.0), vec3(0.55, 0.58, 0.98), step(0.9, h));
    col += sCol * star * mix(tw, 1.0, u_warp) * smoothstep(0.02, 0.25, r) * (1.1 + 0.7 * u_warp);
  }
  col += vec3(0.55, 0.52, 0.98) * u_warp * 0.32 * exp(-r * 4.0);
  col = mix(col, vec3(0.92, 0.94, 1.0), clamp(u_flash, 0.0, 1.0));
  gl_FragColor = vec4(col, 1.0);
}`;

const PAGE_JS = `
(function () {
  var VERT = ${JSON.stringify(LAUNCH_VERT_GLSL)};
  var FRAG = ${JSON.stringify(LAUNCH_FRAG_GLSL)};
  var POWER2_OUT = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
  var POINTER_RANGE = 15;

  function createLaunchState() {
    return { warp: 0, warpTarget: 0, flash: 0, time: 0 };
  }

  function stepLaunchFrame(state, dt, opts) {
    opts = opts || {};
    var hover = !!opts.hover;
    var click = !!opts.click;
    var next = {
      warp: state.warp,
      warpTarget: state.warpTarget,
      flash: state.flash,
      time: state.time,
    };
    if (click) {
      next.flash = 1;
      next.warp = 0;
      next.time = 0;
    }
    next.warpTarget = hover ? 1 : 0;
    next.warp += (next.warpTarget - next.warp) * Math.min(1, dt * 2.6);
    next.flash *= Math.exp(-4.5 * dt);
    next.time += dt * (0.05 + next.warp * 1.35);
    return next;
  }

  function backOut(t, s) {
    s = s == null ? 1.7 : s;
    var p = t - 1;
    return p * p * ((s + 1) * p + s) + 1;
  }

  function readTranslate(el) {
    var value = getComputedStyle(el).translate;
    if (!value || value === "none") return { x: 0, y: 0 };
    var parts = value.trim().split(/\\s+/);
    return {
      x: Number.parseFloat(parts[0]) || 0,
      y: Number.parseFloat(parts[1]) || 0,
    };
  }

  function compileShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var wrap = document.querySelector(".space-launch-button-wrap");
  var button = document.querySelector(".space-launch-button");
  var inner = document.querySelector(".space-launch-button-inner");
  var canvas = document.querySelector(".space-launch-button-canvas");
  if (!wrap || !button || !inner || !canvas) return;

  var reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    wrap.style.opacity = "1";
    wrap.style.transform = "scale(1)";
    wrap.style.filter = "none";
  } else {
    var introRaf = 0;
    var introStart = performance.now();
    var introDuration = 1200;
    var tickIntro = function (now) {
      var t = Math.min(1, (now - introStart) / introDuration);
      var eased = backOut(t, 1.7);
      wrap.style.opacity = String(Math.min(1, Math.max(0, eased)));
      wrap.style.transform = "scale(" + (0.6 + 0.4 * eased) + ")";
      wrap.style.filter = "blur(" + Math.max(0, 10 * (1 - t * 1.2)) + "px)";
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

    var pointerAnim = null;
    document.addEventListener(
      "mousemove",
      function (event) {
        var current = readTranslate(wrap);
        var rect = wrap.getBoundingClientRect();
        var restCx = rect.left + rect.width / 2 - current.x;
        var restCy = rect.top + rect.height / 2 - current.y;
        var targetX = Math.max(
          -POINTER_RANGE,
          Math.min(POINTER_RANGE, event.clientX - restCx),
        );
        var targetY = Math.max(
          -POINTER_RANGE,
          Math.min(POINTER_RANGE, event.clientY - restCy),
        );
        if (pointerAnim && pointerAnim.cancel) pointerAnim.cancel();
        pointerAnim = wrap.animate(
          [
            { translate: current.x + "px " + current.y + "px" },
            { translate: targetX + "px " + targetY + "px" },
          ],
          { duration: 2000, easing: POWER2_OUT, fill: "forwards" },
        );
      },
      { passive: true },
    );
  }

  var state = createLaunchState();
  var last = performance.now();
  var frameId = 0;
  var running = false;
  var disposed = false;
  var inView = true;
  var hover = false;
  var focus = false;
  var reducedMotion = reduced;

  var gl = canvas.getContext("webgl");
  if (!gl) {
    button.dataset.launchFallback = "true";
    return;
  }

  var program = gl.createProgram();
  var vert = compileShader(gl, gl.VERTEX_SHADER, VERT);
  var frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!program || !vert || !frag) {
    button.dataset.launchFallback = "true";
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
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  var locP = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(locP);
  gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

  var uniforms = {
    resolution: gl.getUniformLocation(program, "u_res"),
    time: gl.getUniformLocation(program, "u_time"),
    warp: gl.getUniformLocation(program, "u_warp"),
    flash: gl.getUniformLocation(program, "u_flash"),
  };

  function hoverOrFocus() {
    return hover || focus;
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = Math.max(1, Math.round(inner.clientWidth * dpr));
    var height = Math.max(1, Math.round(inner.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function setActive(active) {
    canvas.dataset.animationActive = active ? "true" : "false";
  }

  function draw(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    state = stepLaunchFrame(state, dt, { hover: hoverOrFocus(), click: false });
    resize();
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, reducedMotion ? 2.5 : state.time);
    gl.uniform1f(uniforms.warp, state.warp);
    gl.uniform1f(uniforms.flash, state.flash);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function stop() {
    running = false;
    if (frameId) {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    }
    setActive(false);
  }

  function loop(now) {
    if (disposed || !running) return;
    draw(now);
    frameId = window.requestAnimationFrame(loop);
  }

  function start() {
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
  }

  function syncPlayback() {
    if (inView && !reducedMotion && document.visibilityState === "visible") {
      start();
      return;
    }
    stop();
    draw(performance.now());
  }

  wrap.addEventListener("mouseenter", function () {
    hover = true;
  });
  wrap.addEventListener("mouseleave", function () {
    hover = false;
  });
  button.addEventListener("focus", function () {
    focus = true;
  });
  button.addEventListener("blur", function () {
    focus = false;
  });
  button.addEventListener("click", function () {
    state = stepLaunchFrame(state, 0, {
      hover: hoverOrFocus(),
      click: true,
    });
  });

  var media = window.matchMedia("(prefers-reduced-motion: reduce)");
  var resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(function () {
          resize();
          if (!running) draw(performance.now());
        })
      : null;
  var intersectionObserver =
    typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(
          function (entries) {
            inView = entries.some(function (entry) {
              return entry.isIntersecting;
            });
            syncPlayback();
          },
          { threshold: 0.08, rootMargin: "0px 0px -3% 0px" },
        )
      : null;

  if (resizeObserver) resizeObserver.observe(inner);
  if (intersectionObserver) intersectionObserver.observe(wrap);
  window.addEventListener(
    "resize",
    function () {
      resize();
      if (!running) draw(performance.now());
    },
    { passive: true },
  );
  document.addEventListener("visibilitychange", syncPlayback);
  if (media.addEventListener) {
    media.addEventListener("change", function () {
      reducedMotion = media.matches;
      syncPlayback();
    });
  }

  last = performance.now();
  resize();
  var box = wrap.getBoundingClientRect();
  inView = box.bottom > 0 && box.top < window.innerHeight;
  setActive(false);
  draw(performance.now());
  syncPlayback();
})();
`.trim();

const MARKUP = `<div class="space-launch-button-cluster">
  <div class="space-launch-button-wrap">
    <a class="space-launch-button" href="/pricing">
      <span class="space-launch-button-inner">
        <canvas class="space-launch-button-canvas" aria-hidden="true"></canvas>
        <span class="space-launch-button-label">Dive in with us</span>
      </span>
    </a>
  </div>
</div>`;

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shooting stars</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #06050a;
      font-family: Inter, system-ui, sans-serif;
    }
${CSS}
  </style>
</head>
<body>
  ${MARKUP}
  <script>
${PAGE_JS}
  </script>
</body>
</html>
`;

const REACT_SNIPPET = `"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const CSS = ${JSON.stringify(CSS)};
const LAUNCH_VERT_GLSL = ${JSON.stringify(LAUNCH_VERT_GLSL)};
const LAUNCH_FRAG_GLSL = ${JSON.stringify(LAUNCH_FRAG_GLSL)};
const POWER2_OUT = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
const POINTER_RANGE = 15;

function createLaunchState() {
  return { warp: 0, warpTarget: 0, flash: 0, time: 0 };
}

function stepLaunchFrame(state, dt, { hover = false, click = false } = {}) {
  const next = { ...state };
  if (click) {
    next.flash = 1;
    next.warp = 0;
    next.time = 0;
  }
  next.warpTarget = hover ? 1 : 0;
  next.warp += (next.warpTarget - next.warp) * Math.min(1, dt * 2.6);
  next.flash *= Math.exp(-4.5 * dt);
  next.time += dt * (0.05 + next.warp * 1.35);
  return next;
}

function backOut(t, s = 1.7) {
  const p = t - 1;
  return p * p * ((s + 1) * p + s) + 1;
}

function readTranslate(el) {
  const value = getComputedStyle(el).translate;
  if (!value || value === "none") return { x: 0, y: 0 };
  const parts = value.trim().split(/\\s+/);
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

export default function DesigncodeCtaButton({
  label = "Dive in with us",
  href = "/pricing",
  disabled = false,
  className = "",
  onClick,
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
    if (document.getElementById("designcode-cta-styles")) return;
    const tag = document.createElement("style");
    tag.id = "designcode-cta-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

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
    const tickIntro = (now) => {
      const t = Math.min(1, (now - introStart) / 1200);
      const eased = backOut(t, 1.7);
      wrap.style.opacity = String(Math.min(1, Math.max(0, eased)));
      wrap.style.transform = \`scale(\${0.6 + 0.4 * eased})\`;
      wrap.style.filter = \`blur(\${Math.max(0, 10 * (1 - t * 1.2))}px)\`;
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
          { translate: \`\${current.x}px \${current.y}px\` },
          { translate: \`\${targetX}px \${targetY}px\` },
        ],
        { duration: 2000, easing: POWER2_OUT, fill: "forwards" },
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
    const onLaunchClick = (event) => {
      if (disabledRef.current) {
        event.preventDefault();
        return;
      }
      state = stepLaunchFrame(state, 0, {
        hover: hoverOrFocus(),
        click: true,
      });
      onClick?.(event);
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
  }, [disabled, onClick]);

  return (
    <div className={["space-launch-button-cluster", className].filter(Boolean).join(" ")}>
      <div ref={wrapRef} className="space-launch-button-wrap">
        <a
          ref={buttonRef}
          className="space-launch-button"
          href={disabled ? undefined : href}
          aria-disabled={disabled || undefined}
          onClick={disabled ? (event) => event.preventDefault() : undefined}
        >
          <span ref={innerRef} className="space-launch-button-inner">
            <canvas
              ref={canvasRef}
              className="space-launch-button-canvas"
              aria-hidden="true"
            />
            <span className="space-launch-button-label">{label}</span>
          </span>
        </a>
      </div>
    </div>
  );
}
`;

export const DESIGNCODE_CTA_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT_SNIPPET,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const DESIGNCODE_CTA_META = {
  id: "designcode-cta",
  name: "Shooting stars",
  blurb:
    "Chrome-framed starfield enroll pill with hover warp and click flash — ported from the designcode.io hero CTA.",
  states: "default, hover, focus, active, disabled",
  keywords: [
    "shooting stars",
    "designcode cta",
    "designcode",
    "dive in with us",
    "enroll",
    "lifetime",
    "starfield",
    "warp",
    "space launch",
    "pricing",
    "webgl",
    "shader",
    "flash",
    "hero cta",
    "chrome button",
    "launch button",
    "animated button",
    "interactive button",
  ],
};
