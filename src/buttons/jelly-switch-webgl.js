/* WebGL1 port of TypeGPU's jelly-switch (Software Mansion).
   Same springs, SDF rounded box, cheap bend, IOR/fresnel, beer-lambert
   scatter. The blob stays put: progress only drives material + jiggle,
   not a slider rail. */

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform vec4 u_state; /* progress, squashX, squashZ, wiggleX */
uniform float u_dark;
uniform vec3 u_jelly;
uniform vec3 u_ground; /* #121315 tray well */

const float JELLY_IOR = 1.42;
const float JELLY_SCATTER = 3.0;
const float SURF = 0.0015;
const int MAX_STEPS = 48;
const float GROUND_Y = -0.06;

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

vec3 cheapBend(vec3 p, float k) {
  float c = cos(k * p.x);
  float s = sin(k * p.x);
  /* TypeGPU mat2x2(c, -s, s, c) is column-major → [c s; -s c] */
  return vec3(c * p.x + s * p.y, -s * p.x + c * p.y, p.z);
}

vec3 rotAxis(vec3 p, vec3 axis, float angle) {
  return mix(axis * dot(p, axis), p, cos(angle)) + cross(p, axis) * sin(angle);
}

vec3 jellyOrigin() {
  /* No rail. Squash still nudges X so press / impact reads as jiggle. */
  return vec3(-u_state.y * 0.08, 0.15, 0.0);
}

float jellyDist(vec3 p) {
  vec3 origin = jellyOrigin();
  vec3 invScale = vec3(1.0 - u_state.y, 1.0, 1.0 - u_state.z);
  vec3 local = rotAxis((p - origin) * invScale, vec3(0.0, 0.0, 1.0), u_state.w);
  return sdRoundBox(cheapBend(local, 0.8), vec3(0.25, 0.20, 0.20), 0.10);
}

/* Infinite studio plane — no well/socket, so no circular disc. */
float groundDist(vec3 p) {
  return p.y - GROUND_Y;
}

vec3 jellyNormal(vec3 p) {
  float e = 0.0012;
  float d0 = jellyDist(p);
  return normalize(vec3(
    jellyDist(p + vec3(e, 0.0, 0.0)) - d0,
    jellyDist(p + vec3(0.0, e, 0.0)) - d0,
    jellyDist(p + vec3(0.0, 0.0, e)) - d0
  ));
}

float fresnelSchlick(float cosTheta, float ior1, float ior2) {
  float r0 = pow((ior1 - ior2) / (ior1 + ior2), 2.0);
  return r0 + (1.0 - r0) * pow(1.0 - cosTheta, 5.0);
}

vec3 beerLambert(vec3 sigma, float dist) {
  return exp(sigma * (-dist));
}

vec3 tanh3(vec3 x) {
  vec3 e = exp(clamp(x, -8.0, 8.0) * -2.0);
  return (1.0 - e) / (1.0 + e);
}

vec3 lightDir() {
  return -normalize(vec3(0.19, -0.24, 0.75));
}

vec3 shadeGround(vec3 hit, vec3 rd) {
  vec3 N = vec3(0.0, 1.0, 0.0);
  vec3 L = lightDir();
  float diffuse = max(dot(N, L), 0.0);
  vec3 viewDir = normalize(-rd);
  vec3 spec = vec3(1.0) * pow(max(dot(viewDir, reflect(-L, N)), 0.0), 10.0) * 0.35;

  vec3 origin = jellyOrigin();
  vec3 delta = hit - vec3(origin.x, GROUND_Y, origin.z);
  float sq = dot(delta, delta);
  float bounce = (1.0 / (sq * 15.0 + 1.0)) * 0.4;
  float emission = mix(0.12, 1.0, u_state.x);

  float contact = clamp(jellyDist(hit + vec3(0.0, 0.03, 0.0)) * 4.0, 0.72, 1.0);
  /* Keep the tray #121315; TypeGPU lighting only tints relative to that grey. */
  vec3 studio = u_ground * (0.88 + 0.14 * diffuse) * contact + spec * u_ground * 1.8;
  return studio + u_jelly * bounce * emission;
}

float marchGround(vec3 ro, vec3 rd) {
  if (abs(rd.y) < 1e-5) return 8.0;
  float t = (GROUND_Y - ro.y) / rd.y;
  return t > 0.0 ? t : 8.0;
}

vec3 envFrom(vec3 ro, vec3 rd) {
  float t = marchGround(ro, rd);
  if (t < 8.0) return shadeGround(ro + rd * t, rd);
  return u_ground;
}

vec4 marchJelly(vec3 ro, vec3 rd) {
  float tG = marchGround(ro, rd);
  float t = 0.0;
  float hitD = 1e5;
  for (int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * t;
    hitD = jellyDist(p);
    t += hitD;
    if (hitD < SURF || t > min(tG, 8.0)) break;
  }

  if (hitD > SURF || t >= tG) {
    vec3 gHit = ro + rd * min(tG, 8.0);
    return vec4(shadeGround(gHit, rd), 0.0);
  }

  vec3 hit = ro + rd * t;
  vec3 N = jellyNormal(hit);
  vec3 I = rd;
  float cosi = clamp(dot(-I, N), 0.0, 1.0);
  float F = fresnelSchlick(cosi, 1.0, JELLY_IOR);
  vec3 reflection = vec3(clamp(hit.y + 0.2, 0.0, 1.0));

  float eta = 1.0 / JELLY_IOR;
  float k = 1.0 - eta * eta * (1.0 - cosi * cosi);
  vec3 refracted = vec3(0.0);
  if (k > 0.0) {
    vec3 refrDir = normalize(I * eta + N * (eta * cosi - sqrt(k)));
    vec3 exitPos = hit + refrDir * 0.08;
    vec3 env = envFrom(exitPos, refrDir);
    vec3 sky = mix(u_ground * 1.06, u_ground * 1.18, 0.5);
    env = mix(env, sky, 0.22 * (1.0 - u_state.x) + 0.10 * max(N.y, 0.0));

    float density = 20.0;
    vec3 absorb = (vec3(1.0) - u_jelly) * density;
    float heightMix = clamp(mix(1.0, 0.6, hit.y * (1.0 / 0.6) + 0.25), 0.0, 1.0);
    float progress = heightMix * u_state.x;
    vec3 T = beerLambert(absorb * (progress * progress), 0.08);
    float forward = max(0.0, dot(lightDir(), refrDir));
    vec3 scatter = u_jelly * 1.5 * JELLY_SCATTER * forward * progress * progress * progress;
    refracted = env * T + scatter;
  }

  vec3 jelly = reflection * F + refracted * (1.0 - F);
  return vec4(jelly, 1.0);
}

void main() {
  float aspect = u_res.x / max(u_res.y, 1.0);
  /* TypeGPU camera (0.024, 2.7, 1.9) pulled in so the gel reads in a tray. */
  vec3 ro = vec3(0.024, 1.92, 1.35);
  vec3 ta = vec3(0.0, 0.04, 0.0);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = cross(uu, ww);
  /* WebGL clip Y is up and this triangle's v_uv.y is 0 at the bottom.
     TypeGPU's fullScreenTriangle uses top-left UV and negates NDC Y —
     copying that flip here renders the gel upside down. */
  vec2 p = vec2(v_uv.x * 2.0 - 1.0, v_uv.y * 2.0 - 1.0);
  p.x *= aspect;
  vec3 rd = normalize(ww + uu * p.x * 0.38 + vv * p.y * 0.38);

  vec4 color = marchJelly(ro, rd);
  vec3 rgb = color.rgb;
  if (color.a > 0.5) {
    float exposure = mix(1.5, 2.0, u_dark);
    rgb = tanh3(rgb * exposure);
  }
  gl_FragColor = vec4(rgb, 1.0);
}
`;

const SWITCH_ACCELERATION = 100;
const SQUASH_X = { mass: 1, stiffness: 1000, damping: 10 };
const SQUASH_Z = { mass: 1, stiffness: 900, damping: 12 };
const WIGGLE_X = { mass: 1, stiffness: 1000, damping: 20 };
const JELLY_COLOR = [0.08, 0.5, 1.0];
const WELL_RGB = [0x12 / 255, 0x13 / 255, 0x15 / 255]; /* #121315 */

function Spring(properties) {
  this.target = 0;
  this.value = 0;
  this.velocity = 0;
  this.properties = properties;
}

Spring.prototype.update = function update(dt) {
  const F_spring = -this.properties.stiffness * (this.value - this.target);
  const F_damp = -this.properties.damping * this.velocity;
  const a = (F_spring + F_damp) / this.properties.mass;
  this.velocity += a * dt;
  this.value += this.velocity * dt;
};

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[jelly-switch]", gl.getShaderInfoLog(shader));
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
  gl.attachShader(prog, vert);
  gl.attachShader(prog, frag);
  gl.linkProgram(prog);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("[jelly-switch]", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

function saturate(v) {
  return Math.min(1, Math.max(0, v));
}

export function initJellySwitch(canvas, opts = {}) {
  if (!canvas) return null;
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
  });
  if (!gl) return null;

  const prog = program(gl, VERT, FRAG);
  if (!prog) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const locPos = gl.getAttribLocation(prog, "a_position");
  const uRes = gl.getUniformLocation(prog, "u_res");
  const uState = gl.getUniformLocation(prog, "u_state");
  const uDark = gl.getUniformLocation(prog, "u_dark");
  const uJelly = gl.getUniformLocation(prog, "u_jelly");
  const uGround = gl.getUniformLocation(prog, "u_ground");

  const squashX = new Spring(SQUASH_X);
  const squashZ = new Spring(SQUASH_Z);
  const wiggleX = new Spring(WIGGLE_X);

  let toggled = false;
  let pressed = false;
  let progress = 0;
  let velocity = 0;
  let dark = opts.dark === false ? 0 : 1;
  let groundRgb = opts.ground || WELL_RGB;
  let raf = 0;
  let running = false;
  let visible = true;
  let lastTs = 0;
  const reduced = opts.start === false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    return { w, h };
  }

  function draw() {
    const { w, h } = resize();
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, w, h);
    gl.disable(gl.BLEND);
    gl.clearColor(WELL_RGB[0], WELL_RGB[1], WELL_RGB[2], 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, w, h);
    gl.uniform4f(uState, progress, squashX.value, squashZ.value, wiggleX.value);
    gl.uniform1f(uDark, dark);
    gl.uniform3f(uJelly, JELLY_COLOR[0], JELLY_COLOR[1], JELLY_COLOR[2]);
    gl.uniform3f(uGround, groundRgb[0], groundRgb[1], groundRgb[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function step(dt) {
    if (dt <= 0) return;
    let acc = 0;
    if (toggled && progress < 1) acc = SWITCH_ACCELERATION;
    if (!toggled && progress > 0) acc = -SWITCH_ACCELERATION;

    if (pressed) {
      squashX.velocity = -2;
      squashZ.velocity = 1;
      wiggleX.velocity = 1 * Math.sign(progress - 0.5) || 1;
    }

    velocity += acc * dt;
    if (progress > 0 && progress < 1) {
      wiggleX.velocity = velocity;
    }

    progress += velocity * dt;
    if (progress > 1) {
      progress = 1;
      velocity = 0;
      squashX.velocity = -5;
      squashZ.velocity = 5;
      wiggleX.velocity = -10;
    }
    if (progress < 0) {
      progress = 0;
      velocity = 0;
      squashX.velocity = -5;
      squashZ.velocity = 5;
      wiggleX.velocity = 10;
    }
    progress = saturate(progress);
    squashX.update(dt);
    squashZ.update(dt);
    wiggleX.update(dt);
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(lastTs ? (now - lastTs) * 0.001 : 0, 0.1);
    lastTs = now;
    if (!document.hidden && visible) {
      if (!reduced) step(dt);
      draw();
    }
    raf = requestAnimationFrame(frame);
  }

  function begin() {
    if (running) return;
    running = true;
    lastTs = 0;
    raf = requestAnimationFrame(frame);
  }

  const io =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver((entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible) begin();
        })
      : null;
  if (io) io.observe(canvas);

  if (opts.start !== false) begin();
  else draw();

  return {
    press() {
      pressed = true;
    },
    releaseAndToggle() {
      if (!pressed) return false;
      pressed = false;
      toggled = !toggled;
      if (reduced) {
        progress = toggled ? 1 : 0;
        velocity = 0;
        squashX.value = 0;
        squashZ.value = 0;
        wiggleX.value = 0;
        draw();
      } else {
        begin();
      }
      return true;
    },
    setDark(value, ground) {
      dark = value ? 1 : 0;
      if (ground && ground.length === 3) groundRgb = ground;
      if (!running) draw();
    },
    setGround(rgb) {
      if (rgb && rgb.length === 3) groundRgb = rgb;
      if (!running) draw();
    },
    getState() {
      return { toggled, progress, pressed };
    },
    destroy() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      if (io) io.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(prog);
    },
  };
}
