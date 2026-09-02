import { GithubLogo, MagnifyingGlass, Star } from "@phosphor-icons/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Lottie } from "lottie-react";
import diceCubeJson from "./assets/wired-outline-1471-dice-cube.json";
import { Seo } from "./Seo.jsx";
import { Slot } from "./Slot.jsx";
import { SplitFlapText } from "./SplitFlapText.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";
import { TopbarBand } from "./TopbarBand.jsx";
import { filterSlots } from "./search.js";
import { FILLED_COUNT, SLOTS } from "./slots.js";
import { nextShuffle } from "./shuffle.js";

function readQuery() {
  try {
    return new URLSearchParams(window.location.search).get("q") ?? "";
  } catch {
    return "";
  }
}

export function App() {
  const [query, setQuery] = useState(readQuery);
  const [searchOpen, setSearchOpen] = useState(() => Boolean(readQuery()));
  const [order, setOrder] = useState(null);
  const [shuffleTick, setShuffleTick] = useState(0);
  const [stars, setStars] = useState(() => {
    try {
      const cached = sessionStorage.getItem("simply_buttons_stars");
      return cached ? Number(cached) : null;
    } catch {
      return null;
    }
  });
  const searchInputRef = useRef(null);
  const gridRef = useRef(null);
  const flipFromRef = useRef(null);
  const randomizeLottieRef = useRef(null);
  const base = useMemo(() => order ?? SLOTS, [order]);
  const visible = useMemo(() => filterSlots(base, query), [base, query]);

  useEffect(() => {
    let unmounted = false;
    async function fetchStars() {
      try {
        const res = await fetch("https://api.github.com/repos/bits933/simply-buttons");
        if (!res.ok) return;
        const data = await res.json();
        if (!unmounted && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
          try {
            sessionStorage.setItem("simply_buttons_stars", String(data.stargazers_count));
          } catch {}
        }
      } catch {}
    }
    fetchStars();
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (event) => {
      const target = event.target;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setSearchOpen(true);
        searchInputRef.current?.focus();
      }
      if (event.key === "Escape") {
        if (!query) setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [query]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const trimmed = query.trim();
    if (trimmed) url.searchParams.set("q", trimmed);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [query]);

  function captureForFlip() {
    const grid = gridRef.current;
    if (!grid || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flipFromRef.current = null;
      return;
    }
    const before = new Map();
    for (const card of grid.querySelectorAll(".slot")) {
      before.set(card.dataset.slotId, card.getBoundingClientRect());
    }
    flipFromRef.current = before;
  }

  function randomize() {
    randomizeLottieRef.current?.stop();
    randomizeLottieRef.current?.play();
    if (visible.length < 2) return;
    captureForFlip();
    setOrder(nextShuffle(SLOTS, query, visible.map((slot) => slot.id)));
    setShuffleTick(Date.now());
  }

  function restoreOrder() {
    if (!order) return;
    captureForFlip();
    setOrder(null);
    setShuffleTick(Date.now());
  }

  // FLIP: after a shuffle commits, park each card back at its pre-shuffle spot
  // with a transform, then release the transform so every card glides home.
  useLayoutEffect(() => {
    const before = flipFromRef.current;
    flipFromRef.current = null;
    const grid = gridRef.current;
    if (!before?.size || !grid) return;
    const cards = grid.querySelectorAll(".slot");
    for (const card of cards) {
      const first = before.get(card.dataset.slotId);
      if (!first) continue;
      const last = card.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      if (dx === 0 && dy === 0) continue;
      card.style.transition = "none";
      card.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    void grid.offsetWidth;
    for (const card of cards) {
      if (!card.style.transform) continue;
      card.style.transition = "transform 560ms cubic-bezier(0.22, 1, 0.36, 1)";
      card.style.transform = "";
    }
    const timer = window.setTimeout(() => {
      for (const card of cards) card.style.transition = "";
    }, 600);
    return () => {
      window.clearTimeout(timer);
      for (const card of cards) {
        card.style.transition = "";
        card.style.transform = "";
      }
    };
  }, [shuffleTick]);

  return (
    <>
      <Seo slots={SLOTS} query={query} />
      <a className="skip" href="#gallery">
        Skip to specimens
      </a>

      <header className="topbar">
        <TopbarBand />
        <a className="mark" href="#top">
          <span className="mark-tick" aria-hidden="true" />
          Simply buttons
        </a>
        <div className="topbar-actions">
          <div
            className={`search search-slash ${searchOpen ? "is-open" : ""}`}
            data-open={searchOpen}
            onClick={() => {
              if (!searchOpen) {
                setSearchOpen(true);
                searchInputRef.current?.focus();
              }
            }}
          >
            <button
              className="search-button"
              type="button"
              aria-label="Search specimens"
              aria-controls="button-search"
              aria-expanded={searchOpen}
              onClick={() => {
                setSearchOpen(true);
                searchInputRef.current?.focus();
              }}
            >
              <MagnifyingGlass size={16} weight="bold" aria-hidden="true" className="ss-icon" />
            </button>
            <span className="ss-label" aria-hidden={searchOpen}>
              Search
            </span>
            <input
              id="button-search"
              className="search-input"
              type="search"
              placeholder="Search for your button"
              aria-label="Search specimens"
              aria-hidden={!searchOpen}
              tabIndex={searchOpen ? 0 : -1}
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => {
                if (!query.trim()) setSearchOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  if (query) setQuery("");
                  else {
                    setSearchOpen(false);
                    event.currentTarget.blur();
                  }
                }
              }}
            />
            <span className="ss-kbd" aria-hidden="true">
              /
            </span>
          </div>
          <a
            className="support-btn github-btn gh-star-btn"
            href="https://github.com/bits933/simply-buttons"
            target="_blank"
            rel="noreferrer"
            aria-label={`GitHub repository ${stars !== null ? `(${stars} stars)` : ""}`.trim()}
          >
            <span className="gh-icon-box" aria-hidden="true">
              <GithubLogo size={16} weight="bold" className="gh-icon-github" />
              <Star size={15} weight="fill" className="gh-icon-star" />
            </span>
            <span className="gh-count">{stars !== null ? stars.toLocaleString() : "Star"}</span>
          </a>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className="intro">
          <div className="intro-grid">
            <div className="intro-main">
              <p className="count">
                {query.trim()
                  ? `${visible.length} match${visible.length === 1 ? "" : "es"}`
                  : `${FILLED_COUNT} live`}
              </p>
              <h1>
                <SplitFlapText lines={["Simply", "Buttons"]} />
              </h1>
            </div>
            <div className="intro-side">
              <p className="lede">
                Each tray is a live preview plus{" "}
                <strong>HTML, React, and Node</strong>. Search by name, type, or
                motion — then copy three stacks. Not all buttons look good in
                dark mode as well as light mode, experiment by changing the
                theme to check them on light and dark themes.
              </p>
            </div>
          </div>
        </section>

        <div className="workspace">
          <div className="gallery-tools">
            <button type="button" className="randomize-btn" onClick={randomize}>
              <span className="randomize-icon-wrap" aria-hidden="true">
                <Lottie
                  lottieRef={randomizeLottieRef}
                  src={diceCubeJson}
                  autoplay={false}
                  loop={false}
                  className="randomize-lottie-icon"
                />
              </span>
              Randomize
            </button>
            {order ? (
              <button type="button" className="reset-order" onClick={restoreOrder}>
                Reset order
              </button>
            ) : null}
            {order ? (
              <span key={shuffleTick} className="visually-hidden" role="status">
                Specimens shuffled into a new random order.
              </span>
            ) : null}
          </div>
          <div id="gallery" className="gallery" ref={gridRef}>
            {visible.length ? (
              <div className="slot-grid">
                {visible.map((slot) => (
                  <Slot key={slot.id} index={slot.index} slot={slot} />
                ))}
              </div>
            ) : (
              <p className="search-empty" role="status">
                No specimens match “{query.trim()}”. Try loader, CTA, glass, or
                hover.
              </p>
            )}
          </div>
        </div>
      </main>

      <footer className="footer" id="support">
        <div>
          <h2>Support</h2>
          <p>Found a broken specimen, or want one added?</p>
        </div>
        <div className="footer-links">
          <a href="mailto:hello@example.com">Email</a>
          <a
            href="https://github.com/bits933/simply-buttons/issues"
            target="_blank"
            rel="noreferrer"
          >
            GitHub issues
          </a>
        </div>
      </footer>
    </>
  );
}
