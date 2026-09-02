# Generates src/buttons/twitter-50/* and patches src/slots.js from plans/twitter-50-catalog.json
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "plans" / "twitter-50-catalog.json").read_text(encoding="utf-8"))
ROWS = CATALOG["rows"]
OUT = ROOT / "src" / "buttons" / "twitter-50"


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def pascal(id_: str) -> str:
    return "".join(p.title() for p in id_.replace("x50-", "").split("-"))


def keywords(row: dict) -> list[str]:
    bits = [
        row["name"],
        row["label"],
        row["kind"],
        row["author"],
        row["bucket"],
        "twitter button",
        "x.com showcase",
        "hover effect",
        "css button",
        "microinteraction",
        row["marker"].strip("-"),
        row["style_note"].split("—")[0].strip()[:40],
    ]
    seen, out = set(), []
    for b in bits:
        k = b.lower().strip()
        if k and k not in seen:
            seen.add(k)
            out.append(k)
    return out[:16]


def base_css(row: dict) -> str:
    i, m = row["id"], row["marker"]
    return f"""
.{i}-root {{ display: inline-flex; align-items: center; justify-content: center; width: 100%; min-height: 72px; }}
.{i} {{
  {m}: 1;
  appearance: none;
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  margin: 0;
  font-family: system-ui, sans-serif;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}}
.{i}:focus-visible {{ outline: 2px solid {row["accent"]}; outline-offset: 3px; }}
.{i}:disabled {{ cursor: not-allowed; opacity: 0.42; }}
.{i} *, .{i} *::before, .{i} *::after {{ box-sizing: border-box; }}
@media (prefers-reduced-motion: reduce) {{
  .{i}, .{i} *, .{i} *::before, .{i} *::after {{ animation: none !important; transition: none !important; }}
}}
""".strip()


def kind_css(row: dict) -> str:
    i, fill, ink, acc = row["id"], row["fill"], row["ink"], row["accent"]
    k = row["kind"]
    extra = {
        "voltage": f"""
.{i} {{ padding: 12px 22px; border: 1px solid {acc}; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-size: 12px; box-shadow: 0 0 0 1px {acc} inset, 0 0 18px color-mix(in srgb, {acc} 45%, transparent); }}
.{i}::before, .{i}::after {{ content: ""; position: absolute; width: 2px; height: 10px; background: {acc}; pointer-events: none; }}
.{i}::before {{ left: 10px; top: 4px; transform: rotate(-28deg); box-shadow: 12px 18px 0 {acc}, 28px 6px 0 {acc}; }}
.{i}::after {{ right: 12px; bottom: 5px; transform: rotate(35deg); box-shadow: -10px -14px 0 {acc}; }}
.{i}:hover:not(:disabled) {{ animation: {i}-jitter .18s steps(2) 3; }}
@keyframes {i}-jitter {{ 50% {{ transform: translate(1px, -1px); }} }}
""",
        "loved-blend": f"""
.{i}-root {{ background: linear-gradient(120deg, #f472b6 0%, #22d3ee 38%, #a3e635 68%, #fbbf24 100%); padding: 22px 28px; border-radius: 16px; }}
.{i} {{ padding: 12px 28px; border: 0; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 800; mix-blend-mode: difference; }}
.{i}:hover:not(:disabled) {{ transform: scale(1.03); }}
""",
        "height": f"""
.{i} {{ padding: 11px 28px; border: 0; border-radius: 18px; background: {fill}; color: {ink}; font-weight: 600; font-size: 14px; box-shadow: 0 8px 20px rgba(0,0,0,.08); overflow: hidden; }}
.{i}::after {{ content: ""; position: absolute; z-index: 0; top: 50%; left: 50%; width: 240%; height: 240%; border-radius: 50%; background: conic-gradient(from var(--ang, 200deg), {acc}, #fda4af, #93c5fd, {acc}); opacity: 0; transform: translate(-50%, -50%); pointer-events: none; transition: opacity .25s; }}
.{i}:hover:not(:disabled)::after {{ opacity: .45; animation: {i}-spin 2.8s linear infinite; }}
.{i} .lab {{ position: relative; z-index: 1; }}
@keyframes {i}-spin {{ to {{ transform: translate(-50%, -50%) rotate(1turn); }} }}
""",
        "cq-shimmer": f"""
.{i} {{ container-type: inline-size; width: max-content; min-width: 8.5em; padding: 12px 26px; border: 0; border-radius: 10px; background: {fill}; color: {ink}; font-weight: 650; font-size: 14px; overflow: hidden; }}
.{i} .lab {{ position: relative; z-index: 1; }}
.{i}::after {{ content: ""; position: absolute; z-index: 0; inset-block: -40%; width: 42%; background: linear-gradient(90deg, transparent, {acc}, transparent); transform: translateX(-120%) rotate(12deg); pointer-events: none; }}
.{i}:hover:not(:disabled)::after {{ animation: {i}-slide 1.1s linear infinite; }}
@keyframes {i}-slide {{ to {{ translate: calc(100cqw + 40%) 0; }} }}
""",
        "invert-spot": f"""
.{i} {{ padding: 12px 26px; border: 0; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 700; overflow: hidden; }}
.{i} .spot {{ position: absolute; z-index: 1; width: 42px; height: 42px; border-radius: 50%; background: {acc}; left: var(--x, 50%); top: var(--y, 50%); transform: translate(-50%,-50%) scale(calc(var(--active, 0) * 3)); pointer-events: none; transition: transform .25s ease; }}
.{i}:is(:hover, :focus-visible):not(:disabled) {{ --active: 1; }}
.{i} .lab {{ position: relative; z-index: 2; color: #ffffff; mix-blend-mode: difference; }}
""",
        "grid-spin": f"""
.{i} {{ display: grid; padding: 12px 22px; border: 0; border-radius: 8px; background: {fill}; color: {ink}; font-weight: 600; min-width: 128px; }}
.{i} .lab, .{i} .spin {{ grid-area: 1/1; }}
.{i} .spin {{ width: 16px; height: 16px; margin: auto; border: 2px solid {acc}; border-right-color: transparent; border-radius: 50%; visibility: hidden; }}
.{i}[aria-busy="true"] .lab {{ visibility: hidden; }}
.{i}[aria-busy="true"] .spin {{ visibility: visible; animation: {i}-rot .7s linear infinite; }}
@keyframes {i}-rot {{ to {{ transform: rotate(1turn); }} }}
""",
        "glitch": f"""
.{i} {{ padding: 12px 18px; border: 1px solid {ink}; border-radius: 4px; background: {fill}; color: {ink}; font-family: ui-monospace, monospace; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }}
.{i} .ch {{ display: inline-block; position: relative; }}
.{i}:hover:not(:disabled) .ch::after {{ content: var(--g, "*"); position: absolute; inset: 0; color: {acc}; animation: {i}-flip .2s calc(var(--i) * .05s) steps(1); }}
@keyframes {i}-flip {{ 20% {{ content: "_"; }} 40% {{ content: var(--c1, "x"); }} 60% {{ content: var(--c2, "$"); }} 100% {{ content: ""; }} }}
""",
        "shadow-border": f"""
.{i} {{ padding: 11px 22px; border: 0; border-radius: 10px; background: {fill}; color: {ink}; font-weight: 600; font-size: 14px; box-shadow: 0 0 0 1px {acc}, 0 1px 2px rgba(0,0,0,.08), 0 8px 16px rgba(0,0,0,.06); }}
.{i}:hover:not(:disabled) {{ box-shadow: 0 0 0 1px #a8a29e, 0 1px 2px rgba(0,0,0,.1), 0 12px 24px rgba(0,0,0,.1); transform: translateY(-1px); }}
""",
        "tw-lab": f"""
.{i} {{ padding: 10px 18px; border: 0; border-radius: 12px; background: {fill}; color: {ink}; font-weight: 500; font-size: 14px; }}
.{i} .lab {{ position: relative; }}
.{i} .lab::after {{ content: ""; position: absolute; left: 0; right: 0; bottom: -3px; height: 1px; background: {acc}; transform: scaleX(0); transform-origin: left; transition: transform .25s ease; }}
.{i}:hover:not(:disabled) .lab::after {{ transform: scaleX(1); }}
""",
        "fifty-kit": f"""
.{i} {{ padding: 11px 20px; border: 0; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 600; overflow: hidden; }}
.{i}::after {{ content: ""; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 30%, {acc} 50%, transparent 70%); transform: translateX(-120%); }}
.{i}:hover:not(:disabled)::after {{ animation: {i}-shine .7s ease; }}
@keyframes {i}-shine {{ to {{ transform: translateX(120%); }} }}
""",
        "pointer-down": f"""
.{i} {{ position: relative; padding: 12px 22px; border: 0; border-radius: 10px; background: {fill}; color: {ink}; font-weight: 650; box-shadow: 0 3px 0 {acc}; cursor: pointer; overflow: hidden; }}
.{i}::after {{ content: ""; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.55) 50%, transparent 60%); transform: translateX(-100%); pointer-events: none; }}
.{i}:active:not(:disabled) {{ transform: translateY(2px); box-shadow: 0 1px 0 {acc}; }}
.{i}:active:not(:disabled)::after {{ animation: {i}-press-shimmer .55s ease-out; }}
@keyframes {i}-press-shimmer {{ to {{ transform: translateX(100%); }} }}
""",
        "bevel": f"""
.{i} {{ padding: 11px 22px; border-radius: 10px; border: 1px solid rgba(0,0,0,.08); background: {fill}; color: {ink}; font-weight: 600; box-shadow: 0 1px 0 {acc} inset, 0 -1px 0 rgba(0,0,0,.12) inset, 0 8px 16px rgba(0,0,0,.08); }}
.{i}:hover:not(:disabled) {{ filter: brightness(1.03); }}
""",
        "explore-3d": f"""
.{i} {{ padding: 13px 26px; border: 0; border-radius: 14px; background: radial-gradient(120% 80% at 50% 0%, {acc}, {fill}); color: {ink}; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; font-size: 12px; transform-style: preserve-3d; box-shadow: 0 12px 32px color-mix(in srgb, {acc} 35%, transparent); }}
.{i} .plane {{ position: absolute; inset: 6px; border-radius: 10px; border: 1px solid color-mix(in srgb, {acc} 50%, transparent); transform: translateZ(12px); pointer-events: none; }}
.{i}:hover:not(:disabled) {{ transform: rotateX(8deg) rotateY(-6deg); }}
.{i}::after {{ content: ""; position: absolute; inset: 0; background: conic-gradient(from 0deg, transparent, {acc}, transparent 30%); opacity: .35; mix-blend-mode: screen; animation: {i}-glint 3s linear infinite; }}
@keyframes {i}-glint {{ to {{ transform: rotate(1turn); }} }}
""",
        "search-pill": f"""
.{i}-root {{ display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; min-height: 0; }}
.{i} {{ width: 40px; height: 40px; padding: 0; border: 0; border-radius: 999px; background: {fill}; color: {ink}; overflow: hidden; gap: 0; transition: width .35s cubic-bezier(.2,.8,.2,1), padding .35s cubic-bezier(.2,.8,.2,1), gap .35s cubic-bezier(.2,.8,.2,1); }}
.{i} .lab {{ position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); opacity: 0; pointer-events: none; font-weight: 600; font-size: 13px; white-space: nowrap; }}
.{i} .mag {{ width: 18px; height: 18px; border: 0; position: relative; flex: 0 0 18px; display: block; }}
.{i} .mag::before {{ content: ""; position: absolute; top: 2px; left: 2px; width: 10px; height: 10px; border: 2px solid {ink}; border-radius: 50%; }}
.{i} .mag::after {{ content: ""; position: absolute; width: 6px; height: 2px; background: {ink}; right: 1px; bottom: 3px; transform: rotate(45deg); border-radius: 1px; }}
.{i}:hover:not(:disabled), .{i}:focus-visible {{ width: 128px; padding: 0 14px; gap: 8px; }}
.{i}:hover:not(:disabled) .lab, .{i}:focus-visible .lab {{ position: static; width: auto; height: auto; clip-path: none; overflow: visible; opacity: 1; pointer-events: auto; }}
""",
        "liquid-css": f"""
.{i} {{ padding: 12px 24px; border: 1px solid color-mix(in srgb, {acc} 50%, white); border-radius: 999px; background: {fill}; color: {ink}; font-weight: 600; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: 0 1px 0 rgba(255,255,255,.7) inset, 0 10px 30px rgba(15,23,42,.12); }}
.{i}::after {{ content: ""; position: absolute; left: 18%; right: 22%; top: 4px; height: 40%; border-radius: 999px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent); animation: {i}-cau 3s ease-in-out infinite; }}
@keyframes {i}-cau {{ 50% {{ transform: translateX(12%); opacity: .4; }} }}
""",
        "conic-p3": f"""
.{i} {{ padding: 12px 26px; border: 0; border-radius: 16px; background: {fill}; color: {ink}; font-weight: 650; overflow: hidden; box-shadow: 0 1px 0 #fff inset, 0 0 0 1px rgba(0,0,0,.06); }}
/* 240% size + 120% offset keeps the blob >=20% past every edge for any cursor
   position, so the white base never shows; the page script lerps --mx/--my
   toward the pointer (rAF), so the blob glides after it. */
.{i}::before {{ content: ""; position: absolute; width: 240%; height: 240%; left: calc(var(--mx, 50%) - 120%); top: calc(var(--my, 50%) - 120%); background: conic-gradient(from 0deg, {acc}, #60a5fa, #fbbf24, {acc}); opacity: 0; transition: opacity .2s ease; }}
.{i}:hover:not(:disabled)::before {{ opacity: .55; }}
.{i} .lab {{ position: relative; z-index: 1; }}
""",
        "overlay-cta": f"""
.{i} {{ padding: 11px 20px 11px 16px; border: 0; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 700; overflow: hidden; }}
.{i} .play {{ width: 0; height: 0; border-style: solid; border-width: 6px 0 6px 10px; border-color: transparent transparent transparent {ink}; }}
.{i}::after {{ content: ""; position: absolute; inset: 0; background: color-mix(in srgb, {acc} 35%, {fill}); transform: translateX(-100%); transition: transform .35s ease; }}
.{i}:hover:not(:disabled)::after {{ transform: translateX(0); }}
.{i} .lab, .{i} .play {{ position: relative; z-index: 1; }}
""",
        "haptic": f"""
.{i} {{ padding: 14px 28px; border: 0; border-radius: 16px; background: {fill}; color: {ink}; font-weight: 700; box-shadow: 0 6px 0 {acc}, 0 12px 20px rgba(0,0,0,.12); transition: transform .12s cubic-bezier(.2,.8,.2,1), box-shadow .12s; }}
.{i}:hover:not(:disabled) {{ transform: translateY(-2px); }}
.{i}:active:not(:disabled) {{ transform: translateY(4px) scale(.97); box-shadow: 0 2px 0 {acc}, 0 4px 8px rgba(0,0,0,.12); }}
""",
        "layer-step": f"""
.{i} {{ --step: 0.5rem; --a: 0; padding: 12px 22px; border: 0; border-radius: 8px; background: {fill}; color: {ink}; font-weight: 600; }}
.{i}:hover:not(:disabled) {{ --a: 1; }}
.{i}:active:not(:disabled) {{ --a: .5; }}
.{i} .lab {{ translate: 0 calc(var(--a) * var(--step) * -1); transition: translate .2s ease; text-shadow: 0 calc(var(--step)) 0 {acc}; }}
""",
        "challenge": f"""
.{i} {{ padding: 12px 24px; border: 0; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 700; }}
.{i}:hover:not(:disabled) {{ box-shadow: 0 0 0 6px color-mix(in srgb, {acc} 35%, transparent), 0 0 0 12px color-mix(in srgb, {acc} 18%, transparent); animation: {i}-ring .6s ease; }}
@keyframes {i}-ring {{ from {{ box-shadow: 0 0 0 0 transparent; }} }}
""",
        "dir-roll": f"""
.{i} {{ --y: 0lh; padding: 12px 22px; border: 0; border-radius: 8px; background: {fill}; color: {ink}; font-weight: 700; overflow: hidden; line-height: 1.2; }}
.{i} .lab {{ display: block; translate: 0 var(--y); transition: translate .875s linear(0, .09, 1); text-shadow: 0 1lh currentColor, 0 -1lh currentColor; }}
.{i}:hover:not(:disabled) {{ --y: -1lh; }}
.{i}:has(.east:hover) {{ --y: 1lh; }}
.{i} .east {{ position: absolute; inset: 0 0 0 50%; }}
""",
        "border-beam": f"""
.{i} {{ padding: 12px 24px; border: 1px solid transparent; border-radius: 999px; background: linear-gradient({fill}, {fill}) padding-box, conic-gradient(from var(--beam, 0deg), transparent 70%, {acc}, transparent) border-box; color: {ink}; font-weight: 650; }}
.{i}:hover:not(:disabled) {{ animation: {i}-beam 1.2s linear infinite; }}
@keyframes {i}-beam {{ to {{ --beam: 360deg; }} }}
@property --beam {{ syntax: "<angle>"; inherits: false; initial-value: 0deg; }}
""",
        "wwdc-gloss": f"""
.{i} {{ padding: 11px 26px; border: 1px solid #d2d2d7; border-radius: 12px; background: linear-gradient(#fff, {fill}); color: {ink}; font-weight: 600; box-shadow: 0 1px 0 #fff inset, 0 8px 18px rgba(0,0,0,.08); }}
.{i}::after {{ content: ""; position: absolute; left: 10%; right: 10%; top: 3px; height: 42%; border-radius: 10px; background: linear-gradient(rgba(255,255,255,.9), transparent); pointer-events: none; }}
.{i}:active:not(:disabled) {{ transform: translateY(1px); }}
""",
        "five-hovers": f"""
.{i} {{ padding: 11px 22px; border: 2px solid {acc}; border-radius: 6px; background: {acc}; color: {ink}; font-weight: 700; overflow: hidden; }}
.{i}::before {{ content: ""; position: absolute; z-index: 0; inset: -2px; background: {fill}; transform: translate3d(0, 0, 0); transition: transform .3s ease; pointer-events: none; }}
.{i} .lab {{ position: relative; z-index: 1; color: {fill}; mix-blend-mode: difference; }}
.{i}:hover:not(:disabled)::before {{ transform: translate3d(0, -105%, 0); }}
""",
        "disco": f"""
.{i} {{ padding: 12px 22px; border: 0; border-radius: 12px; background: {fill}; color: {ink}; font-weight: 700; }}
.{i}::before {{ content: ""; position: absolute; inset: -3px; border-radius: 14px; padding: 3px; background: conic-gradient(from var(--d, 0deg), {acc}, #22d3ee, #a3e635, {acc}); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; }}
.{i}[aria-busy="true"]::before {{ opacity: 1; animation: {i}-disco .9s linear infinite; }}
@keyframes {i}-disco {{ to {{ --d: 360deg; }} }}
@property --d {{ syntax: "<angle>"; inherits: false; initial-value: 0deg; }}
""",
        "gravity": f"""
.{i} {{ padding: 14px 26px 18px; border: 0; border-radius: 10px; background: {fill}; color: {ink}; font-weight: 800; overflow: hidden; }}
.{i} .orb {{ position: absolute; width: 8px; height: 8px; border-radius: 50%; background: {acc}; bottom: 6px; animation: {i}-fall 1.6s cubic-bezier(.2,.8,.2,1) infinite; }}
.{i} .orb:nth-child(1) {{ left: 18%; animation-delay: 0s; }}
.{i} .orb:nth-child(2) {{ left: 48%; animation-delay: .2s; }}
.{i} .orb:nth-child(3) {{ left: 74%; animation-delay: .35s; }}
.{i}:hover:not(:disabled) .orb {{ animation-duration: .7s; }}
@keyframes {i}-fall {{ 0% {{ transform: translateY(-18px); }} 60% {{ transform: translateY(0); }} 80% {{ transform: translateY(-4px); }} 100% {{ transform: translateY(0); }} }}
""",
        "drop-finish": f"""
.{i} {{ padding: 11px 22px; border: 1px solid {acc}; border-radius: 10px; background: {fill}; color: {ink}; font-weight: 600; box-shadow: 0 10px 18px rgba(28,25,23,.16); }}
.{i}:hover:not(:disabled) {{ box-shadow: 0 14px 24px rgba(28,25,23,.2); transform: translateY(-1px); }}
""",
        "julius-glass": f"""
.{i} {{ padding: 12px 24px; border: 1px solid {acc}; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 650; backdrop-filter: blur(18px); box-shadow: 0 1px 0 #fff inset; min-width: 108px; }}
.{i}[data-state="busy"] {{ letter-spacing: .08em; }}
.{i}[data-state="done"] {{ background: #dcfce7; }}
""",
        "syntax-glass": f"""
.{i} {{ padding: 12px 22px; border: 1px solid {acc}; border-radius: 10px; background: {fill}; color: {ink}; font-weight: 800; backdrop-filter: blur(12px); box-shadow: 0 0 0 4px rgba(250,204,21,.12), 0 1px 0 rgba(255,255,255,.25) inset; }}
.{i}:hover:not(:disabled) {{ box-shadow: 0 0 0 6px rgba(250,204,21,.18), 0 1px 0 rgba(255,255,255,.35) inset; }}
""",
        "send-email": f"""
.{i} {{ padding: 12px 28px; border: 0; border-radius: 999px; background: linear-gradient(#f7f7f8, {fill} 40%, #c8c8cd); color: {ink}; font-weight: 700; font-size: 15px; box-shadow: inset 0 1px 0 {acc}, inset 0 -2px 3px rgba(0,0,0,.12), 0 4px 10px rgba(0,0,0,.16); }}
.{i}::after {{ content: ""; position: absolute; left: 12%; right: 12%; top: 3px; height: 45%; border-radius: 999px; background: linear-gradient(rgba(255,255,255,.85), transparent); pointer-events: none; }}
.{i} .lab {{ position: relative; z-index: 1; }}
.{i}:active:not(:disabled) {{ transform: translateY(1px); box-shadow: inset 0 2px 4px rgba(0,0,0,.22); }}
""",
        "ios-yellow": f"""
.{i} {{ width: 72px; height: 72px; padding: 0; border: 0; border-radius: 22px; background: linear-gradient({fill}, {acc}); color: {ink}; font-size: 0; box-shadow: 0 1px 0 rgba(255,255,255,.55) inset, 0 10px 18px rgba(180,90,0,.28); }}
.{i}::after {{ content: ""; position: absolute; left: 10px; right: 10px; top: 6px; height: 38%; border-radius: 18px 18px 40% 40%; background: linear-gradient(rgba(255,255,255,.75), transparent); pointer-events: none; }}
.{i}:active:not(:disabled) {{ transform: translateY(2px); filter: brightness(.92); }}
""",
        "glass-mix": f"""
.{i} {{ padding: 12px 24px; border: 1px solid {acc}; border-radius: 14px; background: {fill}; color: {ink}; font-weight: 600; backdrop-filter: blur(10px); box-shadow: 0 1px 0 #fff inset, 0 -10px 20px rgba(255,255,255,.4) inset, 0 10px 24px rgba(15,23,42,.1); }}
.{i}::after {{ content: ""; position: absolute; left: 12px; right: 40%; top: 4px; height: 7px; border-radius: 8px; background: linear-gradient(#fff, transparent); opacity: .8; }}
""",
        "scroll-mark": f"""
.{i} {{ padding: 10px 16px; border: 0; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 600; }}
.{i} .chev {{ display: inline-block; transition: transform .25s ease; }}
.{i}:hover:not(:disabled) .chev {{ transform: translateX(4px); }}
""",
        "retro-2010": f"""
.{i} {{ padding: 10px 22px; border: 1px solid {acc}; border-radius: 6px; background: linear-gradient(#60a5fa, {fill} 55%, {acc}); color: {ink}; font-weight: 700; text-shadow: 0 1px 0 rgba(0,0,0,.25); box-shadow: 0 1px 0 rgba(255,255,255,.45) inset, 0 2px 0 {acc}; }}
.{i}:active:not(:disabled) {{ box-shadow: 0 1px 0 {acc} inset; transform: translateY(1px); }}
""",
        "proximity": f"""
.{i}-root {{ gap: 8px; }}
.{i}-ghost {{ width: 28px; height: 28px; border-radius: 8px; background: #1e293b; opacity: .35; transition: opacity .2s, transform .2s; }}
.{i}-root:hover .{i}-ghost {{ opacity: .85; transform: scale(1.08); }}
.{i} {{ padding: 10px 18px; border: 0; border-radius: 8px; background: {fill}; color: {ink}; font-weight: 700; box-shadow: 0 0 0 1px {acc}; }}
""",
        "metallic": f"""
.{i} {{ padding: 12px 24px; border: 1px solid #6b7280; border-radius: 8px; background: repeating-linear-gradient(90deg, {fill}, {acc} 8px, {fill} 16px); color: {ink}; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; font-size: 12px; }}
.{i}::after {{ content: ""; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.7) 50%, transparent 60%); transform: translateX(-60%); }}
.{i}:hover:not(:disabled)::after {{ animation: {i}-spec .8s ease; }}
.{i}:hover:not(:disabled) {{ color: #ff5a8a; text-shadow: 0 1px 2px rgba(255,255,255,.55); }}
@keyframes {i}-spec {{ to {{ transform: translateX(60%); }} }}
""",
        "modern-sheet": f"""
.{i} {{ padding: 12px 20px; border: 0; border-radius: 2px; background: {fill}; color: {ink}; font-weight: 600; letter-spacing: .28em; text-transform: uppercase; font-size: 11px; transition: letter-spacing 420ms cubic-bezier(0.22, 1, 0.36, 1); }}
.{i}:hover:not(:disabled) {{ letter-spacing: .38em; }}
""",
        "proper-lg": f"""
.{i} {{ padding: 13px 26px; border: 1px solid color-mix(in srgb, {acc} 70%, white); border-radius: 22px; background: {fill}; color: {ink}; font-weight: 650; backdrop-filter: blur(22px) saturate(1.4); box-shadow: 0 1px 0 #fff inset, 0 16px 40px rgba(11,18,32,.18); }}
.{i}:active:not(:disabled) {{ transform: scale(.96); }}
""",
        "tw-ripple": f"""
.{i} {{ padding: 11px 22px; border: 0; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 600; overflow: hidden; }}
.{i} .wave {{ position: absolute; border-radius: 50%; background: {acc}; transform: scale(0); animation: {i}-rip .6s ease-out; pointer-events: none; }}
@keyframes {i}-rip {{ to {{ transform: scale(4); opacity: 0; }} }}
""",
        "cross-ripple": f"""
.{i} {{ padding: 12px 24px; border: 0; border-radius: 8px; background: {fill}; color: {ink}; font-weight: 650; overflow: hidden; }}
.{i}::after {{ content: ""; position: absolute; width: 12px; height: 12px; border-radius: 50%; background: {acc}; left: 50%; top: 50%; transform: translate(-50%,-50%) scale(0); opacity: .5; }}
.{i}:hover:not(:disabled)::after {{ animation: {i}-wave .7s ease-out; }}
@keyframes {i}-wave {{ to {{ transform: translate(-50%,-50%) scale(22); opacity: 0; }} }}
""",
        "candy-ghost": f"""
.{i} {{ padding: 11px 22px; border: 2px solid {ink}; border-radius: 999px; background: {fill}; color: {ink}; font-weight: 700; overflow: hidden; }}
.{i}::before {{ content: ""; position: absolute; inset: 0; background: {acc}; transform: translateY(100%); transition: transform .35s cubic-bezier(.2,.8,.2,1); }}
.{i} .lab {{ position: relative; z-index: 1; transition: color .35s cubic-bezier(.2,.8,.2,1); }}
.{i}:hover:not(:disabled)::before {{ transform: translateY(0); }}
.{i}:hover:not(:disabled) .lab {{ color: #831843; }}
""",
        "css-3d": f"""
.{i} {{ padding: 12px 22px; border: 0; border-radius: 8px; background: {fill}; color: {ink}; font-weight: 800; box-shadow: 0 6px 0 {acc}; transform: translateY(-2px); }}
.{i}:active:not(:disabled) {{ transform: translateY(4px); box-shadow: 0 0 0 {acc}; }}
""",
        "nerd": f"""
.{i} {{ padding: 8px 12px; border: 0; border-radius: 8px; background: {fill}; color: {ink}; font-weight: 600; font-size: 13px; }}
.{i}:hover:not(:disabled) {{ animation: {i}-wiggle .4s ease; }}
@keyframes {i}-wiggle {{ 25% {{ transform: rotate(-6deg); }} 75% {{ transform: rotate(6deg); }} }}
""",
        "tilt3d": f"""
.{i}-root {{ perspective: 600px; }}
.{i} {{ padding: 12px 24px; border: 0; border-radius: 12px; background: {fill}; color: {ink}; font-weight: 700; transform-style: preserve-3d; transition: transform .25s ease; box-shadow: 0 18px 30px rgba(49,46,129,.35); }}
.{i}:hover:not(:disabled) {{ transform: rotateX(8deg) rotateY(-12deg); }}
""",
        "download-now": f"""
.{i} {{ padding: 0; border: 0; border-radius: 4px; background: transparent; color: {ink}; font-weight: 800; letter-spacing: .08em; font-size: 12px; overflow: hidden; box-shadow: 0 8px 16px rgba(0,0,0,.35); }}
.{i} .disk {{ display: flex; align-items: center; justify-content: center; width: 42px; height: 40px; background: {acc}; clip-path: polygon(0 0, 78% 0, 100% 50%, 78% 100%, 0 100%); font-size: 16px; }}
.{i} .lab {{ padding: 0 18px 0 10px; height: 40px; display: flex; align-items: center; background: linear-gradient(#3ec4d8, {fill}); }}
.{i}:hover:not(:disabled) .lab {{ filter: brightness(1.08); }}
.{i}:active:not(:disabled) {{ transform: translateY(1px); }}
""",
        "giana-dir": f"""
.{i} {{ width: 150px; padding: 16px 20px; border: 0; border-radius: 6px; background: {fill}; color: {ink}; font-weight: 700; overflow: hidden; }}
.{i} .fill {{ position: absolute; inset: 0; background: {acc}; z-index: 0; }}
/* Retract is faster than cover (.16s vs .28s) so a trailing fill is gone
   before the next one is halfway in — no double-stripe crossing artifacts. */
.{i} .fill-w {{ transform: scaleX(0); transform-origin: left; transition: transform .16s ease-out; }}
.{i} .fill-e {{ transform: scaleX(0); transform-origin: right; transition: transform .16s ease-out; }}
.{i} .fill-n {{ transform: scaleY(0); transform-origin: top; transition: transform .16s ease-out; }}
.{i} .fill-s {{ transform: scaleY(0); transform-origin: bottom; transition: transform .16s ease-out; }}
.{i} .fill-c {{ transform: scale(0); transform-origin: center; transition: transform .16s ease-out; }}
.{i} .hit {{ position: absolute; z-index: 2; }}
/* Zones tile without overlap: side columns own their full height, top/bottom
   strips span only the middle, center covers the text area. */
.{i} .hit-w {{ inset: 0 70% 0 0; }}
.{i} .hit-e {{ inset: 0 0 0 70%; }}
.{i} .hit-n {{ inset: 0 30% 70% 30%; }}
.{i} .hit-s {{ inset: 70% 30% 0 30%; }}
.{i} .hit-c {{ inset: 30%; }}
.{i} .hit-w:hover ~ .fill-w {{ transform: scaleX(1); transition: transform .28s ease; }}
.{i} .hit-e:hover ~ .fill-e {{ transform: scaleX(1); transition: transform .28s ease; }}
.{i} .hit-n:hover ~ .fill-n {{ transform: scaleY(1); transition: transform .28s ease; }}
.{i} .hit-s:hover ~ .fill-s {{ transform: scaleY(1); transition: transform .28s ease; }}
.{i} .hit-c:hover ~ .fill-c {{ transform: scale(1); transition: transform .28s ease; }}
.{i} .lab {{ position: relative; z-index: 1; transition: color .16s ease-out; }}
.{i} .hit-w:hover ~ .lab, .{i} .hit-e:hover ~ .lab, .{i} .hit-n:hover ~ .lab, .{i} .hit-s:hover ~ .lab, .{i} .hit-c:hover ~ .lab {{ color: {fill}; transition: color .28s ease; }}
""",
        "one-div": f"""
.{i} {{ padding: 12px 24px; border: 0; border-radius: 4px; background: {fill}; color: {ink}; font-weight: 800; box-shadow: inset 0 0 0 0 {acc}; transition: box-shadow .35s ease, color .35s; }}
.{i}:hover:not(:disabled) {{ box-shadow: inset 0 -3.2em 0 0 {acc}; }}
""",
        "hover-active": f"""
.{i} {{ padding: 12px 22px; border: 1px solid {acc}; border-radius: 10px; background: {fill}; color: {ink}; font-weight: 700; transform: perspective(400px) rotateX(0); transition: transform .2s ease; box-shadow: 0 10px 0 {acc}; }}
.{i}:hover:not(:disabled) {{ transform: perspective(400px) rotateX(12deg); }}
.{i}:active:not(:disabled) {{ transform: perspective(400px) rotateX(0) translateY(8px); box-shadow: 0 2px 0 {acc}; }}
""",
        "fifteen": f"""
.{i} {{ --lift: 4px; padding: 12px 20px; border: 0; border-radius: 8px; background: {fill}; color: {ink}; font-weight: 700; box-shadow: 0 var(--lift) 0 {acc}; transform: translateY(calc(var(--lift) * -1)); transition: transform .15s, box-shadow .15s; }}
.{i}:hover:not(:disabled) {{ --lift: 6px; }}
.{i}:active:not(:disabled) {{ --lift: 0px; }}
""",
        "micro-scale": f"""
.{i} {{ padding: 12px 22px; border: 0; border-radius: 10px; background: {fill}; color: {ink}; font-weight: 600; transition: transform .18s ease; }}
.{i}:hover:not(:disabled) {{ transform: scale(1.04); }}
.{i}:active:not(:disabled) {{ transform: scale(.98); }}
""",
    }
    if k not in extra:
        raise SystemExit(f"missing kind css: {k}")
    return base_css(row) + "\n" + extra[k].strip()


def inner_html(row: dict) -> str:
    k, label = row["kind"], row["label"]
    esc = (
        label.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )
    if k == "glitch":
        garbage = ["x", "$", "≈", "ç", "&", "π", "_", "#"]
        parts = []
        for n, ch in enumerate(esc):
            c1, c2 = garbage[n % 8], garbage[(n + 3) % 8]
            parts.append(
                f'<span class="ch" style="--i:{n};--g:\'{garbage[(n+1)%8]}\';--c1:\'{c1}\';--c2:\'{c2}\'">{ch}</span>'
            )
        return "".join(parts)
    if k == "grid-spin":
        return f'<span class="lab">{esc}</span><span class="spin" aria-hidden="true"></span>'
    if k == "invert-spot":
        return f'<span class="spot" aria-hidden="true"></span><span class="lab">{esc}</span>'
    if k == "search-pill":
        return f'<span class="mag" aria-hidden="true"></span><span class="lab">{esc}</span>'
    if k == "overlay-cta":
        return f'<span class="play" aria-hidden="true"></span><span class="lab">{esc}</span>'
    if k == "send-email":
        return f'<span class="lab">{esc}</span>'
    if k == "scroll-mark":
        return f'<span class="lab">{esc}</span><span class="chev" aria-hidden="true">→</span>'
    if k == "explore-3d":
        return f'<span class="plane" aria-hidden="true"></span><span class="lab">{esc}</span>'
    if k == "dir-roll":
        return f'<span class="lab">{esc}</span><span class="east" aria-hidden="true"></span>'
    if k == "layer-step":
        return f'<span class="lab">{esc}</span>'
    if k == "gravity":
        return (
            '<span class="orb" aria-hidden="true"></span>'
            '<span class="orb" aria-hidden="true"></span>'
            '<span class="orb" aria-hidden="true"></span>'
            f'<span class="lab">{esc}</span>'
        )
    if k == "download-now":
        return f'<span class="disk" aria-hidden="true">💾</span><span class="lab">{esc}</span>'
    if k == "giana-dir":
        return (
            '<span class="hit hit-w"></span><span class="hit hit-e"></span>'
            '<span class="hit hit-n"></span><span class="hit hit-s"></span>'
            '<span class="hit hit-c"></span>'
            '<span class="fill fill-w" aria-hidden="true"></span>'
            '<span class="fill fill-e" aria-hidden="true"></span>'
            '<span class="fill fill-n" aria-hidden="true"></span>'
            '<span class="fill fill-s" aria-hidden="true"></span>'
            '<span class="fill fill-c" aria-hidden="true"></span>'
            f'<span class="lab">{esc}</span>'
        )
    if k in {"height", "conic-p3", "five-hovers", "candy-ghost", "tw-lab", "fifty-kit", "cq-shimmer"}:
        return f'<span class="lab">{esc}</span>'
    return esc


def wrap_root(row: dict, inner_btn: str) -> str:
    i = row["id"]
    if row["kind"] == "proximity":
        return (
            f'<div class="{i}-root">'
            f'<span class="{i}-ghost" aria-hidden="true"></span>'
            f"{inner_btn}"
            f'<span class="{i}-ghost" aria-hidden="true"></span>'
            f"</div>"
        )
    return f'<div class="{i}-root">{inner_btn}</div>'


def button_open(row: dict) -> str:
    i = row["id"]
    attrs = f'class="{i}" type="button" data-x50="{i}" aria-label="{row["label"]}"'
    if row["kind"] in {"grid-spin", "disco"}:
        attrs += ' aria-busy="false"'
    if row["kind"] == "julius-glass":
        attrs += ' data-state="idle"'
    return f"<button {attrs}>"


def markup(row: dict) -> str:
    btn = button_open(row) + inner_html(row) + "</button>"
    return wrap_root(row, btn)


BOOT_KINDS = {"conic-p3", "tw-ripple", "grid-spin", "disco", "julius-glass", "invert-spot"}


def boot_js(row: dict) -> str:
    k, i = row["kind"], row["id"]
    if k == "conic-p3":
        return (
            f'(function(btn){{if(!btn)return;var tx=50,ty=50,cx=50,cy=50,raf=0;'
            f'function tick(){{cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;'
            f'btn.style.setProperty("--mx",cx+"%");btn.style.setProperty("--my",cy+"%");'
            f'raf=(Math.abs(tx-cx)>.05||Math.abs(ty-cy)>.05)?requestAnimationFrame(tick):0;}}'
            f'btn.addEventListener("pointermove",function(e){{var r=btn.getBoundingClientRect();'
            f'tx=(e.clientX-r.left)/r.width*100;ty=(e.clientY-r.top)/r.height*100;'
            f'if(!raf)raf=requestAnimationFrame(tick);}});'
            f'btn.addEventListener("pointerleave",function(){{tx=50;ty=50;if(!raf)raf=requestAnimationFrame(tick);}});'
            f'}})(document.querySelector(".{i}"));'
        )
    if k == "tw-ripple":
        return (
            f'(function(btn){{if(!btn)return;btn.addEventListener("click",function(e){{if(btn.disabled)return;'
            f'var r=btn.getBoundingClientRect(),s=Math.max(r.width,r.height)*1.1,w=document.createElement("span");'
            f'w.className="wave";w.style.width=s+"px";w.style.height=s+"px";'
            f'w.style.left=(e.clientX-r.left-s/2)+"px";w.style.top=(e.clientY-r.top-s/2)+"px";'
            f'btn.appendChild(w);setTimeout(function(){{w.remove();}},650);}});}})(document.querySelector(".{i}"));'
        )
    if k == "grid-spin":
        return (
            f'(function(btn){{if(!btn)return;btn.addEventListener("click",function(){{if(btn.disabled||btn.getAttribute("aria-busy")==="true")return;'
            f'btn.setAttribute("aria-busy","true");setTimeout(function(){{btn.setAttribute("aria-busy","false");}},1400);}});}})(document.querySelector(".{i}"));'
        )
    if k == "disco":
        return (
            f'(function(btn){{if(!btn)return;btn.addEventListener("click",function(){{if(btn.disabled||btn.getAttribute("aria-busy")==="true")return;'
            f'btn.setAttribute("aria-busy","true");setTimeout(function(){{btn.setAttribute("aria-busy","false");}},1600);}});}})(document.querySelector(".{i}"));'
        )
    if k == "julius-glass":
        return (
            f'(function(btn){{if(!btn)return;var order=["idle","busy","done"];btn.addEventListener("click",function(){{'
            f'if(btn.disabled)return;var i=order.indexOf(btn.getAttribute("data-state")||"idle");'
            f'btn.setAttribute("data-state",order[(i+1)%order.length]);}});}})(document.querySelector(".{i}"));'
        )
    if k == "invert-spot":
        return (
            f'(function(btn){{if(!btn)return;btn.addEventListener("pointermove",function(e){{'
            f'var r=btn.getBoundingClientRect();btn.style.setProperty("--x",(e.clientX-r.left)+"px");'
            f'btn.style.setProperty("--y",(e.clientY-r.top)+"px");}});}})(document.querySelector(".{i}"));'
        )
    return ""


def html_page(row: dict) -> str:
    css = kind_css(row)
    boot = boot_js(row)
    script = f"<script>{boot}</script>" if boot else ""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{row["name"]}</title>
  <style>
    body {{ margin: 0; min-height: 100vh; display: grid; place-items: center; background: #e8eaee; }}
    {css}
  </style>
</head>
<body>
  {markup(row)}
  {script}
</body>
</html>
"""


def react_snippet(row: dict) -> str:
    i = row["id"]
    css = kind_css(row)
    boot = boot_js(row).replace(f'document.querySelector(".{i}")', "el")
    name = "X50" + pascal(i) + "Button"
    inner = inner_html(row)
    # convert class to className, style string stays
    inner_jsx = inner.replace("class=", "className=")
    busy = ' aria-busy="false"' if row["kind"] in {"grid-spin", "disco"} else ""
    state = ' data-state="idle"' if row["kind"] == "julius-glass" else ""
    effect = ""
    if boot:
        effect = f"""
  React.useEffect(() => {{
    const el = ref.current;
    if (!el) return;
    {boot}
  }}, []);
"""
    ref = " const ref = React.useRef(null);" if boot else ""
    refattr = " ref={ref}" if boot else ""
    return f'''"use client";
import React from "react";

const CSS = {js_str(css)};

export default function {name}({{ disabled = false }}) {{{ref}
  React.useEffect(() => {{
    if (document.getElementById({js_str(i + "-css")})) return;
    const tag = document.createElement("style");
    tag.id = {js_str(i + "-css")};
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }}, []);
{effect}
  return (
    <div className={js_str(i + "-root")}>
      <button{refattr} className={js_str(i)} type="button" data-x50={js_str(i)} aria-label={js_str(row["label"])} disabled={{disabled}}{busy}{state}>
        {inner_jsx}
      </button>
    </div>
  );
}}
'''


def node_snippet(row: dict) -> str:
    page = html_page(row)
    return f"""import http from "node:http";
const PAGE = {js_str(page)};
http.createServer((req, res) => {{
  res.writeHead(200, {{ "Content-Type": "text/html; charset=utf-8" }});
  res.end(PAGE);
}}).listen(3000, () => console.log("http://localhost:3000"));
"""


def write_catalog_js():
    slim = []
    for row in ROWS:
        slim.append(
            {
                **{k: row[k] for k in (
                    "id", "index", "bucket", "url", "author", "views", "likes",
                    "reposts", "metric", "score", "name", "label", "blurb",
                    "style_note", "marker", "kind", "fill", "ink", "accent",
                )},
                "states": "default, hover, focus-visible, active, disabled"
                + (", loading" if row["kind"] in {"grid-spin", "disco", "julius-glass"} else ""),
                "keywords": keywords(row),
            }
        )
    (OUT / "catalog.js").write_text(
        "export const TWITTER_50 = " + json.dumps(slim, indent=2, ensure_ascii=False) + ";\n"
        "export const TWITTER_50_LAST_PRIOR = \"dust-premium\";\n",
        encoding="utf-8",
    )
    return slim


def write_css():
    chunks = ["/* generated from plans/twitter-50-catalog.json — unique prefix per tray */"]
    for row in ROWS:
        chunks.append(kind_css(row))
    (OUT / "twitter-50.css").write_text("\n\n".join(chunks) + "\n", encoding="utf-8")


def write_snippets(slim):
    parts = [
        "import { TWITTER_50 } from \"./catalog.js\";",
        "",
        "const PAGES = {",
    ]
    for row in ROWS:
        parts.append(f"  {js_str(row['id'])}: {js_str(html_page(row))},")
    parts.append("};")
    parts.append("const REACT = {")
    for row in ROWS:
        parts.append(f"  {js_str(row['id'])}: {js_str(react_snippet(row))},")
    parts.append("};")
    parts.append("const NODE = {")
    for row in ROWS:
        parts.append(f"  {js_str(row['id'])}: {js_str(node_snippet(row))},")
    parts.append("};")
    parts.append(
        """
export const TWITTER_50_SNIPPETS = Object.fromEntries(
  TWITTER_50.map((row) => [
    row.id,
    { html: PAGES[row.id], react: REACT[row.id], node: NODE[row.id] },
  ])
);

export const TWITTER_50_METAS = Object.fromEntries(
  TWITTER_50.map((row) => [
    row.id,
    {
      id: row.id,
      name: row.name,
      blurb: row.blurb,
      states: row.states,
      keywords: row.keywords,
    },
  ])
);
"""
    )
    (OUT / "snippets.js").write_text("\n".join(parts), encoding="utf-8")


def write_jsx():
    (OUT / "Twitter50Button.jsx").write_text(
        '''import { useEffect, useRef } from "react";
import "./twitter-50.css";
import { TWITTER_50 } from "./catalog.js";

function innerFor(row) {
  const label = row.label;
  const k = row.kind;
  if (k === "glitch") {
    const garbage = ["x", "$", "≈", "ç", "&", "π", "_", "#"];
    return label.split("").map((ch, n) => (
      <span
        key={n}
        className="ch"
        style={{ "--i": n, "--g": `'${garbage[(n + 1) % 8]}'`, "--c1": `'${garbage[n % 8]}'`, "--c2": `'${garbage[(n + 3) % 8]}'` }}
      >
        {ch}
      </span>
    ));
  }
  if (k === "grid-spin") {
    return (
      <>
        <span className="lab">{label}</span>
        <span className="spin" aria-hidden="true" />
      </>
    );
  }
  if (k === "invert-spot") {
    return (
      <>
        <span className="spot" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "search-pill") {
    return (
      <>
        <span className="mag" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "overlay-cta") {
    return (
      <>
        <span className="play" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "send-email") {
    return <span className="lab">{label}</span>;
  }
  if (k === "scroll-mark") {
    return (
      <>
        <span className="lab">{label}</span>
        <span className="chev" aria-hidden="true">
          →
        </span>
      </>
    );
  }
  if (k === "explore-3d") {
    return (
      <>
        <span className="plane" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "dir-roll") {
    return (
      <>
        <span className="lab">{label}</span>
        <span className="east" aria-hidden="true" />
      </>
    );
  }
  if (k === "gravity") {
    return (
      <>
        <span className="orb" aria-hidden="true" />
        <span className="orb" aria-hidden="true" />
        <span className="orb" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "download-now") {
    return (
      <>
        <span className="disk" aria-hidden="true">
          💾
        </span>
        <span className="lab">{label}</span>
      </>
    );
  }
  if (k === "giana-dir") {
    return (
      <>
        <span className="hit hit-w" />
        <span className="hit hit-e" />
        <span className="hit hit-n" />
        <span className="hit hit-s" />
        <span className="hit hit-c" />
        <span className="fill fill-w" aria-hidden="true" />
        <span className="fill fill-e" aria-hidden="true" />
        <span className="fill fill-n" aria-hidden="true" />
        <span className="fill fill-s" aria-hidden="true" />
        <span className="fill fill-c" aria-hidden="true" />
        <span className="lab">{label}</span>
      </>
    );
  }
  if (["height", "conic-p3", "five-hovers", "candy-ghost", "tw-lab", "fifty-kit", "layer-step", "cq-shimmer"].includes(k)) {
    return <span className="lab">{label}</span>;
  }
  return label;
}

function boot(el, kind, id) {
  if (!el) return () => {};
  if (kind === "conic-p3" || kind === "invert-spot") {
    let tx = 50, ty = 50, cx = 50, cy = 50, raf = 0;
    const tick = () => {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.setProperty("--mx", `${cx}%`);
      el.style.setProperty("--my", `${cy}%`);
      raf = Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    const on = (e) => {
      const r = el.getBoundingClientRect();
      if (kind === "invert-spot") {
        el.style.setProperty("--x", `${e.clientX - r.left}px`);
        el.style.setProperty("--y", `${e.clientY - r.top}px`);
      } else {
        tx = ((e.clientX - r.left) / r.width) * 100;
        ty = ((e.clientY - r.top) / r.height) * 100;
        if (!raf) raf = requestAnimationFrame(tick);
      }
    };
    el.addEventListener("pointermove", on);
    el.addEventListener("pointerleave", () => {
      tx = 50; ty = 50;
      if (!raf) raf = requestAnimationFrame(tick);
    });
    return () => {
      el.removeEventListener("pointermove", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }
  if (kind === "tw-ripple") {
    const on = (e) => {
      if (el.disabled) return;
      const r = el.getBoundingClientRect();
      const s = Math.max(r.width, r.height) * 1.1;
      const w = document.createElement("span");
      w.className = "wave";
      w.style.width = `${s}px`;
      w.style.height = `${s}px`;
      w.style.left = `${e.clientX - r.left - s / 2}px`;
      w.style.top = `${e.clientY - r.top - s / 2}px`;
      el.appendChild(w);
      window.setTimeout(() => w.remove(), 650);
    };
    el.addEventListener("click", on);
    return () => el.removeEventListener("click", on);
  }
  if (kind === "grid-spin" || kind === "disco") {
    const on = () => {
      if (el.disabled || el.getAttribute("aria-busy") === "true") return;
      el.setAttribute("aria-busy", "true");
      window.setTimeout(() => el.setAttribute("aria-busy", "false"), kind === "disco" ? 1600 : 1400);
    };
    el.addEventListener("click", on);
    return () => el.removeEventListener("click", on);
  }
  if (kind === "julius-glass") {
    const order = ["idle", "busy", "done"];
    const on = () => {
      if (el.disabled) return;
      const i = order.indexOf(el.getAttribute("data-state") || "idle");
      el.setAttribute("data-state", order[(i + 1) % order.length]);
    };
    el.addEventListener("click", on);
    return () => el.removeEventListener("click", on);
  }
  return () => {};
}

export function Twitter50Button({ row, disabled = false }) {
  const ref = useRef(null);
  useEffect(() => boot(ref.current, row.kind, row.id), [row.kind, row.id]);
  const busy = row.kind === "grid-spin" || row.kind === "disco" ? { "aria-busy": "false" } : {};
  const state = row.kind === "julius-glass" ? { "data-state": "idle" } : {};
  return (
    <button
      ref={ref}
      className={row.id}
      type="button"
      data-x50={row.id}
      aria-label={row.label}
      disabled={disabled}
      {...busy}
      {...state}
    >
      {innerFor(row)}
    </button>
  );
}

export function Twitter50Preview({ row }) {
  const ghosts = row.kind === "proximity";
  return (
    <div className={`${row.id}-root`}>
      {ghosts ? <span className={`${row.id}-ghost`} aria-hidden="true" /> : null}
      <Twitter50Button row={row} />
      {ghosts ? <span className={`${row.id}-ghost`} aria-hidden="true" /> : null}
    </div>
  );
}

export const TWITTER_50_PREVIEWS = Object.fromEntries(
  TWITTER_50.map((row) => {
    function Preview() {
      return <Twitter50Preview row={row} />;
    }
    Preview.displayName = `Twitter50Preview_${row.id}`;
    return [row.id, Preview];
  })
);
''',
        encoding="utf-8",
    )


def write_registry():
    (OUT / "registry.js").write_text(
        '''export { TWITTER_50, TWITTER_50_LAST_PRIOR } from "./catalog.js";
export { TWITTER_50_SNIPPETS, TWITTER_50_METAS } from "./snippets.js";
export { TWITTER_50_PREVIEWS, Twitter50Preview, Twitter50Button } from "./Twitter50Button.jsx";
''',
        encoding="utf-8",
    )


def write_test():
    (OUT / "twitter-50.test.js").write_text(
        r'''import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { TWITTER_50, TWITTER_50_LAST_PRIOR } from "./catalog.js";
import { TWITTER_50_SNIPPETS, TWITTER_50_METAS } from "./snippets.js";

const dir = dirname(fileURLToPath(import.meta.url));

test("catalog is 50 unique X posts split 25/25 with markers", () => {
  assert.equal(TWITTER_50.length, 50);
  const impression = TWITTER_50.filter((r) => r.bucket === "impression");
  const underrated = TWITTER_50.filter((r) => r.bucket === "underrated");
  assert.equal(impression.length, 25);
  assert.equal(underrated.length, 25);
  const urls = TWITTER_50.map((r) => r.url);
  assert.equal(new Set(urls).size, 50);
  const markers = TWITTER_50.map((r) => r.marker);
  assert.equal(new Set(markers).size, 50);
  const ids = TWITTER_50.map((r) => r.id);
  assert.equal(new Set(ids).size, 50);
  for (const row of TWITTER_50) {
    assert.match(row.url, /^https:\/\/(x|twitter)\.com\//);
    assert.ok(row.author);
    assert.ok(row.style_note);
    assert.ok(row.marker.startsWith("--x50-"));
    assert.ok(Number.isFinite(row.likes));
    assert.ok(Number.isFinite(row.reposts));
    assert.ok(row.metric === "views" || row.metric === "likes_reposts");
    if (row.metric === "views") {
      assert.ok(Number.isFinite(row.views) && row.views > 0);
      assert.equal(row.score, row.views);
    } else {
      assert.equal(row.views, null);
      assert.equal(row.score, row.likes + row.reposts);
    }
    assert.equal(TWITTER_50.filter((r) => r.index === row.index).length, 1);
  }
  assert.equal(TWITTER_50[0].index, 87);
  assert.equal(TWITTER_50[49].index, 136);
  assert.equal(TWITTER_50_LAST_PRIOR, "dust-premium");
});

test("each tray ships three stacks with <button> and its catalog marker", () => {
  for (const row of TWITTER_50) {
    const snippets = TWITTER_50_SNIPPETS[row.id];
    assert.ok(snippets, row.id);
    assert.ok(snippets.html && snippets.react && snippets.node, row.id);
    for (const [stack, text] of Object.entries(snippets)) {
      assert.match(text, /<button/, `${row.id} ${stack} missing <button`);
      assert.ok(text.includes(row.marker), `${row.id} ${stack} missing ${row.marker}`);
      assert.ok(text.includes(row.label) || text.includes(JSON.stringify(row.label).slice(1, -1)), `${row.id} ${stack} missing label`);
    }
    assert.match(snippets.node, /node:http/);
    assert.doesNotMatch(snippets.node, /express/i);
    assert.equal(TWITTER_50_METAS[row.id].id, row.id);
    assert.ok(TWITTER_50_METAS[row.id].keywords.length >= 8, row.id);
  }
  const markerHits = TWITTER_50.map((r) => r.marker);
  assert.equal(new Set(markerHits).size, 50);
});

const GALLERY_X50_REMOVED = new Set([
  "x50-voltage",
  "x50-loved-cta",
  "x50-cq-shimmer",
  "x50-glitch-flip",
  "x50-explore-3d",
  "x50-layer-step",
  "x50-dir-roll",
  "x50-gravity",
  "x50-syntax-glass",
  "x50-glass-mix",
  "x50-proximity",
  "x50-metallic",
  "x50-julius-glass",
  "x50-button-sets",
  "x50-hover-active",
  "x50-micro-scale",
]);

test("slots.js keeps the remaining x50 trays after dust-premium and drops the culled set", async () => {
  const slots = await readFile(join(dir, "..", "..", "slots.js"), "utf8");
  const dust = slots.lastIndexOf('id: "dust-premium"');
  assert.ok(dust > 0);
  let kept = 0;
  for (const row of TWITTER_50) {
    const hits = slots.match(new RegExp(`id: "${row.id}"`, "g")) ?? [];
    if (GALLERY_X50_REMOVED.has(row.id)) {
      assert.equal(hits.length, 0, `${row.id} must stay off the gallery`);
      continue;
    }
    const at = slots.indexOf(`id: "${row.id}"`);
    assert.ok(at > dust, `${row.id} must append after dust-premium`);
    assert.equal(hits.length, 1);
    assert.match(slots, new RegExp(`preview: TWITTER_50_PREVIEWS\\["${row.id}"\\]`));
    assert.match(slots, new RegExp(`snippets: TWITTER_50_SNIPPETS\\["${row.id}"\\]`));
    kept += 1;
  }
  assert.equal(kept, 34);
  const filled = [...slots.matchAll(/preview:\s+/g)].length;
  // 86 prior trays + 34 remaining x50 trays + 6 remaining awwwards trays + Search Slash + Water Ripple + Jelly Switch.
  assert.equal(filled, 129, `expected 129 previews, got ${filled}`);
  const lastX50 = slots.lastIndexOf('id: "x50-fifteen"');
  const idsAfter = [...slots.slice(lastX50 + 1).matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
  assert.ok(idsAfter.every((id) => !id.startsWith("x50-")), "remaining x50 trays must stay contiguous after dust-premium");
});

test("five-hovers hover fill uses a dark base so white does not bleed at the corners", async () => {
  const css = await readFile(join(dir, "twitter-50.css"), "utf8");
  assert.match(css, /\.x50-five-hovers \{[^}]*background: #111827/);
  assert.match(css, /\.x50-five-hovers::before \{[^}]*background: #ffffff/);
  assert.match(css, /\.x50-five-hovers::before \{[^}]*inset: -2px/);
  assert.match(css, /mix-blend-mode: difference/);
  assert.match(css, /translate3d\(0, -105%, 0\)/);
  assert.doesNotMatch(css, /translateY\(101%\)/);
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-five-hovers"])) {
    assert.match(text, /mix-blend-mode: difference/);
    assert.match(text, /background: #111827/);
    assert.match(text, /inset: -2px/);
    assert.doesNotMatch(text, /translateY\(101%\)/);
  }
});

test("extracted specimens match their source posts, not caption inventions", () => {
  const loved = TWITTER_50.find((r) => r.id === "x50-loved-cta");
  assert.equal(loved.url, "https://x.com/avstorm/status/1724521641953071141");
  assert.equal(loved.kind, "loved-blend");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-loved-cta"])) {
    assert.match(text, /mix-blend-mode:\s*difference/);
    assert.doesNotMatch(text, /heart/);
    assert.doesNotMatch(text, /#ff5a1f/);
  }

  const spot = TWITTER_50.find((r) => r.id === "x50-blend-diff");
  assert.equal(spot.url, "https://x.com/jh3yy/status/1729546779274707150");
  assert.equal(spot.kind, "invert-spot");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-blend-diff"])) {
    assert.match(text, /\.spot/);
    assert.match(text, /--x50-invert-spot/);
    assert.match(text, /mix-blend-mode:\s*difference/);
  }
  assert.notEqual(loved.url, spot.url);

  const send = TWITTER_50.find((r) => r.id === "x50-altitude");
  assert.equal(send.url, "https://x.com/jamesm/status/1932958811868049720");
  assert.equal(send.label, "Send email");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-altitude"])) {
    assert.match(text, /Send email/);
    assert.match(text, /linear-gradient\(#f7f7f8/);
    assert.doesNotMatch(text, /35,000ft/);
    assert.doesNotMatch(text, /vapour|trail/);
  }

  const soft = TWITTER_50.find((r) => r.id === "x50-ana-soft");
  assert.equal(soft.url, "https://x.com/anatudor/status/1634909243370360834");
  assert.equal(soft.kind, "ios-yellow");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-ana-soft"])) {
    assert.match(text, /border-radius:\s*22px/);
    assert.match(text, /#ffe34d/);
    assert.doesNotMatch(text, /#f3d9e8/);
    assert.doesNotMatch(text, /neumorph/i);
  }

  const down = TWITTER_50.find((r) => r.id === "x50-button-sets");
  assert.equal(down.url, "https://x.com/anatudor/status/1902270703593775342");
  assert.equal(down.label, "DOWNLOAD NOW");
  for (const text of Object.values(TWITTER_50_SNIPPETS["x50-button-sets"])) {
    assert.match(text, /DOWNLOAD NOW/);
    assert.match(text, /--x50-download-now/);
    assert.doesNotMatch(text, /class="dot"/);
  }
});

test("search pill rest state keeps the magnifier centered in the circle", async () => {
  const css = await readFile(join(dir, "twitter-50.css"), "utf8");
  assert.match(css, /overflow:\s*hidden;\s*gap:\s*0/);
  assert.match(css, /\.x50-search-pill \.lab \{[^}]*position:\s*absolute/);
  assert.match(css, /\.x50-search-pill \.mag::before/);
  assert.match(css, /\.x50-search-pill-root \{[^}]*justify-content:\s*center/);
  for (const [stack, text] of Object.entries(TWITTER_50_SNIPPETS["x50-search-pill"])) {
    assert.match(text, /gap:\s*0/, `${stack} missing rest-state gap: 0`);
    assert.match(text, /position:\s*absolute/, `${stack} rest label must leave flex flow`);
    assert.match(text, /mag::before/, `${stack} missing centered magnifier`);
  }
});

test("modern sheet eases its tracking into and out of hover", async () => {
  const css = await readFile(join(dir, "twitter-50.css"), "utf8");
  const transition = /transition:\s*letter-spacing 420ms cubic-bezier\(0\.22, 1, 0\.36, 1\)/;
  assert.match(css, transition);
  for (const [stack, text] of Object.entries(TWITTER_50_SNIPPETS["x50-modern-sheet"])) {
    assert.match(text, transition, `${stack} missing smooth tracking transition`);
  }
});

test("blend difference turns only the text beneath the white cursor circle black", async () => {
  const css = await readFile(join(dir, "twitter-50.css"), "utf8");
  const spot = css.match(/\.x50-blend-diff \.spot\s*\{[^}]*\}/)?.[0] ?? "";
  const label = css.match(/\.x50-blend-diff \.lab\s*\{[^}]*\}/)?.[0] ?? "";
  assert.doesNotMatch(spot, /mix-blend-mode/);
  assert.match(label, /z-index:\s*2/);
  assert.match(label, /mix-blend-mode:\s*difference/);
  for (const [stack, text] of Object.entries(TWITTER_50_SNIPPETS["x50-blend-diff"])) {
    assert.match(text, /\.x50-blend-diff \.lab\s*\{[^}]*mix-blend-mode:\s*difference/, `${stack} label must invert inside the cursor circle`);
  }
});
''',
        encoding="utf-8",
    )


def patch_slots():
    path = ROOT / "src" / "slots.js"
    text = path.read_text(encoding="utf-8")
    import_line = (
        'import { TWITTER_50_PREVIEWS, TWITTER_50_SNIPPETS, TWITTER_50_METAS } '
        'from "./buttons/twitter-50/registry.js";\n'
    )
    if "twitter-50/registry.js" not in text:
        needle = 'from "./buttons/dust-premium-button.snippets.js";'
        assert needle in text
        text = text.replace(needle, needle + "\n" + import_line, 1)
    items = []
    for row in ROWS:
        items.append(
            f'''      {{
        id: "{row["id"]}",
        name: TWITTER_50_METAS["{row["id"]}"].name,
        blurb: TWITTER_50_METAS["{row["id"]}"].blurb,
        states: TWITTER_50_METAS["{row["id"]}"].states,
        keywords: TWITTER_50_METAS["{row["id"]}"].keywords,
        preview: TWITTER_50_PREVIEWS["{row["id"]}"],
        snippets: TWITTER_50_SNIPPETS["{row["id"]}"],
      }},'''
        )
    block = "\n".join(items)
    marker = '        snippets: DUST_PREMIUM_SNIPPETS,\n      },\n    ],'
    if 'id: "x50-voltage"' not in text:
        text = text.replace(
            marker,
            '        snippets: DUST_PREMIUM_SNIPPETS,\n      },\n' + block + "\n    ],",
            1,
        )
    path.write_text(text, encoding="utf-8")


def write_plan_md():
    lines = [
        "# Twitter/X 50-button harvest (trays 87–136)",
        "",
        "Source catalog: `plans/twitter-50-catalog.json`.",
        "Skill: `.grok/skills/x-button-to-gallery/SKILL.md`.",
        "",
        "## Split",
        "",
        "| # | id | bucket | author | score | marker |",
        "|---|----|--------|--------|-------|--------|",
    ]
    for row in ROWS:
        lines.append(
            f"| {row['index']} | `{row['id']}` | {row['bucket']} | @{row['author']} | {row['score']} ({row['metric']}) | `{row['marker']}` |"
        )
    (ROOT / "plans" / "2026-09-01-twitter-50-buttons.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    kinds = {r["kind"] for r in ROWS}
    assert len(ROWS) == 50, len(ROWS)
    assert len(kinds) == 50, f"kinds {len(kinds)} {sorted(kinds)}"
    slim = write_catalog_js()
    write_css()
    write_snippets(slim)
    write_jsx()
    write_registry()
    write_test()
    patch_slots()
    write_plan_md()
    print(f"wrote {len(ROWS)} trays, {len(kinds)} kinds")


if __name__ == "__main__":
    main()
