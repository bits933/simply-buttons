import {
  STAR_BUTTON,
  STAR_LOTTIE_FILE,
  STAR_PATH,
  buildStarButtonCss,
} from "./star-button.tokens.js";

const STAR_BUTTON_CSS = buildStarButtonCss();
const STAR_JSON_PATH = `/lottie/${STAR_LOTTIE_FILE}`;
const POP_MS = Number.parseInt(STAR_BUTTON.popMs, 10);

const STAR_SVG_FLAT = `<svg class="btn-star-silhouette" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${STAR_PATH}"/></svg>`;

const STAR_MARKUP = `
<div class="btn-star-root">
  <button type="button" class="btn-star-btn" aria-pressed="false" aria-label="${STAR_BUTTON.label}">
    <span class="btn-star-side btn-star-side--label">
      <span class="btn-star-icon" aria-hidden="true">
        ${STAR_SVG_FLAT}
        <span class="btn-star-lottie" id="star-lottie"></span>
      </span>
      <span class="btn-star-swap btn-star-swap--label">
        <span class="btn-star-line btn-star-line--out">${STAR_BUTTON.label}</span>
        <span class="btn-star-line btn-star-line--in">${STAR_BUTTON.labelOn}</span>
      </span>
    </span>
    <span class="btn-star-rule" aria-hidden="true"></span>
    <span class="btn-star-side btn-star-side--count">
      <span class="btn-star-plus" aria-hidden="true">${STAR_BUTTON.plus}</span>
      <span class="btn-star-swap btn-star-swap--count">
        <span class="btn-star-line btn-star-line--out">${STAR_BUTTON.countOff}</span>
        <span class="btn-star-line btn-star-line--in">${STAR_BUTTON.countOn}</span>
      </span>
    </span>
  </button>
</div>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Star Button</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f7f4ea; }
    ${STAR_BUTTON_CSS}
  </style>
</head>
<body>
  ${STAR_MARKUP}
  <script src="https://unpkg.com/lottie-web@5.12.2/build/player/lottie.min.js"></script>
  <script>
    (function () {
      var btn = document.querySelector(".btn-star-btn");
      var host = document.getElementById("star-lottie");
      if (!btn || !host || !window.lottie) return;
      var anim = window.lottie.loadAnimation({
        container: host,
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: ${JSON.stringify(STAR_JSON_PATH)}
      });
      var popMs = ${POP_MS};
      var timer = 0;
      function iconShouldPlay() {
        return !btn.disabled && (btn.matches(":hover, :focus-visible") || btn.getAttribute("aria-pressed") === "true");
      }
      function syncIcon() {
        if (iconShouldPlay()) anim.play();
        else anim.goToAndStop(0, true);
      }
      btn.addEventListener("pointerenter", syncIcon);
      btn.addEventListener("pointerleave", syncIcon);
      btn.addEventListener("focus", syncIcon);
      btn.addEventListener("blur", syncIcon);
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        var next = btn.getAttribute("aria-pressed") !== "true";
        btn.setAttribute("aria-pressed", next ? "true" : "false");
        btn.setAttribute("aria-label", next ? ${JSON.stringify(STAR_BUTTON.labelOn)} : ${JSON.stringify(STAR_BUTTON.label)});
        window.clearTimeout(timer);
        if (next) {
          btn.classList.add("is-popping");
          timer = window.setTimeout(function () { btn.classList.remove("is-popping"); }, popMs);
        } else {
          btn.classList.remove("is-popping");
        }
        syncIcon();
      });
    })();
  </script>
</body>
</html>
`;

export const STAR_BUTTON_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef, useState } from "react";
import { Lottie } from "lottie-react";
import starHover from ${JSON.stringify("./" + STAR_LOTTIE_FILE)};

const STAR_BUTTON_CSS = ${JSON.stringify(STAR_BUTTON_CSS)};
const STAR_PATH = ${JSON.stringify(STAR_PATH)};
const POP_MS = ${POP_MS};

function StarGlyph() {
  return (
    <svg className="btn-star-silhouette" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={STAR_PATH} />
    </svg>
  );
}

export default function StarButton() {
  const [pressed, setPressed] = useState(false);
  const [popping, setPopping] = useState(false);
  const popTimer = useRef(0);
  const lottieRef = useRef(null);
  const hotRef = useRef(false);
  const pressedRef = useRef(false);
  pressedRef.current = pressed;

  useEffect(() => {
    if (document.getElementById("btn-star-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-star-styles";
    tag.textContent = STAR_BUTTON_CSS;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => () => window.clearTimeout(popTimer.current), []);

  function syncLottie() {
    const lottie = lottieRef.current;
    if (!lottie) return;
    if (hotRef.current || pressedRef.current) lottie.play();
    else lottie.stop();
  }

  function setHot(next) {
    hotRef.current = next;
    syncLottie();
  }

  function handleClick() {
    const next = !pressed;
    pressedRef.current = next;
    setPressed(next);
    if (next) {
      setPopping(true);
      window.clearTimeout(popTimer.current);
      popTimer.current = window.setTimeout(() => setPopping(false), POP_MS);
    } else {
      setPopping(false);
      window.clearTimeout(popTimer.current);
    }
    syncLottie();
  }

  const label = pressed ? ${JSON.stringify(STAR_BUTTON.labelOn)} : ${JSON.stringify(STAR_BUTTON.label)};

  return (
    <div className="btn-star-root">
      <button
        type="button"
        className={"btn-star-btn" + (popping ? " is-popping" : "")}
        aria-pressed={pressed}
        aria-label={label}
        onPointerEnter={() => setHot(true)}
        onPointerLeave={() => setHot(false)}
        onFocus={() => setHot(true)}
        onBlur={() => setHot(false)}
        onClick={handleClick}
      >
        <span className="btn-star-side btn-star-side--label">
          <span className="btn-star-icon" aria-hidden="true">
            <StarGlyph />
            <Lottie
              src={starHover}
              autoplay={false}
              loop
              lottieRef={lottieRef}
              className="btn-star-lottie"
              subscriptions={{
                ready: () => {
                  if (!hotRef.current && !pressedRef.current) lottieRef.current?.stop();
                },
              }}
            />
          </span>
          <span className="btn-star-swap btn-star-swap--label">
            <span className="btn-star-line btn-star-line--out">${STAR_BUTTON.label}</span>
            <span className="btn-star-line btn-star-line--in">${STAR_BUTTON.labelOn}</span>
          </span>
        </span>
        <span className="btn-star-rule" aria-hidden="true" />
        <span className="btn-star-side btn-star-side--count">
          <span className="btn-star-plus" aria-hidden="true">${STAR_BUTTON.plus}</span>
          <span className="btn-star-swap btn-star-swap--count">
            <span className="btn-star-line btn-star-line--out">${STAR_BUTTON.countOff}</span>
            <span className="btn-star-line btn-star-line--in">${STAR_BUTTON.countOn}</span>
          </span>
        </span>
      </button>
    </div>
  );
}
`,
  node: `const express = require("express");

const app = express();

const PAGE = ${JSON.stringify(HTML_PAGE)};

app.get("/", function (req, res) {
  res.type("html").send(PAGE);
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
`,
};

export const STAR_BUTTON_META = {
  id: "star-button",
  name: "Star split",
  blurb: "GitHub-style split pill; Lordicon star pinches on hover and +1 pops.",
  states: "default, hover, starred, focus, disabled",
  keywords: [
    "star split",
    "star button",
    "github star",
    "split pill",
    "lordicon star",
    "star pinch",
    "plus one",
    "favorite",
    "starring",
    "reaction button",
    "hover pinch",
    "star counter",
    "github split",
    "like star",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
