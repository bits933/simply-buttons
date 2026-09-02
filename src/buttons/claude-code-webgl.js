const VERTEX_SHADER = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_progress;
uniform float u_time;
uniform float u_pixel_size;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 p = gl_FragCoord.xy;

  vec2 cell = floor(p / u_pixel_size);
  vec2 cell_center = (cell + 0.5) * u_pixel_size;
  vec2 cell_uv = cell_center / u_resolution;
  vec2 in_cell = fract(p / u_pixel_size);

  vec2 grid_line = smoothstep(vec2(0.0), vec2(0.18), in_cell) * (1.0 - smoothstep(vec2(0.82), vec2(1.0), in_cell));
  float grid_mask = grid_line.x * grid_line.y;

  vec3 col_terracotta = vec3(0.847, 0.467, 0.341);
  vec3 col_deep = vec3(0.804, 0.412, 0.290);
  vec3 col_peach = vec3(1.0, 0.62, 0.49);
  vec3 col_white = vec3(1.0, 1.0, 1.0);

  float dist = cell_uv.x - u_progress;
  float rand_val = hash21(cell + floor(u_time * 14.0) * 0.05);
  float static_rand = hash21(cell);

  float alpha = 0.0;
  vec3 final_color = vec3(0.0);

  if (dist <= 0.0) {
    // Solid fill behind the wavefront (seamless fill without grid gaps)
    alpha = 1.0;
    final_color = mix(col_deep, col_terracotta, uv.y);
    float near_wave = smoothstep(-0.08, 0.0, dist);
    final_color = mix(final_color, col_peach, near_wave * 0.35);
  } else if (dist < 0.16) {
    // Dynamic pixel simulation & dispersion ahead of the wave
    float falloff = 1.0 - (dist / 0.16);
    float spark_prob = pow(falloff, 2.0) * 0.9;

    if (rand_val < spark_prob || (static_rand < spark_prob * 0.6)) {
      alpha = mix(0.6, 1.0, falloff);
      float spark_heat = smoothstep(0.0, 1.0, falloff);
      vec3 spark_col = mix(col_terracotta, col_peach, spark_heat);
      if (rand_val > 0.75) spark_col = mix(spark_col, col_white, 0.85);
      final_color = spark_col * grid_mask;
    }
  }

  // Glowing wavefront leading beam
  float beam_dist = abs(cell_uv.x - u_progress);
  float beam_intensity = exp(-pow(beam_dist / 0.015, 2.0));
  float bloom_intensity = exp(-pow(beam_dist / 0.06, 1.5)) * 0.65;

  if (u_progress > 0.005 && u_progress < 0.998) {
    vec3 beam_light = mix(col_peach, col_white, beam_intensity) * (beam_intensity * 1.5 + bloom_intensity);
    final_color += beam_light;
    alpha = max(alpha, clamp(beam_intensity * 1.2 + bloom_intensity, 0.0, 1.0));
  }

  gl_FragColor = vec4(final_color * alpha, alpha);
}
`;

function createShader(gl, type, source) {
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

export function initClaudeWebgl(canvas) {
  if (!canvas) return null;
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const vert = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const frag = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );

  const locPos = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(locPos);
  gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

  const uResolution = gl.getUniformLocation(program, "u_resolution");
  const uProgress = gl.getUniformLocation(program, "u_progress");
  const uTime = gl.getUniformLocation(program, "u_time");
  const uPixelSize = gl.getUniformLocation(program, "u_pixel_size");

  let animationId = null;
  let startTime = null;
  let duration = 2200;
  let running = false;
  let onCompleteCallback = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    return { w, h, dpr };
  }

  function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function render(now) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;
    const rawProgress = Math.min(1, elapsed / duration);
    const progress = easeInOutCubic(rawProgress);

    const { w, h, dpr } = resize();

    gl.useProgram(program);
    gl.uniform2f(uResolution, w, h);
    gl.uniform1f(uProgress, progress);
    gl.uniform1f(uTime, elapsed / 1000);
    gl.uniform1f(uPixelSize, 3.5 * dpr);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (rawProgress < 1) {
      animationId = requestAnimationFrame(render);
    } else {
      running = false;
      if (onCompleteCallback) {
        onCompleteCallback();
      }
    }
  }

  return {
    start(customDuration = 2200, onDone) {
      duration = customDuration;
      onCompleteCallback = onDone;
      startTime = null;
      running = true;
      if (animationId) cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(render);
    },
    reset() {
      if (animationId) cancelAnimationFrame(animationId);
      running = false;
      startTime = null;
      resize();
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    },
    destroy() {
      if (animationId) cancelAnimationFrame(animationId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
