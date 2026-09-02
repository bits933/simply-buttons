/* Writes src/buttons/search-slash-button.snippets.js (HTML / React / Express
   stacks) from search-slash-button.css + the shared markup/behavior strings,
   keeping the three embedded copies byte-consistent. Run: node plans/search-slash-gen.js */
const { readFileSync, writeFileSync } = await import("node:fs");
const { join, dirname } = await import("node:path");
const { fileURLToPath } = await import("node:url");

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(ROOT, "src", "buttons", "search-slash-button.css"), "utf8");

const BS = String.fromCharCode(92), NL = String.fromCharCode(10), BT = String.fromCharCode(96), DL = String.fromCharCode(36) + "{";
const escN = (s) => s.split(BS).join(BS + BS).split(NL).join(BS + "n").split(BT).join(BS + BT).split(DL).join(BS + DL);

const BODY = `  <div class="search-slash-root" data-search-slash>
    <button type="button" class="btn-search-slash" data-open="false" aria-label="Open search">
      <svg class="ss-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7"></circle>
        <path d="m20 20-4.3-4.3"></path>
      </svg>
      <span class="ss-label">Search</span>
      <input class="ss-input" type="text" placeholder="Search buttons…" tabindex="-1" aria-label="Search buttons" />
      <span class="ss-kbd" aria-hidden="true">/</span>
    </button>
  </div>`;

const JS = `(function () {
  var root = document.querySelector("[data-search-slash]");
  if (!root || root.__ssBound) return;
  root.__ssBound = true;
  var btn = root.querySelector(".btn-search-slash");
  var input = root.querySelector(".ss-input");
  function open() {
    if (btn.dataset.open === "true") return;
    btn.dataset.open = "true";
    btn.style.setProperty("--ss-open", "1");
    input.focus();
  }
  function close() {
    if (btn.dataset.open !== "true") return;
    btn.dataset.open = "false";
    btn.style.setProperty("--ss-open", "0");
    if (root.contains(document.activeElement)) input.blur();
  }
  btn.addEventListener("click", function (event) {
    if (btn.dataset.open === "true") return;
    event.preventDefault();
    open();
  });
  btn.addEventListener("blur", function (event) {
    if (!root.contains(event.relatedTarget)) close();
  });
  window.addEventListener("keydown", function (event) {
    var target = event.target;
    var typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
    if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      open();
    }
    if (event.key === "Escape") close();
  });
})();`;

const KEYWORDS = [
  "animated button", "interactive button", "search button", "search bar", "expandable search",
  "expanding search input", "search pill", "magnifier icon", "keyboard shortcut", "slash key",
  "kbd hint", "focus input", "command bar", "inline search", "collapsible search",
  "search toggle", "command-k style", "ui microinteraction",
];

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Search Slash Button</title>
<style>
body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0c0d10; }
${css}</style>
</head>
<body>
${BODY}
<script>
${JS}
</script>
</body>
</html>`;

const react = `import { useEffect, useRef } from "react";

const CSS = \`${escN(css)}\`;

function SearchSlashButton() {
  const rootRef = useRef(null);
  useEffect(() => {
    const root = rootRef.current;
    const btn = root.querySelector(".btn-search-slash");
    const input = root.querySelector(".ss-input");
    const open = () => {
      if (btn.dataset.open === "true") return;
      btn.dataset.open = "true";
      btn.style.setProperty("--ss-open", "1");
      input.focus();
    };
    const close = () => {
      if (btn.dataset.open !== "true") return;
      btn.dataset.open = "false";
      btn.style.setProperty("--ss-open", "0");
      if (root.contains(document.activeElement)) input.blur();
    };
    const onClick = (event) => {
      if (btn.dataset.open === "true") return;
      event.preventDefault();
      open();
    };
    const onBlur = (event) => {
      if (!root.contains(event.relatedTarget)) close();
    };
    const onKey = (event) => {
      const target = event.target;
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || (target instanceof HTMLElement && target.isContentEditable);
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        open();
      }
      if (event.key === "Escape") close();
    };
    btn.addEventListener("click", onClick);
    btn.addEventListener("blur", onBlur);
    window.addEventListener("keydown", onKey);
    return () => {
      btn.removeEventListener("click", onClick);
      btn.removeEventListener("blur", onBlur);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
  return (
    <div className="search-slash-root" ref={rootRef} data-search-slash>
      <style>{CSS}</style>
      <button type="button" className="btn-search-slash" data-open="false" aria-label="Open search">
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

export default SearchSlashButton;`;

const node = `const express = require("express");

const HTML = ${JSON.stringify(html)};

const app = express();
app.get("/", (req, res) => res.type("html").send(HTML));

app.listen(3000, () => console.log("search-slash button on http://localhost:3000"));`;

// Hand-built unquoted-key META literal — search.test.js parses these blocks
// with a text regex that expects JS object syntax, not JSON.
const META_LITERAL = `{
  id: "search-slash",
  name: "Search Slash",
  blurb: "A search pill that expands on click into a live search bar: the left becomes the magnifier plus input and the right keeps the / keycap. Pressing / anywhere opens it; Escape or clicking away collapses it.",
  states: ["idle", "hover", "active", "open", "typing"],
  keywords: [
${KEYWORDS.map((kw) => `    "${kw}",`).join(NL)}
  ],
}`;

// Snippet module ships the CSS inline as a plain string literal (matching the
// repo convention — the other snippet files never import node:fs, and the
// gallery browser can't read the fs). search.test.js parses META blocks with a
// text regex that expects JS object syntax, not JSON.
const out = [
  "/* Search slash button snippets. CSS + the three runnable stacks (HTML,",
  "   React, Express) are embedded inline so each tab ships a complete,",
  "   copy-paste-runnable specimen. */",
  "",
  `export const SEARCH_SLASH_CSS = ${JSON.stringify(css)};`,
  "",
  "export const SEARCH_SLASH_SNIPPETS = {",
  `  html: ${JSON.stringify(html)},`,
  `  react: ${JSON.stringify(react)},`,
  `  node: ${JSON.stringify(node)},`,
  "};",
  "",
  `export const SEARCH_SLASH_META = ${META_LITERAL};`,
  "",
].join("\n");
writeFileSync(join(ROOT, "src", "buttons", "search-slash-button.snippets.js"), out);
console.log("wrote search-slash-button.snippets.js;", KEYWORDS.length, "keywords");