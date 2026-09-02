/* Vanilla port of the Aetheris Labs plasma button's WebGL engines
   (registered ThreeUI canonical source, SHA-256
   eea617fe0e37a79be7aee44f00a53ec3ae41e006e771a8aad53acce3648147e0).
   Two programs share the house structure of water-ripple-webgl.js:
   - an ambient fbm "cosmic void" field on a stage canvas behind the button,
   - the button's own drive shader with heat/flash uniforms driven by pointer
     and keyboard interaction, and churn as the time term. */

const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

const HASH_NOISE_FBM = [
  "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}",
  "float noise(vec2 p){",
  "  vec2 i=floor(p), f=fract(p);",
  "  vec2 u=f*f*(3.0-2.0*f);",
  "  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),",
  "             mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);",
  "}",
  "float fbm(vec2 p){",
  "  float v=0.0; float a=0.5;",
  "  for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.02+vec2(17.3,9.1); a*=0.5; }",
  "  return v;",
  "}",
].join("\n");

const BG_FS = [
  "precision highp float;",
  "uniform vec2 u_res;",
  "uniform float u_time;",
  HASH_NOISE_FBM,
  "void main(){",
  "  vec2 uv = gl_FragCoord.xy / u_res;",
  "  vec2 p = uv * vec2(u_res.x/u_res.y, 1.0) * 1.5;",
  "  float t = u_time * 0.12;",
  "  vec2 q = vec2(fbm(p + vec2(0.0, t*0.28)), fbm(p + vec2(4.1, t*0.23)));",
  "  vec2 r = vec2(fbm(p + 1.5*q + vec2(2.1, 7.2) + t*0.1),",
  "                fbm(p + 1.4*q + vec2(5.3, 3.1) + t*0.07));",
  "  float v = fbm(p + 1.9*r);",
  "  float m = v*1.3;",
  "  vec3 c1 = vec3(0.002, 0.004, 0.015);",
  "  vec3 c2 = vec3(0.006, 0.018, 0.05);",
  "  vec3 c3 = vec3(0.02, 0.07, 0.18);",
  "  vec3 col = mix(c1, c2, smoothstep(0.1, 0.6, m));",
  "  col = mix(col, c3, smoothstep(0.6, 1.0, m));",
  "  float vein = exp(-abs(q.x - q.y) * 5.0);",
  "  col += c3 * vein * 0.12;",
  "  gl_FragColor = vec4(col, 1.0);",
  "}",
].join("\n");

const DRIVE_FS = [
  "precision highp float;",
  "uniform vec2 u_res;",
  "uniform float u_time;",
  "uniform float u_heat;",
  "uniform float u_flash;",
  HASH_NOISE_FBM,
  "void main(){",
  "  vec2 uv = gl_FragCoord.xy / u_res;",
  "  vec2 p = uv * vec2(u_res.x/u_res.y, 1.0) * 2.1;",
  "  float t = u_time;",
  "  float heat = u_heat + u_flash * 1.3;",
  "  vec2 q = vec2(fbm(p + vec2(0.0, t*0.32)), fbm(p + vec2(5.2, t*0.27)));",
  "  vec2 r = vec2(fbm(p + 1.7*q + vec2(1.7, 9.2) + t*0.12),",
  "                fbm(p + 1.6*q + vec2(8.3, 2.8) + t*0.09));",
  "  float v = fbm(p + 2.1*r);",
  "  float m = v*1.4 + heat*0.22;",
  "  vec3 c1 = vec3(0.004, 0.008, 0.035);",
  "  vec3 c2 = vec3(0.04, 0.08, 0.35);",
  "  vec3 c3 = vec3(0.0, 0.6, 1.0);",
  "  vec3 c4 = vec3(0.7, 0.9, 1.0);",
  "  vec3 col = mix(c1, c2, smoothstep(0.2, 0.52, m));",
  "  col = mix(col, c3, smoothstep(0.52, 0.8, m));",
  "  col = mix(col, c4, smoothstep(0.82, 1.02, m));",
  "  float vein = exp(-abs(q.x - q.y) * 9.0);",
  "  col += c3 * vein * (0.12 + heat * 0.25);",
  "  vec2 e = uv * (1.0 - uv);",
  "  float vig = pow(e.x * e.y * 16.0, 0.28);",
  "  col *= mix(0.5, 1.0, vig);",
  "  col *= 0.78 + heat * 0.5;",
  "  col += vec3(0.82, 0.94, 1.0) * u_flash * 0.4 * (0.3 + v);",
  "  gl_FragColor = vec4(col, 1.0);",
  "}",
].join("\n");

const HOVER_SHADOW = "0 30px 60px rgba(0, 150, 220, 0.35), 0 4px 12px rgba(2, 6, 20, 0.4)";
const DEFAULT_SHADOW = "0 24px 48px rgba(4, 98, 126, 0.2), 0 3px 10px rgba(2, 6, 20, 0.35)";

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

function makeProgram(gl, fs) {
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VS));
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(program);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const locP = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(locP);
  gl.vertexAttribPointer(locP, 2, gl.FLOAT, false, 0, 0);

  return {
    uRes: gl.getUniformLocation(program, "u_res"),
    uTime: gl.getUniformLocation(program, "u_time"),
    uHeat: gl.getUniformLocation(program, "u_heat"),
    uFlash: gl.getUniformLocation(program, "u_flash"),
  };
}

function fitCanvas(canvas, gl, maxDpr) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
  const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
}

export function initAetherisDrive(btn, opts = {}) {
  if (!btn || typeof document === "undefined") return null;
  const reduced = Boolean(opts.reduced);

  const driveCanvas = btn.querySelector(".aetheris-canvas");
  if (!driveCanvas) return null;
  const gl = driveCanvas.getContext("webgl");
  if (!gl) {
    btn.classList.add("nogl");
    return { destroy() {} };
  }

  /* ambient cosmic-void field on the stage canvas */
  const stage = btn.closest(".aetheris-root");
  let bgApi = null;
  if (stage) {
    const bgCanvas = stage.querySelector(".aetheris-bg");
    const bgGl = bgCanvas && bgCanvas.getContext("webgl");
    if (bgCanvas && bgGl) {
      bgCanvas.style.opacity = "0.45";
      const bgUniforms = makeProgram(bgGl, BG_FS);
      let bgRaf = 0;
      const bgFrame = (now) => {
        fitCanvas(bgCanvas, bgGl, 1);
        bgGl.uniform2f(bgUniforms.uRes, bgCanvas.width, bgCanvas.height);
        bgGl.uniform1f(bgUniforms.uTime, reduced ? 0 : now / 1000);
        bgGl.drawArrays(bgGl.TRIANGLES, 0, 3);
        bgRaf = requestAnimationFrame(bgFrame);
      };
      bgRaf = requestAnimationFrame(bgFrame);
      bgApi = {
        destroy() {
          cancelAnimationFrame(bgRaf);
          bgCanvas.style.opacity = "";
        },
      };
    }
  }

  /* the plasma drive itself */
  const uniforms = makeProgram(gl, DRIVE_FS);

  let heat = 0;
  let heatTarget = 0;
  let erupt = 0;
  let churn = 0;
  let last = performance.now();
  let raf = 0;

  const onEnter = () => {
    heatTarget = 1;
    if (!reduced) btn.style.boxShadow = HOVER_SHADOW;
  };
  const onLeave = () => {
    heatTarget = 0;
    if (!reduced) btn.style.boxShadow = DEFAULT_SHADOW;
  };
  const onDown = () => {
    erupt = 1;
  };
  const onKey = (event) => {
    if (event.key === "Enter" || event.key === " ") erupt = 1;
  };

  btn.addEventListener("mouseenter", onEnter);
  btn.addEventListener("mouseleave", onLeave);
  btn.addEventListener("focus", onEnter);
  btn.addEventListener("blur", onLeave);
  btn.addEventListener("mousedown", onDown);
  btn.addEventListener("keydown", onKey);

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    heat += (heatTarget - heat) * Math.min(1, dt * 6);
    erupt *= Math.exp(-3.2 * dt);
    churn += dt * (0.35 + heat * 1.1 + erupt * 2.2);
    fitCanvas(driveCanvas, gl, 2);
    gl.uniform2f(uniforms.uRes, driveCanvas.width, driveCanvas.height);
    gl.uniform1f(uniforms.uTime, reduced ? 6.0 : churn);
    gl.uniform1f(uniforms.uHeat, heat);
    gl.uniform1f(uniforms.uFlash, erupt);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      if (bgApi) bgApi.destroy();
      btn.removeEventListener("mouseenter", onEnter);
      btn.removeEventListener("mouseleave", onLeave);
      btn.removeEventListener("focus", onEnter);
      btn.removeEventListener("blur", onLeave);
      btn.removeEventListener("mousedown", onDown);
      btn.removeEventListener("keydown", onKey);
      btn.style.boxShadow = "";
    },
  };
}
