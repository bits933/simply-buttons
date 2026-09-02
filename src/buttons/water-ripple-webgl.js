/* Vanilla port of jquery.ripples 0.6.3 (sirxemic) for the
   Qwen_html_20260902_buz9mzywq.html specimen. Heightfield uses square
   texels so click splashes expand as circles. The gallery never loads jQuery. */

const VERT = [
  "attribute vec2 vertex;",
  "varying vec2 coord;",
  "void main() {",
  "  coord = vertex * 0.5 + 0.5;",
  "  gl_Position = vec4(vertex, 0.0, 1.0);",
  "}",
].join("\n");

const DROP_FRAG = [
  "precision highp float;",
  "const float PI = 3.141592653589793;",
  "uniform sampler2D texture;",
  "uniform vec2 center;",
  "uniform vec2 size;",
  "uniform float radius;",
  "uniform float ringWidth;",
  "uniform float strength;",
  "varying vec2 coord;",
  "void main() {",
  "  vec4 info = texture2D(texture, coord);",
  "  vec2 pixel = coord * size;",
  "  float dist = length(pixel - center);",
  "  float drop = ringWidth > 0.5",
  "    ? max(0.0, 1.0 - abs(dist - radius) / ringWidth)",
  "    : max(0.0, 1.0 - dist / radius);",
  "  drop = 0.5 - cos(drop * PI) * 0.5;",
  "  info.r += drop * strength;",
  "  gl_FragColor = info;",
  "}",
].join("\n");

const UPDATE_FRAG = [
  "precision highp float;",
  "uniform sampler2D texture;",
  "uniform vec2 delta;",
  "varying vec2 coord;",
  "void main() {",
  "  vec4 info = texture2D(texture, coord);",
  "  vec2 dx = vec2(delta.x, 0.0);",
  "  vec2 dy = vec2(0.0, delta.y);",
  "  float average = (",
  "    texture2D(texture, coord - dx).r +",
  "    texture2D(texture, coord - dy).r +",
  "    texture2D(texture, coord + dx).r +",
  "    texture2D(texture, coord + dy).r",
  "  ) * 0.25;",
  "  info.g += (average - info.r) * 2.0;",
  "  info.g *= 0.995;",
  "  info.r += info.g;",
  "  gl_FragColor = info;",
  "}",
].join("\n");

const RENDER_FRAG = [
  "precision highp float;",
  "uniform sampler2D samplerBackground;",
  "uniform sampler2D samplerRipples;",
  "uniform vec2 delta;",
  "uniform vec2 size;",
  "uniform float perturbance;",
  "varying vec2 coord;",
  "void main() {",
  "  vec2 px = 1.0 / size;",
  "  float height = texture2D(samplerRipples, coord).r;",
  "  float heightX = texture2D(samplerRipples, coord + vec2(px.x, 0.0)).r;",
  "  float heightY = texture2D(samplerRipples, coord + vec2(0.0, px.y)).r;",
  "  vec2 grad = vec2(heightX - height, heightY - height);",
  "  float gLen = length(grad);",
  "  vec2 dir = grad / (gLen + 1.0e-5);",
  "  float mag = perturbance * min(size.x, size.y) * smoothstep(0.0, 0.012, gLen);",
  "  vec2 offset = dir * mag / size;",
  "  float specular = pow(max(0.0, dot(dir, normalize(vec2(-0.6, 1.0)))), 4.0) * smoothstep(0.0, 0.02, gLen) * 0.35;",
  "  gl_FragColor = texture2D(samplerBackground, coord + offset) + specular;",
  "}",
].join("\n");

export function makeWaterTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 440;
  canvas.height = 130;
  const ctx = canvas.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, 130);
  g.addColorStop(0, "#2e7387");
  g.addColorStop(0.5, "#1e5b6d");
  g.addColorStop(1, "#143642");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 440, 130);
  for (let i = 0; i < 10; i += 1) {
    ctx.beginPath();
    const y0 = 6 + i * 13;
    for (let px = 0; px <= 440; px += 4) {
      const yy = y0 + Math.sin(px * 0.045 + i * 1.3) * 2.2;
      if (px === 0) ctx.moveTo(px, yy);
      else ctx.lineTo(px, yy);
    }
    ctx.strokeStyle = i % 2 ? "rgba(8,32,42,0.30)" : "rgba(120,200,220,0.10)";
    ctx.lineWidth = 5;
    ctx.stroke();
  }
  return canvas.toDataURL("image/png");
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function program(gl, vertSrc, fragSrc) {
  const vert = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const frag = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vert || !frag) return null;
  const prog = gl.createProgram();
  gl.bindAttribLocation(prog, 0, "vertex");
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    gl.deleteProgram(prog);
    return null;
  }
  const locations = {};
  const src = vertSrc + fragSrc;
  const re = /uniform \w+ (\w+)/g;
  let match;
  while ((match = re.exec(src))) {
    locations[match[1]] = gl.getUniformLocation(prog, match[1]);
  }
  return { id: prog, locations };
}

function box(el) {
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const borderLeft = parseFloat(cs.borderLeftWidth) || 0;
  const borderRight = parseFloat(cs.borderRightWidth) || 0;
  const borderTop = parseFloat(cs.borderTopWidth) || 0;
  const borderBottom = parseFloat(cs.borderBottomWidth) || 0;
  return {
    width: Math.max(1, rect.width - borderLeft - borderRight),
    height: Math.max(1, rect.height - borderTop - borderBottom),
    borderLeft,
    borderTop,
    rect,
    backgroundSize: cs.backgroundSize,
    backgroundPositionX: cs.backgroundPositionX || "50%",
    backgroundPositionY: cs.backgroundPositionY || "50%",
  };
}

function transparentPixels() {
  const data = new Uint8ClampedArray(32 * 32 * 4);
  try {
    return new ImageData(data, 32, 32);
  } catch {
    const c = document.createElement("canvas");
    return c.getContext("2d").createImageData(32, 32);
  }
}

export function initWaterRipple(el, opts = {}) {
  if (!el || typeof document === "undefined") return null;
  if (opts.start === false) {
    return {
      drop() {},
      destroy() {},
    };
  }

  const simH = opts.resolution || 160;
  const dropRadius = opts.dropRadius == null ? 25 : opts.dropRadius;
  const perturbance = opts.perturbance == null ? 0.08 : opts.perturbance;
  const interactive = opts.interactive !== false;

  const canvas = document.createElement("canvas");
  canvas.className = "wr-canvas";
  canvas.setAttribute("aria-hidden", "true");
  const size = box(el);
  canvas.width = Math.max(1, Math.round(size.width));
  canvas.height = Math.max(1, Math.round(size.height));
  canvas.style.position = "absolute";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  canvas.style.zIndex = "0";
  canvas.style.pointerEvents = "none";
  el.appendChild(canvas);

  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
  }) || canvas.getContext("experimental-webgl");
  if (!gl) {
    canvas.remove();
    return null;
  }

  const floatExt = gl.getExtension("OES_texture_float");
  const floatLinear = gl.getExtension("OES_texture_float_linear");
  const halfExt = gl.getExtension("OES_texture_half_float");
  const halfLinear = gl.getExtension("OES_texture_half_float_linear");
  if (!floatExt) {
    canvas.remove();
    return null;
  }

  const typeConfigs = [{ type: gl.FLOAT, linear: Boolean(floatLinear), arrayType: Float32Array }];
  if (halfExt) {
    typeConfigs.push({
      type: halfExt.HALF_FLOAT_OES,
      linear: Boolean(halfLinear),
      arrayType: null,
    });
  }

  const probeTex = gl.createTexture();
  const probeFbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, probeFbo);
  gl.bindTexture(gl.TEXTURE_2D, probeTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let texType = null;
  let linearSupport = false;
  let arrayType = null;
  for (const cfg of typeConfigs) {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 32, 32, 0, gl.RGBA, cfg.type, null);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, probeTex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
      texType = cfg.type;
      linearSupport = cfg.linear;
      arrayType = cfg.arrayType;
      break;
    }
  }
  gl.deleteTexture(probeTex);
  gl.deleteFramebuffer(probeFbo);
  if (texType == null) {
    canvas.remove();
    return null;
  }

  const dropProgram = program(gl, VERT, DROP_FRAG);
  const updateProgram = program(gl, VERT, UPDATE_FRAG);
  const renderProgram = program(gl, VERT, RENDER_FRAG);
  if (!dropProgram || !updateProgram || !renderProgram) {
    canvas.remove();
    return null;
  }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);

  const filter = linearSupport ? gl.LINEAR : gl.NEAREST;
  const textures = [];
  const framebuffers = [];
  let simW = 0;

  function allocSim(nextW, nextH) {
    while (textures.length) {
      gl.deleteTexture(textures.pop());
      gl.deleteFramebuffer(framebuffers.pop());
    }
    const textureData = arrayType ? new arrayType(nextW * nextH * 4) : null;
    for (let i = 0; i < 2; i += 1) {
      const texture = gl.createTexture();
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, nextW, nextH, 0, gl.RGBA, texType, textureData);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      textures.push(texture);
      framebuffers.push(framebuffer);
    }
    simW = nextW;
  }

  allocSim(
    Math.max(160, Math.min(1024, Math.round((simH * canvas.width) / canvas.height) || 160)),
    simH,
  );

  const backgroundTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, transparentPixels());

  gl.clearColor(0, 0, 0, 0);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  let bufferWriteIndex = 0;
  let bufferReadIndex = 1;
  let imageReady = false;
  let destroyed = false;
  let raf = 0;
  const originalBackground = el.style.backgroundImage;
  const textureDelta = new Float32Array([1 / simW, 1 / simH]);
  const sizePx = new Float32Array([canvas.width, canvas.height]);

  function swap() {
    bufferWriteIndex = 1 - bufferWriteIndex;
    bufferReadIndex = 1 - bufferReadIndex;
  }

  function drawQuad() {
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  function bindTex(texture, unit) {
    gl.activeTexture(gl.TEXTURE0 + (unit || 0));
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }

  function syncUniforms() {
    textureDelta[0] = 1 / simW;
    textureDelta[1] = 1 / simH;
    sizePx[0] = canvas.width;
    sizePx[1] = canvas.height;
  }

  function loadImage(url) {
    if (!url) return;
    const image = new Image();
    image.onload = () => {
      if (destroyed) return;
      gl.bindTexture(gl.TEXTURE_2D, backgroundTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      imageReady = true;
      el.style.backgroundImage = "none";
    };
    image.src = url;
  }

  function drop(x, y, radiusPx, strength, ringWidth = 0) {
    if (destroyed) return;
    const b = box(el);
    syncUniforms();
    const sx = canvas.width / b.width;
    const sy = canvas.height / b.height;
    const center = new Float32Array([x * sx, canvas.height - y * sy]);
    gl.viewport(0, 0, simW, simH);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[bufferWriteIndex]);
    bindTex(textures[bufferReadIndex], 0);
    gl.useProgram(dropProgram.id);
    gl.uniform1i(dropProgram.locations.texture, 0);
    gl.uniform2fv(dropProgram.locations.center, center);
    gl.uniform2fv(dropProgram.locations.size, sizePx);
    gl.uniform1f(dropProgram.locations.radius, radiusPx * sy);
    gl.uniform1f(dropProgram.locations.ringWidth, ringWidth * sy);
    gl.uniform1f(dropProgram.locations.strength, strength);
    drawQuad();
    swap();
  }

  function splash(x, y) {
    drop(x, y, 14, 0.9, 5);
  }

  function pointerXY(event) {
    const b = box(el);
    return {
      x: event.clientX - b.rect.left - b.borderLeft,
      y: event.clientY - b.rect.top - b.borderTop,
    };
  }

  function updateSize() {
    const b = box(el);
    const w = Math.max(1, Math.round(b.width));
    const h = Math.max(1, Math.round(b.height));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    const nextW = Math.max(160, Math.min(1024, Math.round((simH * w) / h) || 160));
    if (nextW !== simW) allocSim(nextW, simH);
    syncUniforms();
  }

  function update() {
    gl.viewport(0, 0, simW, simH);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffers[bufferWriteIndex]);
    bindTex(textures[bufferReadIndex], 0);
    gl.useProgram(updateProgram.id);
    gl.uniform1i(updateProgram.locations.texture, 0);
    gl.uniform2fv(updateProgram.locations.delta, textureDelta);
    drawQuad();
    swap();
  }

  function render() {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(renderProgram.id);
    bindTex(backgroundTexture, 0);
    bindTex(textures[bufferReadIndex], 1);
    gl.uniform1f(renderProgram.locations.perturbance, perturbance);
    gl.uniform2fv(renderProgram.locations.delta, textureDelta);
    gl.uniform2fv(renderProgram.locations.size, sizePx);
    gl.uniform1i(renderProgram.locations.samplerBackground, 0);
    gl.uniform1i(renderProgram.locations.samplerRipples, 1);
    drawQuad();
    gl.disable(gl.BLEND);
  }

  function step() {
    if (destroyed) return;
    updateSize();
    if (imageReady) update();
    render();
    raf = requestAnimationFrame(step);
  }

  function onMove(event) {
    const p = pointerXY(event);
    drop(p.x, p.y, Math.max(6, dropRadius * 0.32), 0.04);
  }
  function onClick(event) {
    const p = pointerXY(event);
    splash(p.x, p.y);
  }
  function onTouch(event) {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      const p = pointerXY(touches[i]);
      splash(p.x, p.y);
    }
  }

  if (interactive) {
    el.addEventListener("mousemove", onMove);
    el.addEventListener("click", onClick);
    el.addEventListener("touchstart", onTouch, { passive: true });
  }
  window.addEventListener("resize", updateSize);

  loadImage(opts.imageUrl);
  raf = requestAnimationFrame(step);

  return {
    drop,
    splash,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      if (interactive) {
        el.removeEventListener("mousemove", onMove);
        el.removeEventListener("click", onClick);
        el.removeEventListener("touchstart", onTouch);
      }
      window.removeEventListener("resize", updateSize);
      canvas.remove();
      el.style.backgroundImage = originalBackground;
      gl.deleteBuffer(quad);
      gl.deleteTexture(backgroundTexture);
      textures.forEach((t) => gl.deleteTexture(t));
      framebuffers.forEach((f) => gl.deleteFramebuffer(f));
      gl.deleteProgram(dropProgram.id);
      gl.deleteProgram(updateProgram.id);
      gl.deleteProgram(renderProgram.id);
    },
  };
}
