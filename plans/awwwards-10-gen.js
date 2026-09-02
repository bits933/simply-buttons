/* Generates the 10 awwwards snippets files from each button's CSS plus a
   per-button spec (markup, react source, meta). Run: node plans/awwwards-10-gen.js */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const dir = (p) => join(ROOT, "src", "buttons", p);

const css = (slug) => readFileSync(dir(`${slug}-button.css`), "utf8");

/* ---------- per-button specs ---------- */

const SPECS = [
  {
    slug: "unseen-enter",
    exportPrefix: "UNSEEN_ENTER",
    meta: {
      id: "aw-unseen-enter",
      name: "Unseen enter",
      blurb: "unseen.co's SOTD hero CTA rebuilt: a white pill where a dark fill sweeps up from the bottom edge while the label rolls out and a cloned label rolls in, and the arrow icon slides across.",
      states: "default, hover (fill rise + label roll + arrow slide), focus-visible, active press, reduced motion",
    },
    keywords: ["unseen enter", "unseen studio", "rise sweep", "fill rise", "enter button", "pill button", "white pill", "label roll", "rolling text", "clone label", "arrow slide", "icon slide", "awwwards", "site of the day", "hover fill", "bottom up fill", "animated button", "interactive button", "css button", "hover effect"],
    htmlBody: `<div class="unseen-enter-root">
  <button type="button" class="btn-unseen-enter" data-unseen-enter="" aria-label="Enter">
    <span class="ue-fill" aria-hidden="true"></span>
    <span class="ue-text">
      <span class="ue-clip">
        <span class="ue-label">Enter</span>
        <span class="ue-label ue-label--clone" aria-hidden="true">Enter</span>
      </span>
    </span>
    <svg class="ue-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>
  </button>
</div>`,
    react: `"use client";

// Unseen enter button — unseen.co's SOTD hero CTA rebuilt with pure CSS:
// hover sweeps a dark fill up while the label rolls out/in and the arrow slides.

import { useEffect } from "react";

const CSS = ___CSS___;

export default function UnseenEnterButton() {
  useEffect(() => {
    if (document.getElementById("unseen-enter-styles")) return;
    const tag = document.createElement("style");
    tag.id = "unseen-enter-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);
  return (
    <button type="button" data-unseen-enter="" aria-label="Enter" className="btn-unseen-enter">
      <span className="ue-fill" aria-hidden="true" />
      <span className="ue-text">
        <span className="ue-clip">
          <span className="ue-label">Enter</span>
          <span className="ue-label ue-label--clone" aria-hidden="true">Enter</span>
        </span>
      </span>
      <svg className="ue-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
`,
  },
  {
    slug: "loco-shuffle",
    exportPrefix: "LOCO_SHUFFLE",
    meta: {
      id: "aw-loco-shuffle",
      name: "Hover shuffle",
      blurb: "locomotive.ca's SOTD \u201Clet's talk\u201D CTA rebuilt: hovering runs four rounds of whole-word Fisher\u2013Yates character shuffle over 250ms, then the label restores from its aria-label. Leaving mid-scramble kills the loop.",
      states: "default, hover (character shuffle race), focus, blur restore, active press, reduced motion",
    },
    keywords: ["hover shuffle", "locomotive", "loco shuffle", "letter shuffle", "character shuffle", "fisher yates", "scramble text", "text scramble", "lets talk", "let's talk", "text cta", "borderless button", "typographic button", "awwwards", "site of the month", "microinteraction", "animated button", "interactive button", "css button", "hover effect"],
    htmlBody: `<div class="loco-shuffle-root">
  <button type="button" class="btn-loco-shuffle" data-loco-shuffle="" aria-label="Let's talk">Let's talk</button>
</div>`,
    htmlScript: `(function () {
  var ROUNDS = 4;
  var TICK_MS = 250 / 8;
  function fisherYates(chars) {
    var out = chars.slice(0);
    for (var i = out.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }
  document.querySelectorAll("[data-loco-shuffle]").forEach(function (btn) {
    var label = btn.getAttribute("aria-label");
    var timer = 0;
    function scramble() {
      window.clearInterval(timer);
      var chars = label.split("");
      var frame = 0;
      timer = window.setInterval(function () {
        frame += 1;
        if (frame >= ROUNDS * 2) {
          window.clearInterval(timer);
          btn.textContent = label;
          return;
        }
        btn.textContent = fisherYates(chars).join("");
      }, TICK_MS);
    }
    function restore() {
      window.clearInterval(timer);
      btn.textContent = label;
    }
    btn.addEventListener("mouseenter", scramble);
    btn.addEventListener("focus", scramble);
    btn.addEventListener("mouseleave", restore);
    btn.addEventListener("blur", restore);
  });
})();`,
    react: `"use client";

// Loco shuffle button — locomotive.ca's SOTD CTA rebuilt: hover runs four
// rounds of Fisher-Yates character shuffle over 250ms, restore on leave.

import { useEffect, useRef, useState } from "react";

const CSS = ___CSS___;

const ROUNDS = 4;
const TICK_MS = 250 / 8;

function fisherYates(chars) {
  const out = [...chars];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function LocoShuffleButton() {
  const [shown, setShown] = useState("Let's talk");
  const timerRef = useRef(0);

  useEffect(() => {
    if (document.getElementById("loco-shuffle-styles")) return;
    const tag = document.createElement("style");
    tag.id = "loco-shuffle-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => () => window.clearInterval(timerRef.current), []);

  function scramble() {
    window.clearInterval(timerRef.current);
    const chars = "Let's talk".split("");
    let frame = 0;
    timerRef.current = window.setInterval(() => {
      frame += 1;
      if (frame >= ROUNDS * 2) {
        window.clearInterval(timerRef.current);
        setShown("Let's talk");
        return;
      }
      setShown(fisherYates(chars).join(""));
    }, TICK_MS);
  }

  function restore() {
    window.clearInterval(timerRef.current);
    setShown("Let's talk");
  }

  return (
    <button
      type="button"
      data-loco-shuffle=""
      aria-label="Let's talk"
      className="btn-loco-shuffle"
      onMouseEnter={scramble}
      onFocus={scramble}
      onMouseLeave={restore}
      onBlur={restore}
    >
      {shown}
    </button>
  );
}
`,
  },
  {
    slug: "exo-circle",
    exportPrefix: "EXO_CIRCLE",
    meta: {
      id: "aw-exo-circle",
      name: "Studio circle",
      blurb: "exoape.com's \u201Cthe studio\u201D CTA rebuilt (SOTD May 2022): a light text label beside a circle glyph whose dark fill scales up from zero on hover while an arrow fades in over it and the label underline draws.",
      states: "default, hover (circle fill + arrow + underline draw), focus-visible, active press, reduced motion",
    },
    keywords: ["studio circle", "exo ape", "exoape", "circle fill", "circle glyph", "circle button", "arrow icon", "underline draw", "scale draw", "line reveal", "the studio", "minimal cta", "typographic cta", "awwwards", "site of the day", "developer award", "animated button", "interactive button", "css button", "hover effect"],
    htmlBody: `<div class="exo-circle-root">
  <button type="button" class="btn-exo-circle" data-exo-circle="" aria-label="The Studio">
    <span class="ec-label">
      <span class="ec-label-text">The Studio</span>
      <span class="ec-underline" aria-hidden="true"></span>
    </span>
    <span class="ec-circle" aria-hidden="true">
      <svg class="ec-ring" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="22" r="21" stroke="currentColor" stroke-width="1"></circle>
      </svg>
      <span class="ec-fill"></span>
      <svg class="ec-icon" viewBox="0 0 24 24" fill="none">
        <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    </span>
  </button>
</div>`,
    react: `"use client";

// Exo circle button — exoape.com's "The Studio" CTA rebuilt: circle fill
// scales up on hover while an arrow fades in and the underline draws.

import { useEffect } from "react";

const CSS = ___CSS___;

export default function ExoCircleButton() {
  useEffect(() => {
    if (document.getElementById("exo-circle-styles")) return;
    const tag = document.createElement("style");
    tag.id = "exo-circle-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);
  return (
    <button type="button" data-exo-circle="" aria-label="The Studio" className="btn-exo-circle">
      <span className="ec-label">
        <span className="ec-label-text">The Studio</span>
        <span className="ec-underline" aria-hidden="true" />
      </span>
      <span className="ec-circle" aria-hidden="true">
        <svg className="ec-ring" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="21" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="ec-fill" />
        <svg className="ec-icon" viewBox="0 0 24 24" fill="none">
          <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
`,
  },
  {
    slug: "k95-chars",
    exportPrefix: "K95_CHARS",
    meta: {
      id: "aw-k95-chars",
      name: "Frosted roll",
      blurb: "k95.it's frosted nav pill rebuilt (SOTD Aug 2026): a backdrop-blur glass pill whose label is per-character 1em masked columns; clicking rolls every character up by 1em, swapping MENU for \u00D7CLOSE with a per-letter stagger.",
      states: "default, hover (border brighten), click toggle (char roll menu/close), focus-visible, active press, reduced motion",
    },
    keywords: ["frosted roll", "k95", "studio k95", "glass pill", "frosted glass", "backdrop blur", "char roll", "per character", "letter roll", "masked text", "menu close", "menu button", "toggle pill", "stagger letters", "awwwards", "site of the day", "animated button", "interactive button", "css button", "hover effect"],
    htmlBody: `<div class="k95-chars-root">
  <button type="button" class="btn-k95-chars" data-k95-chars="" data-phase="closed" aria-expanded="false" aria-label="Open menu">
    <span class="kc-chars" aria-hidden="true">
      <span class="kc-char" style="--i:0"><span class="kc-stack"><span class="kc-copy">M</span><span class="kc-copy kc-copy--alt">&times;</span></span></span>
      <span class="kc-char" style="--i:1"><span class="kc-stack"><span class="kc-copy">e</span><span class="kc-copy kc-copy--alt">C</span></span></span>
      <span class="kc-char" style="--i:2"><span class="kc-stack"><span class="kc-copy">n</span><span class="kc-copy kc-copy--alt">l</span></span></span>
      <span class="kc-char" style="--i:3"><span class="kc-stack"><span class="kc-copy">u</span><span class="kc-copy kc-copy--alt">o</span></span></span>
      <span class="kc-char" style="--i:4"><span class="kc-stack"><span class="kc-copy">&nbsp;</span><span class="kc-copy kc-copy--alt">s</span></span></span>
      <span class="kc-char" style="--i:5"><span class="kc-stack"><span class="kc-copy">&nbsp;</span><span class="kc-copy kc-copy--alt">e</span></span></span>
    </span>
  </button>
</div>`,
    htmlScript: `(function () {
  document.querySelectorAll("[data-k95-chars]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("data-phase") === "open";
      btn.setAttribute("data-phase", open ? "closed" : "open");
      btn.setAttribute("aria-expanded", String(!open));
      btn.setAttribute("aria-label", open ? "Open menu" : "Close menu");
    });
  });
})();`,
    react: `"use client";

// K95 chars button — k95.it's frosted nav pill rebuilt: per-character
// masked columns roll 1em up on click, swapping MENU for xCLOSE.

import { useEffect, useState } from "react";

const CSS = ___CSS___;

export default function K95CharsButton() {
  const [phase, setPhase] = useState("closed");

  useEffect(() => {
    if (document.getElementById("k95-chars-styles")) return;
    const tag = document.createElement("style");
    tag.id = "k95-chars-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  const label = "Menu";
  const altLabel = "\\u00D7Close";
  const columns = (altLabel.length >= label.length ? altLabel : label).split("");

  return (
    <button
      type="button"
      data-k95-chars=""
      data-phase={phase}
      aria-expanded={phase === "open"}
      aria-label={phase === "open" ? "Close menu" : "Open menu"}
      className="btn-k95-chars"
      onClick={() => setPhase((p) => (p === "open" ? "closed" : "open"))}
    >
      <span className="kc-chars" aria-hidden="true">
        {columns.map((ch, i) => (
          <span className="kc-char" key={i} style={{ "--i": i }}>
            <span className="kc-stack">
              <span className="kc-copy">{label[i] === undefined || label[i] === " " ? "\\u00A0" : label[i]}</span>
              <span className="kc-copy kc-copy--alt">{ch === " " ? "\\u00A0" : ch}</span>
            </span>
          </span>
        ))}
      </span>
    </button>
  );
}
`,
  },
  {
    slug: "zajno-underline",
    exportPrefix: "ZAJNO_UNDERLINE",
    meta: {
      id: "aw-zajno-underline",
      name: "Line wipe",
      blurb: "zajno.com's work links rebuilt (SOTD Jul 2023): a lowercase text button whose underline is two halves \u2014 on hover the resting half slides out while a red half slides in from the far side, one continuous line wipe across the word.",
      states: "default, hover (two-half line wipe + red ink flip), focus-visible, active press, reduced motion",
    },
    keywords: ["line wipe", "zajno", "underline wipe", "underline button", "two halves", "pseudo elements", "line slide", "text button", "lowercase", "link button", "red accent", "work link", "awwwards", "site of the day", "minimal button", "typographic", "animated button", "interactive button", "css button", "hover effect"],
    htmlBody: `<div class="zajno-underline-root">
  <button type="button" class="btn-zajno-underline" data-zajno-underline="" aria-label="work">work</button>
</div>`,
    react: `"use client";

// Zajno underline button — zajno.com's work links rebuilt: the underline
// is two halves; hover slides one out and the other in, a continuous wipe.

import { useEffect } from "react";

const CSS = ___CSS___;

export default function ZajnoUnderlineButton() {
  useEffect(() => {
    if (document.getElementById("zajno-underline-styles")) return;
    const tag = document.createElement("style");
    tag.id = "zajno-underline-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);
  return (
    <button type="button" data-zajno-underline="" aria-label="work" className="btn-zajno-underline">
      work
    </button>
  );
}
`,
  },
  {
    slug: "obys-underline",
    exportPrefix: "OBYS_UNDERLINE",
    meta: {
      id: "aw-obys-underline",
      name: "Mode underline",
      blurb: "obys.agency's work-mode toggles rebuilt (SOTD May 2026): typographic text buttons whose 1.34px underline draws in from the left when a mode activates and collapses to the right when it leaves, 0.8s with the studio's exact easing.",
      states: "default, hover, active mode (underline draw origin-left), inactive (collapse origin-right), focus-visible, reduced motion",
    },
    keywords: ["mode underline", "obys", "obys agency", "underline draw", "origin swap", "scalex underline", "text toggle", "mode toggle", "segmented text", "typographic toggle", "vertical horizontal grid", "work mode", "awwwards", "site of the day", "minimal", "animated button", "interactive button", "css button", "hover effect", "toggle button"],
    htmlBody: `<div class="obys-stage">
  <div class="obys-underline-root" data-obys-underline="">
    <button type="button" class="btn-obys-underline is-on" data-mode="vertical" aria-pressed="true">Vertical</button>
    <button type="button" class="btn-obys-underline" data-mode="horizontal" aria-pressed="false">Horizontal</button>
    <button type="button" class="btn-obys-underline" data-mode="grid" aria-pressed="false">Grid</button>
    <button type="button" class="obys-cycle" data-obys-cycle="" aria-label="Cycle modes"><span class="obys-cycle-mark" aria-hidden="true">&#8635;</span></button>
  </div>
</div>`,
    htmlScript: `(function () {
  document.querySelectorAll("[data-obys-underline]").forEach(function (group) {
    var modes = Array.prototype.slice.call(group.querySelectorAll(".btn-obys-underline"));
    function activate(i) {
      modes.forEach(function (btn, k) {
        var on = k === i;
        btn.classList.toggle("is-on", on);
        btn.setAttribute("aria-pressed", String(on));
      });
    }
    modes.forEach(function (btn, i) {
      btn.addEventListener("click", function () { activate(i); });
    });
    var cycle = group.querySelector("[data-obys-cycle]");
    if (cycle) {
      cycle.addEventListener("click", function () {
        var current = modes.findIndex(function (btn) { return btn.classList.contains("is-on"); });
        activate((current + 1) % modes.length);
      });
    }
  });
})();`,
    react: `"use client";

// Obys underline button — obys.agency's work-mode toggles rebuilt: the
// 1.34px underline draws origin-left on activate, collapses origin-right off.

import { useEffect, useState } from "react";

const CSS = ___CSS___;

const MODES = ["Vertical", "Horizontal", "Grid"];

export default function ObysUnderlineButton() {
  const [mode, setMode] = useState(0);

  useEffect(() => {
    if (document.getElementById("obys-underline-styles")) return;
    const tag = document.createElement("style");
    tag.id = "obys-underline-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <div className="obys-underline-root" role="group" aria-label="Mode" data-obys-underline="">
      {MODES.map((m, i) => (
        <button
          key={m}
          type="button"
          className={i === mode ? "btn-obys-underline is-on" : "btn-obys-underline"}
          aria-pressed={i === mode}
          onClick={() => setMode(i)}
        >
          {m}
        </button>
      ))}
      <button
        type="button"
        className="obys-cycle"
        aria-label="Cycle modes"
        onClick={() => setMode((m) => (m + 1) % MODES.length)}
      >
        <span className="obys-cycle-mark" aria-hidden="true">{"\\u21BB"}</span>
      </button>
    </div>
  );
}
`,
  },
  {
    slug: "lusion-arrow",
    exportPrefix: "LUSION_ARROW",
    meta: {
      id: "aw-lusion-arrow",
      name: "Dots to arrow",
      blurb: "lusion.co's \u201Clet's talk\u201D pill rebuilt (SOTD May 2019): on hover the label slides +1.5em, a three-dot cluster collapses to zero, and an arrow flies in from \u22122.5em \u2014 exact transform math from the site's stylesheet.",
      states: "default, hover (label slide + dots collapse + arrow fly-in), focus-visible, active press, reduced motion",
    },
    keywords: ["dots to arrow", "lusion", "arrow swap", "glide arrow", "pill button", "rounded pill", "dot cluster", "three dots", "arrow fly in", "label slide", "translate pill", "lets talk", "let's talk", "awwwards", "site of the day", "developer award", "animated button", "interactive button", "css button", "hover effect"],
    htmlBody: `<div class="lusion-arrow-root">
  <button type="button" class="btn-lusion-arrow" data-lusion-arrow="" aria-label="LET'S TALK">
    <span class="la-window">
      <span class="la-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </span>
      <span class="la-dots" aria-hidden="true"><span></span><span></span><span></span></span>
    </span>
    <span class="la-label">LET'S TALK</span>
  </button>
</div>`,
    react: `"use client";

// Lusion arrow button — lusion.co's "Let's talk" pill rebuilt: label slides
// +1.5em while dots collapse and an arrow flies in from -2.5em.

import { useEffect } from "react";

const CSS = ___CSS___;

export default function LusionArrowButton() {
  useEffect(() => {
    if (document.getElementById("lusion-arrow-styles")) return;
    const tag = document.createElement("style");
    tag.id = "lusion-arrow-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);
  return (
    <button type="button" data-lusion-arrow="" aria-label="LET'S TALK" className="btn-lusion-arrow">
      <span className="la-window">
        <span className="la-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="la-dots" aria-hidden="true">
          <span /><span /><span />
        </span>
      </span>
      <span className="la-label">LET'S TALK</span>
    </button>
  );
}
`,
  },
  {
    slug: "resn-roll-slab",
    exportPrefix: "RESN_ROLL_SLAB",
    meta: {
      id: "aw-resn-slab",
      name: "Rolling slab",
      blurb: "breakthroughenergy.org's KeyAreas CTA rebuilt (SOTD Jan 2026, by Resn): a lime slab whose label lines are stacked and clipped to 1.2em, rolling upward through the site's campaign lines on an auto-cycle; hover pauses the roll.",
      states: "default, auto-cycle (label column roll), hover pause, focus-visible, active press, reduced motion (static first line)",
    },
    keywords: ["rolling slab", "resn", "breakthrough energy", "roll slab", "label roll", "auto cycle", "stacked labels", "clipped lines", "slab button", "lime button", "campaign cta", "keyareas", "giant button", "big cta", "awwwards", "site of the day", "animated button", "interactive button", "css button", "hover effect"],
    htmlBody: `<div class="resn-roll-slab-root">
  <button type="button" class="btn-resn-roll-slab" data-resn-roll-slab="">
    <span class="rs-window">
      <span class="rs-column">
        <span class="rs-line">29 manufacturing companies</span>
        <span class="rs-line">26 electricity companies</span>
        <span class="rs-line">24 transportation companies</span>
        <span class="rs-line" aria-hidden="true">29 manufacturing companies</span>
      </span>
    </span>
    <span class="rs-cta" aria-hidden="true">View</span>
  </button>
</div>`,
    react: `"use client";

// Resn roll slab — breakthroughenergy.org's KeyAreas CTA rebuilt: stacked
// clipped label lines roll upward on an auto-cycle; hover pauses.

import { useEffect } from "react";

const CSS = ___CSS___;

const LINES = [
  "29 manufacturing companies",
  "26 electricity companies",
  "24 transportation companies",
];

export default function ResnRollSlabButton() {
  useEffect(() => {
    if (document.getElementById("resn-roll-slab-styles")) return;
    const tag = document.createElement("style");
    tag.id = "resn-roll-slab-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);
  return (
    <button type="button" data-resn-roll-slab="" className="btn-resn-roll-slab">
      <span className="rs-window">
        <span className="rs-column">
          {LINES.map((line) => (
            <span className="rs-line" key={line}>{line}</span>
          ))}
          <span className="rs-line" aria-hidden="true">{LINES[0]}</span>
        </span>
      </span>
      <span className="rs-cta" aria-hidden="true">View</span>
    </button>
  );
}
`,
  },
  {
    slug: "basement-segment",
    exportPrefix: "BASEMENT_SEGMENT",
    meta: {
      id: "aw-basement-segment",
      name: "Segment flip",
      blurb: "basement.studio's HUMAN/MACHINE pill rebuilt (SOTD Apr 2025): an uppercase segmented pill where a white indicator glides behind the active option in 0.42s while the active ink flips orange for MACHINE.",
      states: "default, hover, active option (indicator glide + ink flip), focus-visible, reduced motion",
    },
    keywords: ["segment flip", "basement studio", "segmented pill", "segmented control", "pill switch", "human machine", "indicator glide", "sliding indicator", "two state pill", "mode pill", "uppercase pill", "dark pill", "orange accent", "awwwards", "site of the day", "developer award", "animated button", "interactive button", "css button", "hover effect"],
    htmlBody: `<div class="basement-segment-root">
  <div class="btn-basement-segment" role="group" aria-label="Mode" data-basement-segment="" data-active="0">
    <button type="button" class="bs-option is-active" aria-pressed="true">Human</button>
    <button type="button" class="bs-option" aria-pressed="false">Machine</button>
    <span class="bs-indicator" style="--count:2; --active:0" aria-hidden="true"></span>
  </div>
</div>`,
    htmlScript: `(function () {
  document.querySelectorAll("[data-basement-segment]").forEach(function (group) {
    var options = Array.prototype.slice.call(group.querySelectorAll(".bs-option"));
    var indicator = group.querySelector(".bs-indicator");
    function select(i) {
      options.forEach(function (btn, k) {
        var on = k === i;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", String(on));
      });
      group.setAttribute("data-active", String(i));
      if (indicator) indicator.style.setProperty("--active", String(i));
    }
    options.forEach(function (btn, i) {
      btn.addEventListener("click", function () { select(i); });
    });
  });
})();`,
    react: `"use client";

// Basement segment button — basement.studio's HUMAN/MACHINE pill rebuilt:
// the indicator glides behind the active option while its ink flips.

import { useEffect, useState } from "react";

const CSS = ___CSS___;

const OPTIONS = ["Human", "Machine"];

export default function BasementSegmentButton() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (document.getElementById("basement-segment-styles")) return;
    const tag = document.createElement("style");
    tag.id = "basement-segment-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <div
      className="btn-basement-segment"
      role="group"
      aria-label="Mode"
      data-basement-segment=""
      data-active={active}
    >
      {OPTIONS.map((option, i) => (
        <button
          key={option}
          type="button"
          className={i === active ? "bs-option is-active" : "bs-option"}
          aria-pressed={i === active}
          onClick={() => setActive(i)}
        >
          {option}
        </button>
      ))}
      <span
        className="bs-indicator"
        style={{ "--count": OPTIONS.length, "--active": active }}
        aria-hidden="true"
      />
    </div>
  );
}
`,
  },
  {
    slug: "lenis-swap",
    exportPrefix: "LENIS_SWAP",
    meta: {
      id: "aw-lenis-swap",
      name: "Scale swap slab",
      blurb: "the Lenis site-of-the-day CTA rebuilt from its archived production CSS (Studio Freight, Feb 2023): an uppercase slab where the label collapses scaleY toward the top while a hidden label grows in, a pink fill wash rises, and the bordered icon square keeps its frame.",
      states: "default, hover (scaleY label swap + fill wash), focus-visible, active press, reduced motion",
    },
    keywords: ["scale swap slab", "lenis", "studio freight", "scaley swap", "label swap", "scaley label", "fill wash", "pink wash", "slab button", "uppercase button", "icon square", "bordered icon", "ease out expo", "archived css", "awwwards", "site of the day", "developer award", "animated button", "interactive button", "css button", "hover effect"],
    htmlBody: `<div class="lenis-swap-root">
  <button type="button" class="btn-lenis-swap" data-lenis-swap="" aria-label="Get started">
    <span class="ls-base" aria-hidden="true"></span>
    <span class="ls-wash" aria-hidden="true"></span>
    <span class="ls-text">
      <span class="ls-visible">Get started</span>
      <span class="ls-hidden" aria-hidden="true">Scroll on</span>
    </span>
    <span class="ls-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 4v14M6 12l6 6 6-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    </span>
  </button>
</div>`,
    react: `"use client";

// Lenis swap button — the Lenis SOTD-era CTA rebuilt from archived CSS:
// scaleY label swap + rising pink wash + framed icon square.

import { useEffect } from "react";

const CSS = ___CSS___;

export default function LenisSwapButton() {
  useEffect(() => {
    if (document.getElementById("lenis-swap-styles")) return;
    const tag = document.createElement("style");
    tag.id = "lenis-swap-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);
  return (
    <button type="button" data-lenis-swap="" aria-label="Get started" className="btn-lenis-swap">
      <span className="ls-base" aria-hidden="true" />
      <span className="ls-wash" aria-hidden="true" />
      <span className="ls-text">
        <span className="ls-visible">Get started</span>
        <span className="ls-hidden" aria-hidden="true">Scroll on</span>
      </span>
      <span className="ls-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M12 4v14M6 12l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
`,
  },
];

/* ---------- emit ---------- */

for (const spec of SPECS) {
  const style = css(spec.slug);
  const markerPresent = style.includes(spec.marker ?? "--aw-");
  if (!markerPresent) throw new Error(`${spec.slug}: CSS missing marker`);

  const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${spec.meta.name} button</title>
  <style>
${style}  </style>
</head>
<body>
${spec.htmlBody}${spec.htmlScript ? `\n<script>\n${spec.htmlScript}\n</script>\n` : ""}
</body>
</html>
`;

  const react = spec.react.replace("___CSS___", () => JSON.stringify(style));

  const out = `/* ${spec.meta.name} snippets — awwwards showcase harvest (trays 137-146).
   Source: ${spec.meta.blurb.split("rebuilt")[0].trim()}.
   Specimen assembly for the Simply Buttons gallery. */

const CSS = ${JSON.stringify(style)};

const HTML_PAGE = ${"`"}<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${spec.meta.name} button</title>
  <style>
\${CSS}  </style>
</head>
<body>
${spec.htmlBody}${spec.htmlScript ? `\n<script>\n${spec.htmlScript}\n</script>\n` : ""}
</body>
</html>${"`"};

const REACT = ${JSON.stringify(react)};

export const ${spec.exportPrefix}_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: ${"`"}const express = require("express");
const app = express();
const PAGE = ${"${JSON.stringify(HTML_PAGE)"}};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
${"`"},
};

export const ${spec.exportPrefix}_META = {
  id: ${JSON.stringify(spec.meta.id)},
  name: ${JSON.stringify(spec.meta.name)},
  blurb: ${JSON.stringify(spec.meta.blurb)},
  states: ${JSON.stringify(spec.meta.states)},
  keywords: ${JSON.stringify(spec.keywords)},
};
`;

  writeFileSync(dir(`${spec.slug}-button.snippets.js`), out, "utf8");

  const kw = spec.keywords;
  if (kw.length < 17) throw new Error(`${spec.slug}: only ${kw.length} keywords`);
  if (!kw.includes("animated button") || !kw.includes("interactive button")) {
    throw new Error(`${spec.slug}: missing contract keywords`);
  }
  console.log(`wrote ${spec.slug}-button.snippets.js (${kw.length} keywords)`);
}
console.log("done:", SPECS.length, "snippet files");
