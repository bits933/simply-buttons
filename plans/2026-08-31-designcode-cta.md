# Plan: Add the designcode.io hero CTA (Enroll for $499 lifetime space-launch pill)

Copy the live https://designcode.io/ hero CTA exactly: chrome frame, starfield shader, hover warp, click flash, caption. Append as the next filled gallery tray. Color exception to PROJECT.md grayscale lock for this specimen only.

## Goal kind

code-change

## Acceptance criteria

1. The gallery has a live specimen of the designcode.io hero CTA cluster: a 14px-radius chrome frame (`15.5rem` × `3.35rem`, `padding: 5px`, min-width `15.5rem`) around a `10px`-radius `#06050a` inner well that hosts a full-bleed canvas starfield; uppercase tracked label **Enroll for $499 lifetime** (`~0.78rem` / weight `500` / `letter-spacing: 0.28em` / `#eef2ff` glow); caption **or $99/month** under the control (`#ffffff7a`, `~0.72rem`). Frame paint matches source: `linear-gradient(180deg, #3a3d52, #15151f 55%, #262838)` plus the inset hairline and drop shadows.
2. Hover and keyboard focus warp the starfield (`warpTarget = 1`: stars stretch, purple bloom) and lift the chrome `translateY(-2px)` with the indigo hover shadow; `:focus-visible` is `2px solid #6366f1` / `outline-offset: 5px`; `:active` is `translateY(1px) scale(0.985)`. Click sets a white `flash` that decays, and zeros warp and shader time (the source “launch” pulse). Disabled stays at `opacity: 0.45`, no pointer, no warp/flash.
3. When WebGL is unavailable the inner well uses the source fallback fill `linear-gradient(180deg, #4338caf2, #312e81fa)` (`data-launch-fallback`). `prefers-reduced-motion: reduce` skips the intro (wrap starts at opacity 1 / scale 1 / no blur) and the hover/press transforms, and freezes shader time. Otherwise the wrap intros from `opacity: 0; scale(0.6); blur(10px)` to rest over ~1.2s with overshoot (source `back.out(1.7)`), and the wrap eases toward ±15px of pointer (`duration 2`, power2-out).
4. The specimen is appended as the next filled gallery tray (do not reorder earlier trays) with the three copy-paste stacks (HTML+CSS, React, Node). Each stack ships the same chrome, label, caption, shader (or fallback), hover warp, and click flash and runs without this repo. Gallery preview must not navigate away; snippets may use `href="/pricing"` like the live site.

## Global Constraints

- Append after the last filled tray on this branch (currently `explore-now` on HEAD). Never insert or renumber earlier trays.
- Unique class names: keep the live source classes `space-launch-button-wrap`, `space-launch-button`, `space-launch-button-inner`, `space-launch-button-canvas`, `space-launch-button-label`. Caption class: `space-launch-button-note` (gallery cluster) matching live `.hero-primary-note` paint.
- Real `<button>` in the gallery preview (`type="button"`). Snippets may use `<a href="/pricing">` like the live site.
- Color exception: this tray only may use the source indigo/space palette.
- Do not add the GSAP package. Use WAAPI or the existing `motion` dependency for intro / pointer ease.
- Magnetic follow uses the live ±15px / 2s / power2-out recipe but **origin it on the wrap** (not document viewport) so the specimen stays inside the tray.
- Do not hotlink designcode.io assets.
- Inline the same CSS + stepper + shader in all three snippets so stacks cannot drift (plan-mandated duplication).
- Export a pure `stepLaunchFrame(state, dt, { hover, click })` plus fragment/vertex GLSL so unit tests drive the real math and shader text.
- Tests import the shipped stepper; they must not re-implement a second stepper as the thing under test.
- Three snippet tabs (html, react, node), complete, copy-pasteable, matching the preview.
- After code changes run `graphify update .` (or `graphify . --update --code-only`) when the CLI is available.

## Task 1: Extract shipped launch tokens, GLSL, and `stepLaunchFrame`; add the failing `node:test`

**Files:**
- Create: `src/buttons/designcode-cta.launch.js`
- Create: `src/buttons/designcode-cta.test.js`

**Do this with TDD.** Write the failing test first, run it (RED), implement the minimum module, run it (GREEN), then commit.

### Shipped API

```js
export function createLaunchState() {
  return { warp: 0, warpTarget: 0, flash: 0, time: 0 };
}

export function stepLaunchFrame(state, dt, { hover = false, click = false } = {}) {
  // mutate-or-return a new state object. Tests will use the returned/mutated fields.
}

export const LAUNCH_VERT_GLSL = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;

export const LAUNCH_FRAG_GLSL = /* exact live fragment shader, see brief */;
```

### `stepLaunchFrame` contract (from live `SpaceLaunchButton`)

Click is applied **before** the frame integrate, matching the live click handler then rAF:

1. If `click`: `flash = 1`, `warp = 0`, `time = 0`.
2. `warpTarget = hover ? 1 : 0`.
3. `warp += (warpTarget - warp) * Math.min(1, dt * 2.6)`.
4. `flash *= Math.exp(-4.5 * dt)`.
5. `time += dt * (0.05 + warp * 1.35)`.

Return the next state. Do not clamp except via those formulas. `dt` is seconds.

Tests that need the click snapshot (`flash === 1`, `warp === 0`, `time === 0`) must call with `dt = 0` so integrate is a no-op, **or** assert those fields after a dedicated click-only path. Prefer `dt = 0` for the click assertion so one function covers both.

### Exact live fragment shader (copy verbatim)

```
precision highp float;
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
}
```

The 3-ring star loop is `for (int i = 0; i < 3; i++)`.

### Tests (import shipped module only)

File: `src/buttons/designcode-cta.test.js` using `node:test` + `node:assert/strict`.

1. Hover step: start `{ warp: 0.2, warpTarget: 0, flash: 0, time: 1 }`, `dt = 0.016`, `{ hover: true }`. Assert `warpTarget === 1` and `warp === 0.2 + (1 - 0.2) * Math.min(1, 0.016 * 2.6)`.
2. Click: same start, `dt = 0`, `{ click: true }`. Assert `flash === 1`, `warp === 0`, `time === 0`.
3. Decay: start `{ warp: 0.4, warpTarget: 0, flash: 1, time: 0 }`, `dt = 0.016`, `{ hover: false }`. Assert `flash === Math.exp(-4.5 * 0.016)` (1 * exp) and `time === 0 + 0.016 * (0.05 + <resulting warp> * 1.35)` using the warp **after** the lerp on that same step.
4. `LAUNCH_FRAG_GLSL` contains `u_res`, `u_time`, `u_warp`, `u_flash`, `fbm`, and `for (int i = 0; i < 3; i++)`.

Do not copy a second stepper into the test file. Drive `stepLaunchFrame` and `LAUNCH_FRAG_GLSL` from `./designcode-cta.launch.js`.

Run: `node --test src/buttons/designcode-cta.test.js`

Commit: `feat(designcode-cta): add launch stepper and starfield GLSL`

## Task 2: Build the chrome + label + “or $99/month” cluster CSS from the source numbers

**Files:**
- Create: `src/buttons/designcode-cta.css`

Copy the live `SpaceLaunchButton-Fie0plG2.css` plus the hero cluster caption. Exact live chrome CSS:

```css
.space-launch-button-wrap{display:inline-flex;opacity:0;transform:scale(.6);filter:blur(10px)}
.space-launch-button{position:relative;display:block;width:15.5rem;height:3.35rem;padding:5px;border:0;border-radius:14px;cursor:pointer;outline:none;text-decoration:none;background:linear-gradient(180deg,#3a3d52,#15151f 55%,#262838);box-shadow:0 22px 44px #0f0c1859,0 3px 10px #00000059,inset 0 1px #ffffff24;transition:transform .3s cubic-bezier(.34,1.4,.5,1),box-shadow .3s ease}
.space-launch-button:hover:not([aria-disabled=true]){transform:translateY(-2px);box-shadow:0 28px 56px #4338ca47,0 4px 12px #0006,inset 0 1px #ffffff29}
.space-launch-button:active:not([aria-disabled=true]){transform:translateY(1px) scale(.985)}
.space-launch-button:focus-visible{outline:2px solid #6366f1;outline-offset:5px}
.space-launch-button[aria-disabled=true]{cursor:not-allowed;opacity:.45;pointer-events:none}
.space-launch-button[data-launch-fallback=true] .space-launch-button-inner{background:linear-gradient(180deg,#4338caf2,#312e81fa)}
.space-launch-button-inner{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:2.45rem;overflow:hidden;border-radius:10px;background:#06050a;box-shadow:inset 0 2px 8px #000000e6}
.space-launch-button-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;min-height:inherit;pointer-events:none}
.space-launch-button-label{position:relative;z-index:1;pointer-events:none;font-size:.78rem;font-weight:500;letter-spacing:.28em;text-indent:.28em;text-transform:uppercase;color:#eef2ff;text-shadow:0 0 14px rgba(129,140,248,.55),0 1px 6px rgba(0,0,0,.9)}
@media(prefers-reduced-motion:reduce){
  .space-launch-button-wrap{opacity:1!important;transform:none!important;filter:none!important}
  .space-launch-button:hover:not([aria-disabled=true]),.space-launch-button:active:not([aria-disabled=true]){transform:none}
}
```

Also add the cluster wrapper + caption from live hero:

- wrap cluster as column, `align-items: center`, `gap: .42rem`
- caption: `color:#ffffff7a; font-size:.72rem; line-height:1; letter-spacing:0`
- live override: `.hero-primary-offer .space-launch-button{width:auto;min-width:15.5rem}` — include `min-width:15.5rem` (already on width 15.5rem)
- font-family: inherit the gallery (IBM Plex Sans is fine; do not hotlink Geist)

Do not implement the WebGL runtime in this task. CSS file only.

Commit: `feat(designcode-cta): add chrome label and caption CSS`

## Task 3: Wire the live preview: canvas shader, hover warp, click flash, intro, pointer ease, WebGL fallback

**Files:**
- Create: `src/buttons/DesigncodeCtaButton.jsx`
- May import `./designcode-cta.css` and `./designcode-cta.launch.js`

**Preview export:** `DesigncodeCtaPreview` — gallery control is a **button**, does not navigate.

Port the live `SpaceLaunchButton` runtime:

- WebGL1 `getContext("webgl")`, fullscreen triangle buffer `[-1,-1, 3,-1, -1,3]`, attribute `p`.
- Uniforms `u_res`, `u_time`, `u_warp`, `u_flash` from the shipped GLSL.
- Resize with `devicePixelRatio` capped at 2.
- IntersectionObserver pause (`threshold: 0.08`, `rootMargin: "0px 0px -3% 0px"`).
- Visibility + reduced-motion freeze shader time (live uses `u_time = 2.5` when reduced).
- No-context / compile / link failure: `data-launch-fallback="true"` on the chrome control.
- Hover/focus: `warpTarget = 1`. Leave/blur: `0`. Disabled: do not set warp/flash.
- Click: `flash = 1`, `warp = 0`, `time = 0` via `stepLaunchFrame` (or the same mutations then step).
- Drive the rAF integrate through **`stepLaunchFrame`** so the preview cannot drift from tests.
- Intro: wrap starts `opacity:0; scale(0.6); blur(10px)` then 1.2s to rest with overshoot equivalent to GSAP `back.out(1.7)`. Reduced motion: skip intro, wrap already opacity 1 / scale 1 / no blur (CSS already forces this).
- Pointer ease: ±15px, duration 2s, power2-out **relative to the wrap/card**, not `window.innerWidth` (gallery tray).
- Keyboard focus must also warp (live only used mouseenter; gallery criterion 2 requires focus as well).
- Label: `Enroll for $499 lifetime`. Caption beside/under: `or $99/month`.
- Cleanup: cancel rAF, disconnect observers, delete GL buffer/program.

Do not register `src/slots.js` in this task.

Commit: `feat(designcode-cta): wire starfield preview runtime`

## Task 4: Write HTML / React / Node snippets; register the tray at the end of `src/slots.js`

**Files:**
- Create: `src/buttons/designcode-cta.snippets.js`
- Modify: `src/slots.js` (append only)
- Tests in `src/buttons/designcode-cta.test.js` may gain a snippets/registration assertion (keep stepper tests).

Snippets must inline CSS + stepper + shader + runtime. No `import './designcode-cta.css'` unless the CSS is inlined in the snippet. No imports from this repo.

- `html`: a full HTML page. Snippet control may be `<a class="space-launch-button" href="/pricing">`.
- `react`: a self-contained component string.
- `node`: Express (or equivalent) that serves the same HTML page.

Register:

```js
id: "designcode-cta"
preview: DesigncodeCtaPreview
snippets: DESIGNCODE_CTA_SNIPPETS
```

Append after `explore-now` (last filled tray on this branch). Meta: name, blurb, states (`default`, `hover`, `focus`, `active`, `disabled`), keywords.

HTML and React snippets must contain: `Enroll for $499 lifetime`, `or $99/month`, `space-launch-button`, `u_warp`, `u_flash`, `#3a3d52`, and `/pricing` or a button `onClick`.

Commit: `feat(designcode-cta): add snippets and register gallery tray`

## Task 5: Run verification: tests twice, snippets JSON, Vite + browser, graphify update

**Do not change product code unless a prior task left a hole this verification exposes.**

1. Run `node --test src/buttons/designcode-cta.test.js` twice. Save full output to `{SCRATCH}/designcode-cta-unit.log` and `{SCRATCH}/designcode-cta-unit-2.log`. `{SCRATCH}` is `C:\Users\User\AppData\Local\Temp\grok-goal-d95610526fd6\implementer`.
2. Write a small node script that imports snippets + slots and writes `{SCRATCH}/designcode-cta-snippets.json` with `{ id, htmlHas, reactHas, nodeHas }` booleans for the required strings.
3. Try Vite: `npm run build` then `npx vite preview` (or `npm run dev`). If Playwright/`msedge` can start, load `#designcode-cta`, assert zero page errors, label visible, canvas or fallback inner present, hover transform has negative translateY, click sets flash or fallback change. Screenshots: `{SCRATCH}/designcode-cta-rest.png`, `designcode-cta-hover.png`, `designcode-cta-click.png`. If the headless browser cannot start, capture the launcher failure in `{SCRATCH}/designcode-cta-browser.log` — that is the accepted bar together with steps 1–2. A successful readback of a **blank well** is an app defect.
4. `graphify update .` or `graphify . --update --code-only`.

Commit only if you had to fix a hole: `fix(designcode-cta): verification gaps`.

## Verification plan

1. gating: `node:test` file imports the shipped launch stepper. Assert one hover step (`warp += (target - warp) * min(1, dt * 2.6)`), one click (`flash = 1`, `warp = 0`, `time = 0`), one decay step (`flash *= exp(-4.5 * dt)` and `time += dt * (0.05 + warp * 1.35)`). Assert shipped GLSL contains `u_res`, `u_time`, `u_warp`, `u_flash`, `fbm`, and the 3-ring star loop. Run `node --test` on that file twice; both pass.
2. gating: slot exists with preview and snippet keys `html`, `react`, `node`; HTML and React snippets contain `Enroll for $499 lifetime`, `or $99/month`, `space-launch-button`, `u_warp`, `u_flash`, `#3a3d52`, and `/pricing` or a button `onClick`.
3. gating: Vite entry more than once; browser checks or honest launcher failure log. Blank well on successful readback is a defect.
4. evidence: `graphify update .` after code changes.

## Non-goals

- Cloning the rest of https://designcode.io/.
- Real checkout / Stripe / Firebase enrollment.
- Requiring the GSAP package by name.
- Reordering or restyling existing gallery trays.

## Task checklist

- [x] Extract shipped launch tokens, GLSL, and `stepLaunchFrame`; add the failing `node:test` from verification step 1.
- [x] Build the chrome + label + “or $99/month” cluster CSS from the source numbers (frame 15.5rem×3.35rem / r14 / p5; inner r10 / `#06050a`; hover/active/focus/disabled/reduced-motion).
- [x] Wire the live preview: canvas shader, hover warp, click flash, intro, pointer ease, WebGL fallback; gallery control does not navigate away.
- [x] Write HTML / React / Node snippets that inlined-copy that behavior (snippets may `href="/pricing"`); register the tray at the end of `src/slots.js`.
- [x] Run `node --test` twice, capture `{SCRATCH}` logs/JSON; attempt the Vite + browser launch/screenshots (or honest launcher failure); `graphify update .`.

## Deviations

- Chrome uses live hero `width: auto; min-width: 15.5rem` plus inner `padding: 0 1.25rem` and label `white-space: nowrap` so the 0.28em-tracked enroll line stays one line (fixed `width: 15.5rem` wrapped).
- Registered after XP folder on the working gallery (tray 82), not after Explore now on the isolated branch (that had numbered it 80).
