export function createLaunchState() {
  return { warp: 0, warpTarget: 0, flash: 0, time: 0 };
}

export function stepLaunchFrame(state, dt, { hover = false, click = false } = {}) {
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

export const LAUNCH_VERT_GLSL = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";

export const LAUNCH_FRAG_GLSL = `precision highp float;
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
