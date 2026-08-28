export const VERT = `#version 300 es
in vec4 a_position;
out vec2 fragCoord;
void main() {
  gl_Position = a_position;
  fragCoord = a_position.xy * 0.5 + 0.5;
}`;

export const FRAG = `#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_intro;          // 0â¦1 hover-in animation progress
uniform vec2  u_intro_dir;      // unit vector: direction cursor is travelling on enter
uniform float u_tone;           // 0 = light button bg, 1 = dark button bg

// Cursor trail â ring buffer of recent positions. xy = canvas-space
// position (0..1, y-up); z = normalised age (0 fresh â¦ 1 expired).
// Expired / unused slots are encoded with z >= 1.0.
#define TRAIL_LEN 14
uniform vec3 u_trail[TRAIL_LEN];

in vec2 fragCoord;
out vec4 fragColor;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Arrakis sand palette â warm oranges with a bright hazy sky at top.
vec3 sandPalette(float t) {
  vec3 shadow = vec3(0.82, 0.42, 0.18);   // shaded sand
  vec3 body   = vec3(1.00, 0.60, 0.28);   // warm dune body
  vec3 lit    = vec3(1.00, 0.80, 0.55);   // sunlit slope
  vec3 haze   = vec3(1.00, 0.93, 0.82);   // atmospheric haze
  vec3 col = mix(shadow, body, smoothstep(0.0, 0.45, t));
  col = mix(col, lit,  smoothstep(0.45, 0.8, t));
  col = mix(col, haze, smoothstep(0.82, 1.0, t));
  return col;
}

// Rolling dune profile â broad, low-frequency curves.
float duneProfile(float x, float t) {
  float h = 0.0;
  h += sin(x * 1.1  + t * 0.10) * 0.62;
  h += sin(x * 2.3  + t * 0.17) * 0.30;
  h += sin(x * 4.4  + t * 0.27) * 0.14;
  h += (vnoise(vec2(x * 1.2, t * 0.08)) - 0.5) * 0.42;
  return h;
}

// Per-layer hand-tuned variation. Each layer gets its own crest
// endpoints, amplitude, hump position and curvature so they don't
// look like parallel copies of one diagonal.
// Returns: yLeft, yRight, ampMul, curve
vec4 layerParams(float layer) {
  if (layer < 0.5)  return vec4(0.30, 0.45, 1.40, 1.40);   // front
  if (layer < 1.5)  return vec4(0.42, 0.32, 1.10, 1.20);   // mid-front
  if (layer < 2.5)  return vec4(0.55, 0.62, 1.55, 1.50);   // mid, tall
  if (layer < 3.5)  return vec4(0.50, 0.58, 0.95, 1.30);   // mid-back
  return                  vec4(0.65, 0.78, 0.80, 1.40);    // back, high crest
}

// Crest height of one dune layer at canvas-x.
// The crest line slopes up to the right with a curved (bowed) midsection,
// so layers read as rolling humps rather than straight ramps.
float duneCrest(float x, float t, float layer, float wind) {
  vec4 P = layerParams(layer);
  float yLeft  = P.x;
  float yRight = P.y;
  float ampMul = P.z;
  float curve  = P.w;

  // Curved interpolation â keeps the crest high through the right side
  // (rounded shoulder) then drops more steeply toward the left.
  float xc = pow(clamp(x, 0.0, 1.0), 1.0 / curve);
  float base = mix(yLeft, yRight, xc);

  // Wide Gaussian hump at a per-layer x-position so each layer has its
  // own distinct rounded summit. Spread across the full width so dunes
  // peak at varying spots from left to right.
  float humpX = 0.50 + 0.40 * sin(layer * 2.7);
  float humpW = 0.22 + 0.08 * fract(layer * 3.3);
  float hump  = exp(-pow((x - humpX) / humpW, 2.0));
  base += hump * 0.28 * ampMul;

  // Center dip â push crests down beneath the text in the middle of
  // the button so the label stays legible. Gaussian carved at x=0.5.
  float dip = exp(-pow((x - 0.5) / 0.22, 2.0));
  base -= dip * 0.32;

  // Per-layer ridge undulation â different freq, phase, amp.
  float amp   = 0.075 * ampMul;
  float wx    = x + wind * (1.20 + layer * 0.55);   // parallax per layer
  float phase = layer * 23.7;
  float freq  = 1.6 + 0.55 * mod(layer + 1.0, 3.0);
  return base + duneProfile(wx * freq + phase, t + layer * 4.3) * amp;
}

void main() {
  vec2 uv = fragCoord;          // (0,0) bottom-left, (1,1) top-right

  // Intro: a flow-based dissolve. Dunes don't translate â instead a
  // noise-modulated reveal wipes across the canvas while a turbulent
  // sample-offset distorts the dune profile, settling into shape.
  // Cubic ease-out: motion begins immediately on hover (no front delay)
  // and tapers off into a graceful settle.
  float u = clamp(u_intro, 0.0, 1.0);
  float introEase = 1.0 - pow(1.0 - u, 3.0);
  float introAlpha = smoothstep(0.0, 0.35, introEase);
  float introInv   = 1.0 - introEase;

  // Noise field used both for the reveal mask and the turbulence flow.
  // One vnoise sample serves both jobs to keep per-pixel cost flat.
  vec2  flowUV  = uv * vec2(2.6, 5.2) + vec2(u_time * 0.85, u_time * 0.20);
  float flowN   = vnoise(flowUV);

  // Reveal sweep follows the cursor's entry direction. The sweep axis
  // is u_intro_dir (cursor travel direction); pixels nearest the entry
  // edge reveal first and the wave rolls forward in the direction the
  // cursor is travelling.
  float axis    = dot(uv - 0.5, u_intro_dir);
  float sweep   = 0.5 + axis + (flowN - 0.5) * 0.55;
  float feather = 0.26;

  // ââ Cursor trail carve â "drawing a line in the sand" ââ
  // For each trail point compute a soft Gaussian influence and take
  // the max. Older points fade and widen slightly (sand settles back).
  // Aspect-corrected so the carve stays round on wide buttons.
  float aspect = u_resolution.x / u_resolution.y;
  float carve = 0.0;
  float freshAge = 1.0;
  for (int i = 0; i < TRAIL_LEN; i++) {
    vec3 t = u_trail[i];
    if (t.z >= 1.0) continue;
    float w = 1.0 - t.z;                                   // fade with age
    vec2 d = (uv - t.xy) * vec2(aspect, 1.0);
    // Carve radius squared â widens slightly as the point ages, like
    // sand slumping back into the groove.
    float r2 = mix(0.0085, 0.014, t.z);
    float infl = exp(-dot(d, d) / r2) * w;
    carve = max(carve, infl);
    freshAge = min(freshAge, t.z);
  }

  vec3 col = vec3(0.0);
  float alpha = 0.0;
  float edge = 3.0 / u_resolution.y;

  // Wind drives a continuous horizontal flow of the dune phase.
  float wind = u_time * 0.18;

  // ââ Layered translucent dunes, back to front ââ
  const float TOTAL = 5.0;
  const int LAYERS = 5;
  for (int li = LAYERS - 1; li >= 0; li--) {
    float layer = float(li);
    float k = layer / (TOTAL - 1.0);              // 0 front .. 1 back

    // Per-layer reveal: back layers materialize first, front layers
    // last â same depth ordering as before but expressed as a
    // dissolve instead of a translation.
    float layerOffset = mix(0.18, -0.05, k);
    float reveal = smoothstep(
      sweep + layerOffset - feather,
      sweep + layerOffset + feather,
      introEase
    );
    if (reveal <= 0.001) continue;

    // Turbulent sample distortion that settles to zero. Front layers
    // flow more (closer = faster apparent motion). Bias the offset
    // along the entry direction so the dunes appear pushed in by the
    // wind that brought the cursor.
    float turbAmp = introInv * mix(0.06, 0.18, 1.0 - k);
    float sampleX = uv.x + (flowN - 0.5) * turbAmp
                         + u_intro_dir.x * introInv * 0.05 * (1.0 - k);

    float h = duneCrest(sampleX, u_time, layer, wind);

    // Cursor carve: front layers split deeply, back layers barely
    // shift. This is what makes the trail read as a groove drawn
    // through the sand rather than a generic glow.
    h -= carve * mix(0.32, 0.06, k);

    // Soft crest edge â back layers extra-soft (atmospheric blur).
    // During the intro the edge is extra-feathered so dunes resolve
    // out of haze rather than pop in.
    float softness = edge + k * 0.018 + introInv * 0.05;
    float fill = smoothstep(h + softness, h - softness, uv.y);
    if (fill <= 0.0) continue;

    // Apply the dissolve mask to this layer.
    fill *= reveal;

    // Per-layer translucency.
    float layerAlpha = mix(0.32, 0.14, k);

    // Shading â taller part of layer brighter (catches sun).
    float depthFromCrest = clamp((h - uv.y) / 0.45, 0.0, 1.0);
    float layerBrightness = mix(0.62, 0.42, k);
    float tone = layerBrightness + (1.0 - depthFromCrest) * 0.30;

    // Windward slope highlight along the ridge axis.
    float hL = duneCrest(sampleX - 0.018, u_time, layer, wind);
    float hR = duneCrest(sampleX + 0.018, u_time, layer, wind);
    float slope = hR - hL;
    float sunward = smoothstep(-0.008, 0.020, -slope);
    tone += sunward * 0.18 * (1.0 - depthFromCrest);

    // Crest rim highlight â bright sliver along the very top edge of
    // each dune where sun catches the ridge.
    float crestProx = 1.0 - smoothstep(0.0, 0.05, h - uv.y);
    tone += crestProx * sunward * 0.22;

    tone = clamp(tone, 0.0, 1.0);

    vec3 layerCol = sandPalette(tone);
    layerCol = mix(layerCol, vec3(1.0, 0.90, 0.78), k * 0.55);

    // Sun-catching highlight injection on the upper sun-facing slopes.
    vec3 sunrise = vec3(1.000, 0.675, 0.353);   // #feac5a
    vec3 desert  = vec3(1.000, 0.859, 0.678);   // #ffdbad
    float hiMix = sunward * (1.0 - depthFromCrest) * 0.65
                + crestProx * sunward * 0.85;
    layerCol = mix(layerCol, mix(sunrise, desert, crestProx), clamp(hiMix, 0.0, 0.9));

    // Soft brown grain (existing) â overall surface texture.
    float grain = (vnoise(fragCoord * u_resolution * 0.20
                          + layer * 37.0
                          + u_time * 0.15) - 0.5) * 0.05;
    layerCol += grain;

    // Sand sparkle â very subtle fine-grain shimmer for surface texture.
    // The discrete point sparkles (added after the loop) do the heavy
    // lifting; this is just gentle background twinkle.
    vec2 grainUV = fragCoord * u_resolution * 2.40
                 + vec2(u_time * 12.0, u_time * 3.0)   // wind drift
                 + layer * 53.0;
    float gNoise = vnoise(grainUV);
    float twinkle = 0.5 + 0.5 * sin(u_time * 5.0
                                  + gNoise * 25.0
                                  + layer * 7.0);
    float sparkleMask = smoothstep(0.78, 0.96, gNoise)
                      * (0.45 + sunward * 0.55)
                      * (1.0 - depthFromCrest * 0.7)
                      * (0.30 + twinkle * 0.70);
    layerCol += mix(sunrise, desert, 0.6) * sparkleMask * 0.55;

    // Right-side density bias â dunes are densest on the right and
    // dissolve toward the left, reinforcing the directional feel.
    float rightBias = smoothstep(0.0, 0.85, uv.x);
    float w = fill * layerAlpha * rightBias;
    col += layerCol * w;
    alpha += w;
  }

  alpha = clamp(alpha, 0.0, 0.72);
  col = col / max(alpha, 0.001);

  // ââ Sparkles riding the dune crests ââ
  // Each sparkle is bound to a layer and glides along that layer's
  // crest line from right to left, glinting along the silhouette
  // edge instead of floating in empty space.
  float sparkleSum = 0.0;
  for (int i = 0; i < 32; i++) {
    float fi = float(i);
    float seedL = hash12(vec2(fi * 7.31, 13.17));
    float seedO = hash12(vec2(fi * 1.73, 91.7));
    float seedS = hash12(vec2(fi * 5.11, 23.9));
    float seedJ = hash12(vec2(fi * 9.07, 57.4));

    // Pick which dune layer this sparkle rides on.
    float sLayer = floor(seedL * TOTAL);
    float sk     = sLayer / (TOTAL - 1.0);

    // Travel right to left along x. Front-layer sparkles move faster
    // (parallax matches the dune wind speed).
    float speed = mix(0.16, 0.07, sk) + seedS * 0.05;
    float life  = fract(u_time * speed + seedO);
    float sx    = 1.05 - life * 1.20;            // 1.05 .. -0.15

    // Sit on the crest of its layer, with a tiny per-sparkle vertical
    // jitter so they read as grains catching light along the ridge.
    float crestY = duneCrest(sx, u_time, sLayer, wind);
    float jitter = (seedJ - 0.5) * 0.015
                 + sin(u_time * 3.0 + seedO * 19.0) * 0.004;
    vec2 pos = vec2(sx, crestY + jitter);

    // Twinkle: brief flash near mid-life, fade in/out at edges.
    float fade   = smoothstep(0.0, 0.12, life)
                 * (1.0 - smoothstep(0.78, 1.0, life));
    float twinkle = 0.55 + 0.45 * sin(u_time * 8.0 + seedO * 31.0);

    // Right-side bias matches the dune density falloff.
    float rightBias = smoothstep(-0.05, 0.7, sx);

    // Smaller, sharper sparkles for back layers (atmospheric distance).
    float radius = mix(0.0050, 0.0028, sk);
    float d = distance(uv, pos);
    sparkleSum += smoothstep(radius, 0.0, d)
                * fade * twinkle * rightBias
                * mix(1.2, 0.7, sk);
  }

  // ââ Scattered point sparkles across the dune faces ââ
  // Many small bright pinpricks scattered across the dune surface
  // (not just the crest). Each blinks on briefly then off so the
  // dunes feel like they're catching sun on individual grains.
  vec3 sunriseS = vec3(1.000, 0.675, 0.353);
  vec3 desertS  = vec3(1.000, 0.859, 0.678);
  vec3 pointCol = vec3(0.0);
  for (int i = 0; i < 70; i++) {
    float fi = float(i);
    float pX = hash12(vec2(fi * 3.71,  17.3));
    float pY = hash12(vec2(fi * 5.13,  41.7));
    float pO = hash12(vec2(fi * 7.91,  83.1));
    float pH = hash12(vec2(fi * 2.17,  29.5));
    float pL = hash12(vec2(fi * 9.43,  11.9));

    // Anchor each point to a dune layer's crest line, then drop it
    // a random distance below the crest so it sits on the dune face.
    float pLayer = floor(pL * TOTAL);
    float pk     = pLayer / (TOTAL - 1.0);
    float baseX  = pX;                                  // 0..1 across
    float crestY = duneCrest(baseX, u_time, pLayer, wind);
    float depth  = pY * 0.55;                           // 0..0.55 below crest
    vec2  ppos   = vec2(baseX, crestY - depth);

    // Each point blinks briefly. Use a triangular pulse so most of
    // the time the point is dark and it flashes for a short window.
    float blinkSpeed = 0.4 + pH * 0.9;
    float life       = fract(u_time * blinkSpeed + pO);
    // Sharp pulse: bright at life~0.5, dark elsewhere.
    float pulse      = pow(1.0 - abs(life - 0.5) * 2.0, 8.0);

    // Right-side density bias and depth-fade match the dunes.
    float rb = smoothstep(0.05, 0.85, baseX);
    float depthFade = 1.0 - smoothstep(0.0, 0.50, depth);
    float layerFade = mix(1.0, 0.55, pk);

    float r = 0.0024 + pH * 0.0014;
    float dd = distance(uv, ppos);
    float core = smoothstep(r, 0.0, dd);

    float intensity = core * pulse * rb * depthFade * layerFade;
    sparkleSum += intensity * 1.8;
    pointCol   += mix(sunriseS, desertS, pH) * intensity * 1.5;
  }
  col += pointCol;

  // ââ Spice grains lifted off the dunes, drifting left ââ
  // Small wind-borne grains that spawn ON a dune crest at the right
  // and tumble leftward across the canvas, slowly losing altitude
  // toward the next crest. Sized like sand bits, not comet streaks.
  float spiceSum = 0.0;
  vec3  spiceCol = vec3(0.0);
  for (int i = 0; i < 20; i++) {
    float fi = float(i);
    float sL = hash12(vec2(fi * 11.13, 3.71));
    float sY = hash12(vec2(fi * 4.27,  19.9));
    float sO = hash12(vec2(fi * 6.91,  71.3));
    float sS = hash12(vec2(fi * 2.37,  47.1));
    float sH = hash12(vec2(fi * 8.53,  29.7));   // hue bias

    // Slower drift than before (was 0.34..0.89 â now 0.10..0.22).
    float speed = 0.10 + sS * 0.12;
    float life  = fract(u_time * speed + sO);

    // Spawn just past the right edge, exit past the left edge.
    float sx = 1.08 - life * 1.20;

    // Pick a layer to launch from; spice starts ON that crest at
    // the right side of the canvas, then arcs upward into the wind.
    float sLayer = floor(sL * TOTAL);
    float startCrest = duneCrest(0.95, u_time, sLayer, wind);

    // Lift off the dune: rises at first, peaks mid-life, settles back
    // down a touch â feels like wind-tossed sand rather than a flyby.
    float lift = sin(life * 3.14159) * mix(0.06, 0.14, sY);
    float sag  = life * mix(0.02, 0.06, sH);
    float sy   = startCrest + lift - sag
               + sin(life * 9.0 + sO * 13.0) * 0.006;   // tiny tumble

    vec2 pos = vec2(sx, sy);

    // Tiny grain â round dot, no comet tail.
    float radius = 0.0030 + sH * 0.0015;
    float d = distance(uv, pos);
    float core = smoothstep(radius, 0.0, d);

    float fade = smoothstep(0.0, 0.10, life)
               * (1.0 - smoothstep(0.82, 1.0, life));

    // Brighter near spawn (just left the crest, catching sun), then
    // fades as it tumbles into shadow on the left.
    float shine = mix(1.1, 0.55, life);

    float intensity = core * fade * shine;

    // Highlight palette â sunrise + desert per the brand tokens.
    vec3 sunrise = vec3(1.000, 0.675, 0.353);  // #feac5a
    vec3 desert  = vec3(1.000, 0.859, 0.678);  // #ffdbad
    vec3 c = mix(sunrise, desert, sH);

    spiceSum += intensity;
    spiceCol += c * intensity;
  }

  // ââ Intro spice burst ââ
  // Extra wind-borne grains that swirl in during the intro and fade
  // out as the dunes finish resolving. These read as the spice-laden
  // wind delivering Arrakis to the canvas.
  float burstAmt = pow(1.0 - introEase, 1.6);
  if (burstAmt > 0.001) {
    for (int i = 0; i < 60; i++) {
      float fi = float(i);
      float bX = hash12(vec2(fi * 12.31, 5.71));
      float bY = hash12(vec2(fi * 3.97,  43.3));
      float bO = hash12(vec2(fi * 7.13,  61.9));
      float bH = hash12(vec2(fi * 5.27,  29.1));
      float bS = hash12(vec2(fi * 9.41,  77.5));

      // Each grain blows from right to left over the full intro.
      float speed = 0.55 + bS * 0.65;
      float life  = fract(u_time * speed + bO);
      float gx    = 1.10 - life * 1.30;
      float gy    = bY * 1.05
                  + sin(life * 6.2831 + bO * 9.0) * 0.05
                  + (vnoise(vec2(gx * 4.0, bY * 7.0) + u_time * 0.6) - 0.5) * 0.08;

      vec2 gpos = vec2(gx, gy);
      float r   = 0.0026 + bH * 0.0020;
      float d   = distance(uv, gpos);
      float core = smoothstep(r, 0.0, d);

      float fade = smoothstep(0.0, 0.08, life)
                 * (1.0 - smoothstep(0.85, 1.0, life));

      float intensity = core * fade * burstAmt * 1.4;

      vec3 sunrise = vec3(1.000, 0.675, 0.353);
      vec3 desert  = vec3(1.000, 0.859, 0.678);
      vec3 c = mix(sunrise, desert, bH);

      spiceSum += intensity;
      spiceCol += c * intensity;
    }
  }

  col += vec3(1.0, 0.95, 0.82) * sparkleSum * 1.2;
  col += spiceCol * 1.0;
  alpha = max(alpha, sparkleSum * 1.1);
  alpha = max(alpha, spiceSum * 0.95);

  // ââ Sun-tone wash for legibility ââ
  // On a light button background the warm orange composites toward
  // a pale fluorescent yellow, so we shift the wash to a deeper
  // sunset-orange and pull the hue toward red. Dark buttons keep the
  // brighter sun tone they already had.
  vec3 sunDark  = vec3(1.000, 0.545, 0.243);   // #ff8b3e
  vec3 sunLight = vec3(0.980, 0.380, 0.150);   // deeper sun, away from yellow
  vec3 sun = mix(sunLight, sunDark, u_tone);
  float sunMix = mix(0.42, 0.28, u_tone);      // stronger wash on light bg
  col = mix(col, sun, sunMix);

  // Trail highlight â a warm rim along the freshest part of the
  // groove, like sun catching the cut edge before sand fills it back
  // in. Masked by the existing dune alpha so the trail is only visible
  // where there's sand to carve through, not in empty canvas space.
  float duneMask = smoothstep(0.0, 0.25, alpha);
  float trailGlow = pow(carve, 1.5) * (1.0 - freshAge) * duneMask;
  col += vec3(1.000, 0.78, 0.42) * trailGlow * 0.45;
  alpha = max(alpha, trailGlow * 0.45 * introAlpha);

  col = pow(col, vec3(1.05)) * 0.92;

  // Apply intro fade to the final composite.
  alpha *= introAlpha;

  fragColor = vec4(col * alpha, alpha);
}`;

const TRAIL_LEN = 14;

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  const log = gl.getShaderInfoLog(shader);
  console.error("arrakis shader", log);
  gl.deleteShader(shader);
  return null;
}

function link(gl, vsSrc, fsSrc) {
  const vs = compile(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.detachShader(program, vs);
    gl.detachShader(program, fs);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return program;
  }
  console.error("arrakis program", gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

export function createArrakisFluid(canvas) {
  if (!canvas) return null;
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
  });
  if (!gl) return null;
  const prog = link(gl, VERT, FRAG);
  if (!prog) return null;

  const loc = {
    pos: gl.getAttribLocation(prog, "a_position"),
    resolution: gl.getUniformLocation(prog, "u_resolution"),
    time: gl.getUniformLocation(prog, "u_time"),
    intro: gl.getUniformLocation(prog, "u_intro"),
    introDir: gl.getUniformLocation(prog, "u_intro_dir"),
    trail: gl.getUniformLocation(prog, "u_trail"),
    tone: gl.getUniformLocation(prog, "u_tone"),
  };
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const trailArr = new Float32Array(TRAIL_LEN * 3);
  let trail = [];
  let running = false;
  let raf = 0;
  let t0 = 0;
  let dirX = -1;
  let dirY = 0;
  let tone = 0;

  function frame() {
    if (!running) return;
    const now = performance.now();
    const intro = Math.min((now - t0) / 1300, 1);
    for (let i = 0; i < TRAIL_LEN; i += 1) {
      const point = trail[i];
      const o = 3 * i;
      if (point) {
        let age = (now - point.t) / 700;
        age = age < 0 ? 0 : age >= 1 ? 1 : age;
        trailArr[o] = point.x;
        trailArr[o + 1] = point.y;
        trailArr[o + 2] = age;
      } else {
        trailArr[o] = -1;
        trailArr[o + 1] = -1;
        trailArr[o + 2] = 1;
      }
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);
    gl.uniform2f(loc.resolution, canvas.width, canvas.height);
    gl.uniform1f(loc.time, 0.001 * now);
    gl.uniform1f(loc.intro, intro);
    gl.uniform2f(loc.introDir, dirX, dirY);
    gl.uniform3fv(loc.trail, trailArr);
    gl.uniform1f(loc.tone, tone);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc.pos);
    gl.vertexAttribPointer(loc.pos, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    raf = window.requestAnimationFrame(frame);
  }

  return {
    start(opts) {
      dirX = typeof opts?.dirX === "number" ? opts.dirX : -1;
      dirY = typeof opts?.dirY === "number" ? opts.dirY : 0;
      tone = typeof opts?.tone === "number" ? opts.tone : 0;
      trail = [];
      t0 = performance.now();
      running = true;
      if (raf) window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(frame);
    },
    trail(x, y) {
      const now = performance.now();
      const head = trail[0];
      if (!head || Math.hypot(head.x - x, head.y - y) >= 0.01) {
        trail.unshift({ x, y, t: now });
        if (trail.length > TRAIL_LEN) trail.length = TRAIL_LEN;
      } else {
        head.t = now;
      }
    },
    stop() {
      running = false;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    },
  };
}
