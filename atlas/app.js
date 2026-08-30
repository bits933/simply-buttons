import { buttons } from "./data.js";

const search = document.querySelector("#search");
const sourceFilter = document.querySelector("#source-filter");
const categoryFilters = document.querySelector("#category-filters");
const results = document.querySelector("#results");
const status = document.querySelector("#results-status");
const emptyState = document.querySelector("#empty-state");
const totalCount = document.querySelector("#total-count");
const resetButtons = [document.querySelector("#reset-filters"), document.querySelector("#empty-reset")];

const params = new URLSearchParams(location.search);
const state = {
  query: params.get("q") || "",
  category: params.get("category") || "all",
  source: params.get("source") || "all",
};

const escapeHtml = (value) => String(value ?? "").replace(/[&<>'"]/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "'": "&#39;",
  '"': "&quot;",
})[character]);

const safeUrl = (value) => /^https?:\/\//i.test(value) ? value : "#";
const pad = (value) => String(value).padStart(3, "0");

function syncUrl() {
  const next = new URLSearchParams();
  if (state.query) next.set("q", state.query);
  if (state.category !== "all") next.set("category", state.category);
  if (state.source !== "all") next.set("source", state.source);
  history.replaceState(null, "", `${location.pathname}${next.size ? `?${next}` : ""}`);
}

function setupFilters() {
  const categories = ["all", ...new Set(buttons.map(({ category }) => category))];
  const sources = [...new Set(buttons.map(({ sourceSite }) => sourceSite))].sort();

  if (!categories.includes(state.category)) state.category = "all";
  if (!sources.includes(state.source)) state.source = "all";

  categoryFilters.innerHTML = categories.map((category) => `
    <button
      class="category-filter"
      type="button"
      data-category="${escapeHtml(category)}"
      aria-pressed="${state.category === category}"
    >${category === "all" ? "All types" : escapeHtml(category)}</button>
  `).join("");

  sourceFilter.insertAdjacentHTML("beforeend", sources.map((source) =>
    `<option value="${escapeHtml(source)}">${escapeHtml(source)}</option>`
  ).join(""));

  search.value = state.query;
  sourceFilter.value = state.source;
}

function render() {
  const needle = state.query.trim().toLowerCase();
  const visible = buttons.filter((button) => {
    const searchable = [
      button.title,
      button.buttonLabel,
      button.visualTrait,
      button.sourceName,
      button.sourceSite,
      ...(button.tags || []),
    ].join(" ").toLowerCase();

    return (!needle || searchable.includes(needle))
      && (state.category === "all" || button.category === state.category)
      && (state.source === "all" || button.sourceSite === state.source);
  });

  results.innerHTML = visible.map((button) => `
    <article class="reference-card">
      <div class="card-media">
        <img
          src="/atlas/screenshots/${escapeHtml(button.id)}.png"
          alt="Screenshot of ${escapeHtml(button.title)} from ${escapeHtml(button.sourceName)}"
          width="960"
          height="600"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="card-topline">
        <span class="card-index">${pad(button.index)}</span>
        <span class="card-category">${escapeHtml(button.category)}</span>
      </div>
      <h2>${escapeHtml(button.title)}</h2>
      <p class="card-label">“${escapeHtml(button.buttonLabel)}”</p>
      <p class="card-trait">${escapeHtml(button.visualTrait)}</p>
      <div class="card-footer">
        <span class="source-name" title="${escapeHtml(button.sourceSite)} · ${escapeHtml(button.sourceName)}">${escapeHtml(button.sourceSite)} · ${escapeHtml(button.sourceName)}</span>
        <a class="source-link" href="${safeUrl(button.sourceUrl)}" target="_blank" rel="noreferrer">View source</a>
      </div>
    </article>
  `).join("");

  results.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.hidden = true;
      image.parentElement.classList.add("is-missing");
    }, { once: true });
  });

  status.textContent = `${pad(visible.length)} / ${pad(buttons.length)} REFERENCES`;
  emptyState.hidden = visible.length !== 0;
  results.hidden = visible.length === 0;
  categoryFilters.querySelectorAll("button").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.category === state.category);
  });
  syncUrl();
}

function reset() {
  state.query = "";
  state.category = "all";
  state.source = "all";
  search.value = "";
  sourceFilter.value = "all";
  render();
}

search.addEventListener("input", () => {
  state.query = search.value;
  render();
});

sourceFilter.addEventListener("change", () => {
  state.source = sourceFilter.value;
  render();
});

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  render();
});

resetButtons.forEach((button) => button.addEventListener("click", reset));

totalCount.textContent = pad(buttons.length);
setupFilters();
render();
