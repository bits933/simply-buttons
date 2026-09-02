import { DUST, buildDustShaders } from "./dust-premium.gl.js";

const SHADERS = buildDustShaders();

const BUTTON_CSS = `.dust-premium-gl {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
}
.dust-premium-wrap { position: relative; z-index: 1; width: min(220px, 100%); }
.dust-premium {
  box-sizing: border-box;
  width: 100%;
  height: 64px;
  max-width: none;
  padding: 0;
  border: none;
  border-radius: 15px;
  background: linear-gradient(90deg, #f2464d, #f0821e);
  color: #fff;
  font: 700 17px system-ui, -apple-system, "Segoe UI", sans-serif;
  box-shadow: 0 7px 15px rgba(238, 92, 60, 0.38);
  cursor: pointer;
  opacity: 0;
  -webkit-tap-highlight-color: transparent;
}
.dust-premium[data-dust-fallback="true"] { opacity: 1; }
.dust-premium:focus-visible { outline: 2px solid #f0821e; outline-offset: 6px; }
.dust-premium:disabled, .dust-premium[aria-disabled="true"] { cursor: not-allowed; }
.dust-premium[data-dust-fallback="true"]:disabled,
.dust-premium[data-dust-fallback="true"][aria-disabled="true"] { opacity: 0.45; }
.dust-premium[aria-busy="true"] { cursor: progress; }
@media (prefers-reduced-motion: reduce) {
  .dust-premium { opacity: 1; }
}`;

const PAGE_CSS = `html, body { margin: 0; height: 100%; overflow: hidden; background: #f5f7fa; }
.dust-premium-root { position: fixed; inset: 0; display: grid; place-items: center; }
.dust-premium-hint {
  position: fixed; left: 0; right: 0; bottom: 22px; z-index: 3;
  text-align: center; color: #9aa0ae; font: 13px system-ui, sans-serif;
  letter-spacing: 0.4px; pointer-events: none;
}
${BUTTON_CSS}`;

const REACT_CSS = `.dust-premium-root {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 280px;
  height: 100%;
  overflow: hidden;
}
${BUTTON_CSS}`;

const BOOT = `function bootDustPremium(canvas, button, label) {
  var DUST = ${JSON.stringify(DUST)};
  var VS = ${JSON.stringify(SHADERS.vs)};
  var FS = ${JSON.stringify(SHADERS.fs)};
  var QVS = ${JSON.stringify(SHADERS.qvs)};
  var QFS = ${JSON.stringify(SHADERS.qfs)};
  label = label || DUST.LABEL;

  function stepDustClock(phase, t, maxE) {
    if (phase === 1 && t > maxE / DUST.WAVE_SPEED + DUST.SCATTER_DUR + DUST.HOLD) return { phase: 2, t: 0 };
    if (phase === 2 && t > DUST.REFORM_DUR) return { phase: 3, t: 0 };
    if (phase === 3 && t > DUST.SETTLE_DUR) return { phase: 0, t: 0 };
    return { phase: phase, t: t };
  }
  function dustSettleAmount(phase, t) {
    if (phase !== 3) return 0;
    var p = Math.min(t / DUST.SETTLE_DUR, 1);
    return p * p * (3 - 2 * p);
  }
  function dustWaveRadius(phase, t) {
    return phase === 1 ? t * DUST.WAVE_SPEED : -1000;
  }
  function dustQuadAlpha(phase, settle) {
    if (phase === 2) return 0;
    if (phase === 3) return settle;
    return 1;
  }
  function dustClickWave(lx, ly, width, height) {
    return {
      waveC: [lx + DUST.PAD, ly + DUST.PAD],
      maxE: Math.max(
        Math.hypot(lx, ly),
        Math.hypot(width - lx, ly),
        Math.hypot(lx, height - ly),
        Math.hypot(width - lx, height - ly)
      ) + DUST.NOISE_AMP
    };
  }
  function fallback() {
    button.setAttribute("data-dust-fallback", "true");
    return { destroy: function () {} };
  }
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return fallback();
  }
  var gl = canvas.getContext("webgl", { antialias: true, alpha: true });
  if (!gl) return fallback();

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error("Shader: " + gl.getShaderInfoLog(s));
    return s;
  }
  function makeProgram(vsSrc, fsSrc) {
    var p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error("Link: " + gl.getProgramInfoLog(p));
    return p;
  }

  var pProg, qProg;
  try {
    pProg = makeProgram(VS, FS);
    qProg = makeProgram(QVS, QFS);
  } catch (err) {
    console.error(err);
    return fallback();
  }

  var BW = DUST.BW, BH = DUST.BH, PAD = DUST.PAD, RADIUS = DUST.RADIUS;
  var QW = BW + PAD * 2, QH = BH + PAD * 2;
  var pu = {}, qul = {};
  ["uRes","uBtnHalf","uPhase","uPhaseT","uWaveC","uSettle","uDpr"].forEach(function (n) { pu[n] = gl.getUniformLocation(pProg, n); });
  ["uRes","uSize","uAlpha","uWaveR","uWaveC","uTex"].forEach(function (n) { qul[n] = gl.getUniformLocation(qProg, n); });
  var qaPos = gl.getAttribLocation(qProg, "aPos");
  var qaUV = gl.getAttribLocation(qProg, "aUV");

  var SS = 2;
  var oc = document.createElement("canvas");
  oc.width = QW * SS; oc.height = QH * SS;
  var ctx = oc.getContext("2d");
  ctx.scale(SS, SS);
  (function paint() {
    function rr(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
    var g = ctx.createLinearGradient(PAD, 0, PAD + BW, 0);
    g.addColorStop(0, "#f2464d"); g.addColorStop(1, "#f0821e");
    ctx.save();
    ctx.shadowColor = "rgba(238, 92, 60, 0.35)";
    ctx.shadowBlur = 14 * SS;
    ctx.shadowOffsetY = 7 * SS;
    rr(PAD, PAD, BW, BH, RADIUS);
    ctx.fillStyle = g; ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#fff";
    ctx.font = '700 ' + DUST.FONT + 'px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label, PAD + BW / 2, PAD + BH / 2 + 1);
  })();

  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, oc);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  var quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -0.5,-0.5, 0,0,  0.5,-0.5, 1,0,  0.5,0.5, 1,1,
    -0.5,-0.5, 0,0,  0.5,0.5, 1,1,  -0.5,0.5, 0,1
  ]), gl.STATIC_DRAW);

  var img = ctx.getImageData(0, 0, oc.width, oc.height).data;
  var homes = [], rands = [], colors = [];
  for (var y = 0; y < oc.height; y += 2) {
    for (var x = 0; x < oc.width; x += 2) {
      var i = (y * oc.width + x) * 4;
      var a = img[i + 3];
      if (a < 128) continue;
      homes.push((x + (Math.random() - 0.5) * 2) / SS - QW / 2, (y + (Math.random() - 0.5) * 2) / SS - QH / 2);
      rands.push(Math.random(), Math.random(), Math.random());
      colors.push(img[i] / 255, img[i + 1] / 255, img[i + 2] / 255, a / 255);
    }
  }
  var COUNT = homes.length / 2;
  function makeBuf(data) {
    var b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return b;
  }
  var bufHome = makeBuf(homes), bufRand = makeBuf(rands), bufColor = makeBuf(colors);
  function bindAttr(name, buf, size) {
    var loc = gl.getAttribLocation(pProg, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  var vw = 0, vh = 0, dpr = 1, phase = 0, phaseStart = 0, maxE = 0, raf = 0, disposed = false;
  var waveC = [QW / 2, QH / 2];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    vw = Math.max(1, rect.width); vh = Math.max(1, rect.height);
    var w = Math.max(1, Math.round(vw * dpr)), h = Math.max(1, Math.round(vh * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h);
    }
  }

  function draw(nowMs) {
    if (disposed) return;
    var now = nowMs / 1000;
    var t = now - phaseStart;
    var stepped = stepDustClock(phase, t, maxE);
    if (stepped.phase !== phase) { phase = stepped.phase; phaseStart = now; t = 0; }
    if (phase === 0) button.removeAttribute("aria-busy");
    else button.setAttribute("aria-busy", "true");
    var settle = dustSettleAmount(phase, t);
    var waveR = dustWaveRadius(phase, t);
    var quadAlpha = dustQuadAlpha(phase, settle);
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
  }

  function kick() {
    if (raf || disposed) return;
    function loop(now) {
      raf = 0;
      draw(now);
      if (!disposed && phase !== 0) raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
  }

  function onClick(event) {
    if (disposed) return;
    if (button.disabled || button.getAttribute("aria-disabled") === "true") return;
    if (phase !== 0) { event.preventDefault(); event.stopImmediatePropagation(); return; }
    var r = button.getBoundingClientRect();
    var lx = event.detail === 0 ? r.width / 2 : event.clientX - r.left;
    var ly = event.detail === 0 ? r.height / 2 : event.clientY - r.top;
    var wave = dustClickWave(lx, ly, r.width, r.height);
    waveC[0] = wave.waveC[0]; waveC[1] = wave.waveC[1]; maxE = wave.maxE;
    phase = 1; phaseStart = performance.now() / 1000;
    button.setAttribute("aria-busy", "true");
    kick();
  }

  function onResize() { draw(performance.now()); }

  button.addEventListener("click", onClick);
  window.addEventListener("resize", onResize);
  var ro = typeof ResizeObserver === "function" ? new ResizeObserver(onResize) : null;
  if (ro) ro.observe(canvas);
  resize();
  draw(performance.now());
  return {
    destroy: function () {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      button.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      button.removeAttribute("aria-busy");
    }
  };
}`;

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Go Premium — Dust Button</title>
  <style>${PAGE_CSS}</style>
</head>
<body>
  <div class="dust-premium-root">
    <canvas class="dust-premium-gl" aria-hidden="true"></canvas>
    <div class="dust-premium-wrap">
      <button type="button" class="dust-premium" aria-label="Go Premium">Go Premium</button>
    </div>
  </div>
  <div class="dust-premium-hint">click the button — it dissolves into dust, then reforms</div>
  <script>
${BOOT}
(function () {
  var canvas = document.querySelector(".dust-premium-gl");
  var button = document.querySelector(".dust-premium");
  if (canvas && button) bootDustPremium(canvas, button, "Go Premium");
})();
  </script>
</body>
</html>
`;

const REACT = `"use client";

import { useEffect, useRef } from "react";

const CSS = ${JSON.stringify(REACT_CSS)};

${BOOT}

export default function DustPremiumButton({
  label = "Go Premium",
  disabled = false,
  onClick,
  ...props
}) {
  const canvasRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (document.getElementById("dust-premium-styles")) return;
    const tag = document.createElement("style");
    tag.id = "dust-premium-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (!canvas || !button) return undefined;
    if (disabled) {
      button.setAttribute("data-dust-fallback", "true");
      return undefined;
    }
    button.removeAttribute("data-dust-fallback");
    const handle = bootDustPremium(canvas, button, label);
    return () => handle && handle.destroy();
  }, [label, disabled]);

  return (
    <div className="dust-premium-root">
      <canvas ref={canvasRef} className="dust-premium-gl" aria-hidden="true" />
      <div className="dust-premium-wrap">
        <button
          ref={buttonRef}
          type="button"
          className="dust-premium"
          disabled={disabled}
          aria-label={label}
          onClick={onClick}
          {...props}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
`;

export const DUST_PREMIUM_SNIPPETS = {
  html: PAGE,
  react: REACT,
  node: `const { createServer } = require("node:http");
const page = ${JSON.stringify(PAGE)};
createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(page);
}).listen(3000, () => console.log("http://localhost:3000"));`,
};

export const DUST_PREMIUM_META = {
  id: "dust-premium",
  name: "Premium dust",
  blurb: "An orange-red Go Premium pill that dissolves into particles from the click, scatters, then gathers back into the button.",
  states: "default, click dust scatter + reform, busy, focus-visible, disabled, reduced motion, WebGL fallback",
  keywords: [
    "premium dust",
    "go premium",
    "dust",
    "dissolve",
    "particles",
    "webgl",
    "scatter",
    "reform",
    "premium cta",
    "particle button",
    "orange gradient",
    "click animation",
    "interactive button",
    "shader",
    "animated button",
    "particle dissolve",
    "cta button",
    "hover effect",
  ],
};
