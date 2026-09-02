import { useEffect, useRef } from "react";
import "./search-slash-button.css";

function openSearch(root) {
  if (!root) return;
  const btn = root.querySelector(".btn-search-slash");
  const input = root.querySelector(".ss-input");
  if (!btn || btn.dataset.open === "true") return;
  btn.dataset.open = "true";
  btn.style.setProperty("--ss-open", "1");
  input.focus();
}

function closeSearch(root) {
  if (!root) return;
  const btn = root.querySelector(".btn-search-slash");
  const input = root.querySelector(".ss-input");
  if (!btn || btn.dataset.open !== "true") return;
  btn.dataset.open = "false";
  btn.style.setProperty("--ss-open", "0");
  if (root.contains(document.activeElement)) input.blur();
}

function SearchSlashButton() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const onKey = (event) => {
      const target = event.target;
      const typing =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        openSearch(root);
      }
      if (event.key === "Escape") closeSearch(root);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleClick = (event) => {
    const root = rootRef.current;
    const btn = root.querySelector(".btn-search-slash");
    const input = root.querySelector(".ss-input");
    if (btn.dataset.open === "true") return;
    openSearch(root);
    event.preventDefault();
    input.focus();
  };

  const handleBlur = (event) => {
    const root = rootRef.current;
    if (!root.contains(event.relatedTarget)) closeSearch(root);
  };

  return (
    <div className="search-slash-root" ref={rootRef} data-search-slash>
      <button
        type="button"
        className="btn-search-slash"
        data-open="false"
        aria-label="Open search"
        onClick={handleClick}
        onBlur={handleBlur}
      >
        <svg className="ss-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4.3-4.3" />
        </svg>
        <span className="ss-label">Search</span>
        <input className="ss-input" type="text" placeholder="Search buttons…" tabIndex={-1} aria-label="Search buttons" />
        <span className="ss-kbd" aria-hidden="true">/</span>
      </button>
    </div>
  );
}

export function SearchSlashButtonPreview() {
  return <SearchSlashButton />;
}
