import * as THREE from "three";

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform float u_hover;
uniform float u_aspect;
uniform vec3 u_color_rays;
uniform vec3 u_color_rim;

varying vec2 vUv;

float sdRoundedBox(vec2 p, vec2 b, vec4 r) {
  r.xy = (p.x > 0.0) ? r.xy : r.zw;
  r.x  = (p.y > 0.0) ? r.x  : r.y;
  vec2 q = abs(p) - b + r.x;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
}

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float getStrokeMask(vec2 p, vec2 size, float radius, float strokeWidth) {
  float d = sdRoundedBox(p, size, vec4(radius));
  return smoothstep(strokeWidth * 0.5 + 0.003, strokeWidth * 0.5, abs(d));
}

void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5);
  p.x *= u_aspect;

  float t = u_time * 1.1;
  vec2 orbitPos = vec2(cos(t) * 0.38, sin(t * 1.35) * 0.16);
  vec2 targetPos = mix(orbitPos, u_pointer, u_hover);

  vec2 btnHalfSize = vec2(0.32, 0.11);
  float radius = 0.07;
  float strokeWidth = 0.007;

  float stroke = getStrokeMask(p, btnHalfSize, radius, strokeWidth);
  float dBox = sdRoundedBox(p, btnHalfSize, vec4(radius));
  float fillInner = 1.0 - smoothstep(-0.002, 0.002, dBox);

  float distToLight = length(p - targetPos);
  float rimFalloff = 1.0 / (1.0 + distToLight * distToLight * 35.0);
  float rim = stroke * rimFalloff * (2.4 + u_hover * 1.4);

  const int STEPS = 40;
  float decay = 0.945;
  vec2 rayDelta = (targetPos - p) / float(STEPS);
  
  float jitter = hash(gl_FragCoord.xy + fract(u_time));
  vec2 currentCoord = p + rayDelta * jitter * 0.5;

  float rays = 0.0;
  float illum = 1.0;
  float totalIllum = 0.0;

  for (int i = 0; i < STEPS; i++) {
    currentCoord += rayDelta;
    float s = getStrokeMask(currentCoord, btnHalfSize, radius, strokeWidth);
    float dLight = length(currentCoord - targetPos);
    float sampleWeight = 1.0 / (1.0 + dLight * 18.0);
    rays += s * illum * sampleWeight;
    totalIllum += illum;
    illum *= decay;
  }
  rays /= max(totalIllum, 0.001);
  rays *= 6.8 * (1.0 + u_hover * 0.85);

  float halo = 0.038 / (distToLight * distToLight + 0.0055);
  halo = clamp(halo, 0.0, 2.0) * (0.65 + u_hover * 0.45);

  vec3 col = vec3(0.0);
  
  vec3 rayCol = u_color_rays * (rays * 0.85 + halo * 0.38);
  col += rayCol;

  vec3 rimCol = u_color_rim * rim;
  col += rimCol;

  if (fillInner > 0.01) {
    float glassGrad = clamp((p.y + btnHalfSize.y) / (btnHalfSize.y * 2.0), 0.0, 1.0);
    vec3 glassCol = mix(vec3(0.015, 0.025, 0.04), vec3(0.05, 0.07, 0.11), glassGrad);
    float spec = pow(max(0.0, 1.0 - distToLight * 1.7), 3.0) * 0.3;
    col += (glassCol + spec * u_color_rim) * fillInner;
  }

  col = col / (col + vec3(1.0));
  col = pow(col, vec3(1.0 / 2.2));

  float alpha = clamp(length(col) * 1.6 + fillInner * 0.85 + stroke, 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
`;

export function initNextjsFlare(container, options = {}) {
  const canvas = container.querySelector("canvas");
  if (!canvas) return null;

  const rect = container.getBoundingClientRect();
  const width = rect.width || 320;
  const height = rect.height || 160;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(width, height) },
    u_pointer: { value: new THREE.Vector2(0, 0) },
    u_hover: { value: 0 },
    u_aspect: { value: width / height },
    u_color_rays: { value: new THREE.Vector3(0.88, 0.95, 1.0) },
    u_color_rim: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let animationFrameId = null;
  let isHovered = false;
  let targetPointer = { x: 0, y: 0 };
  let currentPointer = { x: 0, y: 0 };
  let currentHover = 0;
  let startTime = performance.now();
  let destroyed = false;

  function resize() {
    if (destroyed) return;
    const r = container.getBoundingClientRect();
    const w = r.width || 320;
    const h = r.height || 160;
    renderer.setSize(w, h, false);
    uniforms.u_resolution.value.set(w, h);
    uniforms.u_aspect.value = w / h;
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  function onPointerMove(e) {
    const r = container.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1.0 - (e.clientY - r.top) / r.height;
    targetPointer.x = (nx - 0.5) * uniforms.u_aspect.value;
    targetPointer.y = ny - 0.5;
  }

  function onPointerEnter() {
    isHovered = true;
  }

  function onPointerLeave() {
    isHovered = false;
  }

  container.addEventListener("pointermove", onPointerMove);
  container.addEventListener("pointerenter", onPointerEnter);
  container.addEventListener("pointerleave", onPointerLeave);

  function render() {
    if (destroyed) return;

    const elapsed = (performance.now() - startTime) * 0.001;
    uniforms.u_time.value = elapsed;

    // Smooth hover interpolation
    const targetHover = isHovered ? 1.0 : 0.0;
    currentHover += (targetHover - currentHover) * 0.12;
    uniforms.u_hover.value = currentHover;

    // Smooth pointer tracking
    currentPointer.x += (targetPointer.x - currentPointer.x) * 0.15;
    currentPointer.y += (targetPointer.y - currentPointer.y) * 0.15;
    uniforms.u_pointer.value.set(currentPointer.x, currentPointer.y);

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return {
    destroy() {
      destroyed = true;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      material.dispose();
      geometry.dispose();
      renderer.dispose();
    },
  };
}
