# Specimen search + SEO

**Goal:** Every gallery tray carries backend keywords (name, type, motion, synonyms). Site search matches those keywords and related terms, and the page exposes that copy to crawlers.

**Data:** `META.keywords: string[]` on each `*.snippets.js` export. `slots.js` copies `keywords` onto each slot.

**Match:** `src/search.js` — AND-token match against id, name, blurb, states, category, keywords, plus a small related-term map.

**UI:** Topbar search (existing magnifying-glass) opens a field, filters the flat grid, `?q=` in the URL.

**SEO:** Stronger `index.html` meta/OG, JSON-LD CollectionPage, per-card `itemProp` + hidden keywords.
