import { Lifebuoy, MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Seo } from "./Seo.jsx";
import { Slot } from "./Slot.jsx";
import { SplitFlapText } from "./SplitFlapText.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";
import { TopbarBand } from "./TopbarBand.jsx";
import { filterSlots } from "./search.js";
import { FILLED_COUNT, SLOTS } from "./slots.js";

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
  const searchInputRef = useRef(null);
  const visible = useMemo(() => filterSlots(SLOTS, query), [query]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const trimmed = query.trim();
    if (trimmed) url.searchParams.set("q", trimmed);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [query]);

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
          <div className={`search ${searchOpen ? "is-open" : ""}`}>
            <button
              className="search-button"
              type="button"
              aria-label="Search specimens"
              aria-controls="button-search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
            >
              <MagnifyingGlass size={18} weight="bold" aria-hidden="true" />
            </button>
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
                  else event.currentTarget.blur();
                }
              }}
            />
          </div>
          <a className="support-btn" href="#support">
            <Lifebuoy size={16} weight="bold" aria-hidden="true" />
            <span>Support</span>
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
                dark mode as well as light mode — experiment by changing the
                theme to check them on light and dark themes.
              </p>
            </div>
          </div>
        </section>

        <div className="workspace">
          <div id="gallery" className="gallery">
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
          <a href="https://github.com">GitHub issues</a>
        </div>
      </footer>
    </>
  );
}
