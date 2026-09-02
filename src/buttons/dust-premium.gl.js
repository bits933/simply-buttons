/** Go Premium dust dissolve — timing, GLSL, and a scoped WebGL mount. */

export const DUST = {
  SCATTER_DUR: 3.2,
  HOLD: 0.3,
  REFORM_DUR: 1.6,
  SETTLE_DUR: 0.35,
  WAVE_SPEED: 1500,
  NOISE_AMP: 46,
  BW: 220,
  BH: 64,
  PAD: 36,
  RADIUS: 15,
  FONT: 17,
  LABEL: "Go Premium",
};

const PREC = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

export function dustNoiseGlsl(noiseAmp = DUST.NOISE_AMP) {
  return `
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float front(vec2 p, vec2 c){
  return length(p - c) + (vnoise(p * 0.12) - 0.5) * ${Number(noiseAmp).toFixed(1)};
}
`;
}

export function buildDustShaders({
  scatterDur = DUST.SCATTER_DUR,
  waveSpeed = DUST.WAVE_SPEED,
  noiseAmp = DUST.NOISE_AMP,
  reformDur = DUST.REFORM_DUR,
} = {}) {
  const noise = dustNoiseGlsl(noiseAmp);
  const vs = `
precision highp float;
attribute vec2 aHome;
attribute vec3 aRand;
attribute vec4 aColor;
uniform vec2  uRes;
uniform vec2  uBtnHalf;
uniform float uPhase;
uniform float uPhaseT;
uniform vec2  uWaveC;
uniform float uSettle;
uniform float uDpr;
varying vec4  vColor;
const float SCATTER_DUR = ${Number(scatterDur).toFixed(1)};
const float WAVE_SPEED  = ${Number(waveSpeed).toFixed(1)};
${noise}
float easeInOut(float x){ return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x + 2.0, 3.0) / 2.0; }

vec2 scatterPos(float t){
  vec2  dv   = aHome - (uWaveC - uBtnHalf);
  float dist = length(dv) + 1e-4;
  vec2  dir  = dv / dist;
  float prox  = exp(-dist * dist / 22000.0);
  float power = mix(140.0, 760.0, prox) * (0.55 + 0.9 * aRand.x);
  vec2 vel = dir * power + (vec2(aRand.y, aRand.z) - 0.5) * 360.0 * (0.35 + prox);
  float tau = 0.85;
  vec2 p = aHome + vel * tau * (1.0 - exp(-t / tau));
  float s = aRand.x * 6.28318;
  float wob = smoothstep(0.0, 0.6, t);
  p.x += sin(t * (1.1 + aRand.y) + s)       * 16.0 * wob;
  p.y += cos(t * (0.9 + aRand.z) + s * 1.7) * 13.0 * wob;
  p.y -= t * 18.0 * (aRand.y - 0.35);
  return p;
}

void main(){
  float alpha = 1.0;
  vec2  pos   = aHome;
  float size  = 3.0 + aRand.z * 1.6;

  if (uPhase < 1.5) {
    float e  = front(aHome + uBtnHalf, uWaveC);
    float tl = uPhaseT - e / WAVE_SPEED;
    if (tl <= 0.0) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      gl_PointSize = 0.0;
      vColor = vec4(0.0);
      return;
    }
    pos = scatterPos(tl);
    alpha = smoothstep(0.0, 0.05, tl)
          * (1.0 - smoothstep(SCATTER_DUR * 0.55, SCATTER_DUR * 0.98, tl));
    vec2 hc = aHome - (uWaveC - uBtnHalf);
    float prox = exp(-dot(hc, hc) / 22000.0);
    size *= 1.0 + prox * 0.9 * exp(-tl * 2.5);
    size *= mix(1.0, 0.45, clamp(tl / SCATTER_DUR, 0.0, 1.0));
  } else if (uPhase < 2.5) {
    float p = clamp(uPhaseT / ${Number(reformDur).toFixed(1)}, 0.0, 1.0);
    float e = easeInOut(p);
    pos = mix(scatterPos(SCATTER_DUR), aHome, e);
    pos += vec2(sin(aRand.x * 50.0 + p * 14.0),
                cos(aRand.y * 50.0 + p * 14.0)) * 10.0 * (1.0 - e);
    alpha = smoothstep(0.0, 0.35, p);
  } else {
    pos = aHome;
    alpha = 1.0 - uSettle;
  }

  gl_Position  = vec4(pos.x / (uRes.x * 0.5), -pos.y / (uRes.y * 0.5), 0.0, 1.0);
  gl_PointSize = max(size * uDpr, 1.0);
  vColor = vec4(aColor.rgb, aColor.a * alpha);
}`;

  const fs = `${PREC}
varying vec4 vColor;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.12, d);
  if (a < 0.02) discard;
  gl_FragColor = vec4(vColor.rgb, vColor.a * a);
}`;

  const qvs = `
precision highp float;
attribute vec2 aPos;
attribute vec2 aUV;
uniform vec2 uRes;
uniform vec2 uSize;
varying vec2 vUV;
varying vec2 vPx;
void main(){
  vec2 pos = aPos * uSize;
  gl_Position = vec4(pos.x / (uRes.x * 0.5), -pos.y / (uRes.y * 0.5), 0.0, 1.0);
  vUV = aUV;
  vPx = aUV * uSize;
}`;

  const qfs = `${PREC}
varying vec2 vUV;
varying vec2 vPx;
uniform sampler2D uTex;
uniform float uAlpha;
uniform float uWaveR;
uniform vec2  uWaveC;
${noise}
void main(){
  vec4 c = texture2D(uTex, vUV);
  float m = smoothstep(uWaveR - 10.0, uWaveR + 10.0, front(vPx, uWaveC));
  float a = c.a * uAlpha * m;
  if (a < 0.01) discard;
  gl_FragColor = vec4(c.rgb, a);
}`;

  return { vs, fs, qvs, qfs, noise };
}

export function stepDustClock(phase, t, maxE, timing = DUST) {
  if (phase === 1 && t > maxE / timing.WAVE_SPEED + timing.SCATTER_DUR + timing.HOLD) {
    return { phase: 2, t: 0 };
  }
  if (phase === 2 && t > timing.REFORM_DUR) {
    return { phase: 3, t: 0 };
  }
  if (phase === 3 && t > timing.SETTLE_DUR) {
    return { phase: 0, t: 0 };
  }
  return { phase, t };
}

export function dustSettleAmount(phase, t, settleDur = DUST.SETTLE_DUR) {
  if (phase !== 3) return 0;
  const p = Math.min(t / settleDur, 1);
  return p * p * (3 - 2 * p);
}

export function dustWaveRadius(phase, t, waveSpeed = DUST.WAVE_SPEED) {
  return phase === 1 ? t * waveSpeed : -1000;
}

export function dustQuadAlpha(phase, settle) {
  if (phase === 2) return 0;
  if (phase === 3) return settle;
  return 1;
}

export function dustClickWave(
  lx,
  ly,
  width,
  height,
  pad = DUST.PAD,
  noiseAmp = DUST.NOISE_AMP,
) {
  return {
    waveC: [lx + pad, ly + pad],
    maxE:
      Math.max(
        Math.hypot(lx, ly),
        Math.hypot(width - lx, ly),
        Math.hypot(lx, height - ly),
        Math.hypot(width - lx, height - ly),
      ) + noiseAmp,
  };
}

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Shader create failed");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("Shader: " + log);
  }
  return shader;
}

function makeProgram(gl, vsSrc, fsSrc) {
  const program = gl.createProgram();
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("Link: " + log);
  }
  return program;
}

function paintButton(ctx, { bw, bh, pad, radius, label, ss, fontSize }) {
  const rr = (x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };
  const g = ctx.createLinearGradient(pad, 0, pad + bw, 0);
  g.addColorStop(0, "#f2464d");
  g.addColorStop(1, "#f0821e");
  ctx.save();
  ctx.shadowColor = "rgba(238, 92, 60, 0.35)";
  ctx.shadowBlur = 14 * ss;
  ctx.shadowOffsetY = 7 * ss;
  rr(pad, pad, bw, bh, radius);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#fff";
  ctx.font = `700 ${fontSize ?? DUST.FONT}px system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, pad + bw / 2, pad + bh / 2 + 1);
}

/**
 * Bind a WebGL dust dissolve to a local canvas + hit-target button.
 * Canvas should cover the specimen root (not the viewport). Button stays
 * centered in that root so clip-space origin matches the pill.
 */
export function initDustPremium(canvas, button, options = {}) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fallback = (reason) => {
    button.dataset.dustFallback = "true";
    if (reason) console.error(reason);
    return {
      destroy() {},
    };
  };

  if (reduced) return fallback();

  let gl;
  try {
    gl = canvas.getContext("webgl", { antialias: true, alpha: true });
  } catch (err) {
    return fallback(err);
  }
  if (!gl) return fallback(new Error("WebGL not available"));

  const { NOISE_AMP, BW, BH, PAD, RADIUS } = DUST;
  const label = String(options.label ?? button.textContent ?? DUST.LABEL).trim() || DUST.LABEL;
  const QW = BW + PAD * 2;
  const QH = BH + PAD * 2;
  const shaders = buildDustShaders();

  let pProg;
  let qProg;
  try {
    pProg = makeProgram(gl, shaders.vs, shaders.fs);
    qProg = makeProgram(gl, shaders.qvs, shaders.qfs);
  } catch (err) {
    return fallback(err);
  }

  const pu = {};
  const qul = {};
  ["uRes", "uBtnHalf", "uPhase", "uPhaseT", "uWaveC", "uSettle", "uDpr"].forEach((n) => {
    pu[n] = gl.getUniformLocation(pProg, n);
  });
  ["uRes", "uSize", "uAlpha", "uWaveR", "uWaveC", "uTex"].forEach((n) => {
    qul[n] = gl.getUniformLocation(qProg, n);
  });
  const qaPos = gl.getAttribLocation(qProg, "aPos");
  const qaUV = gl.getAttribLocation(qProg, "aUV");

  const SS = 2;
  const oc = document.createElement("canvas");
  oc.width = QW * SS;
  oc.height = QH * SS;
  const ctx = oc.getContext("2d");
  ctx.scale(SS, SS);
  paintButton(ctx, {
    bw: BW,
    bh: BH,
    pad: PAD,
    radius: RADIUS,
    label,
    ss: SS,
    fontSize: DUST.FONT,
  });

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, oc);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -0.5, -0.5, 0, 0, 0.5, -0.5, 1, 0, 0.5, 0.5, 1, 1, -0.5, -0.5, 0, 0, 0.5, 0.5, 1, 1, -0.5, 0.5, 0, 1,
    ]),
    gl.STATIC_DRAW,
  );

  const img = ctx.getImageData(0, 0, oc.width, oc.height).data;
  const homes = [];
  const rands = [];
  const colors = [];
  for (let y = 0; y < oc.height; y += 2) {
    for (let x = 0; x < oc.width; x += 2) {
      const i = (y * oc.width + x) * 4;
      const a = img[i + 3];
      if (a < 128) continue;
      homes.push(
        (x + (Math.random() - 0.5) * 2) / SS - QW / 2,
        (y + (Math.random() - 0.5) * 2) / SS - QH / 2,
      );
      rands.push(Math.random(), Math.random(), Math.random());
      colors.push(img[i] / 255, img[i + 1] / 255, img[i + 2] / 255, a / 255);
    }
  }
  const COUNT = homes.length / 2;

  const makeBuf = (data) => {
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return b;
  };
  const bufHome = makeBuf(homes);
  const bufRand = makeBuf(rands);
  const bufColor = makeBuf(colors);

  const bindAttr = (name, buf, size) => {
    const loc = gl.getAttribLocation(pProg, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  };

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let vw = 0;
  let vh = 0;
  let dpr = 1;
  let phase = 0;
  let phaseStart = 0;
  let maxE = 0;
  const waveC = [QW / 2, QH / 2];
  let raf = 0;
  let disposed = false;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    vw = Math.max(1, rect.width);
    vh = Math.max(1, rect.height);
    const w = Math.max(1, Math.round(vw * dpr));
    const h = Math.max(1, Math.round(vh * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const draw = (nowMs) => {
    if (disposed) return;
    const now = nowMs / 1000;
    let t = now - phaseStart;
    const stepped = stepDustClock(phase, t, maxE);
    if (stepped.phase !== phase) {
      phase = stepped.phase;
      phaseStart = now;
      t = 0;
    }

    if (phase === 0) {
      button.removeAttribute("aria-busy");
    } else {
      button.setAttribute("aria-busy", "true");
    }

    const settle = dustSettleAmount(phase, t);
    const waveR = dustWaveRadius(phase, t);
    const quadAlpha = dustQuadAlpha(phase, settle);

    resize();
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (quadAlpha > 0) {
      gl.useProgram(qProg);
      gl.uniform2f(qul.uRes, vw, vh);
      gl.uniform2f(qul.uSize, QW, QH);
      gl.uniform1f(qul.uAlpha, quadAlpha);
      gl.uniform1f(qul.uWaveR, waveR);
      gl.uniform2f(qul.uWaveC, waveC[0], waveC[1]);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(qul.uTex, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(qaPos);
      gl.vertexAttribPointer(qaPos, 2, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(qaUV);
      gl.vertexAttribPointer(qaUV, 2, gl.FLOAT, false, 16, 8);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    if (phase !== 0 && COUNT > 0) {
      gl.useProgram(pProg);
      gl.uniform2f(pu.uRes, vw, vh);
      gl.uniform2f(pu.uBtnHalf, QW / 2, QH / 2);
      gl.uniform1f(pu.uPhase, phase);
      gl.uniform1f(pu.uPhaseT, t);
      gl.uniform2f(pu.uWaveC, waveC[0], waveC[1]);
      gl.uniform1f(pu.uSettle, settle);
      gl.uniform1f(pu.uDpr, dpr);
      bindAttr("aHome", bufHome, 2);
      bindAttr("aRand", bufRand, 3);
      bindAttr("aColor", bufColor, 4);
      gl.drawArrays(gl.POINTS, 0, COUNT);
    }
  };

  const kick = () => {
    if (raf || disposed) return;
    const loop = (now) => {
      raf = 0;
      draw(now);
      if (!disposed && phase !== 0) {
        raf = requestAnimationFrame(loop);
      }
    };
    raf = requestAnimationFrame(loop);
  };

  const onClick = (event) => {
    if (disposed) return;
    if (button.disabled || button.getAttribute("aria-disabled") === "true") return;
    if (phase !== 0) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    const r = button.getBoundingClientRect();
    const lx = event.detail === 0 ? r.width / 2 : event.clientX - r.left;
    const ly = event.detail === 0 ? r.height / 2 : event.clientY - r.top;
    const wave = dustClickWave(lx, ly, r.width, r.height, PAD, NOISE_AMP);
    waveC[0] = wave.waveC[0];
    waveC[1] = wave.waveC[1];
    maxE = wave.maxE;
    phase = 1;
    phaseStart = performance.now() / 1000;
    button.setAttribute("aria-busy", "true");
    kick();
  };

  const onResize = () => {
    draw(performance.now());
  };

  button.addEventListener("click", onClick);
  window.addEventListener("resize", onResize);
  const ro =
    typeof ResizeObserver === "function"
      ? new ResizeObserver(() => onResize())
      : null;
  ro?.observe(canvas);

  resize();
  draw(performance.now());

  return {
    destroy() {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      button.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      button.removeAttribute("aria-busy");
    },
  };
}
