# Buttons — Project Rules

A gallery of button styles, loaders, and states. Every button is a drop-in snippet, not just a demo.

**Read this file before adding or changing any button.** These rules apply every time.

---

## Non-negotiable: code panel on every button

Every button on the site **must** have a dedicated space next to or under the live preview with **exactly 3 copy-paste code options**.

No preview without the panel. No panel with 1 or 2 tabs. Always 3.

### The 3 options

| Tab | Stack | What the user copies |
|-----|--------|----------------------|
| 1 | **HTML + CSS** | Vanilla markup + CSS. Paste into any page. No build step. |
| 2 | **React** | A single component (JSX + styles). Paste into a React / Next / Vite app. |
| 3 | **Node / Express** | A self-contained snippet that serves or renders the same button (HTML string, route, or EJS/Pug fragment). Paste into a Node project. |

If a button truly cannot map to one of these, replace that tab with the next-best pasteable stack (Vue, Svelte, Tailwind-only, etc.) — but **never drop below 3 tabs**.

### Copy-paste requirements

- Each filled card has a one-click **Copy** that copies the React component.
- The modal also has **Copy** for whichever stack was opened.
- Snippets must be **complete**. No `// ... rest of styles`. No `import './magic.css'` unless that file’s contents are inlined in the snippet.
- A user who has never seen this repo should be able to paste Tab 1 into an `.html` file, Tab 2 into a React file, or Tab 3 into a Node file and get the **same** button.
- Include only what that stack needs (HTML+CSS together in tab 1; component + CSS-in-JS / CSS module string in tab 2; server snippet in tab 3).
- After copy, show brief confirmation (e.g. “Copied”).

---

## Palette lock: black and white only

Button specimens are grayscale until the user explicitly asks for color.

- Allowed: black, white, and gray shades between them.
- Forbidden on buttons, loaders, and their snippets: hue (red, oxide, blue, green, etc.), saturated accents, tinted shadows.
- Light well: dark fill, light label. Dark well: invert. Hover / active / disabled / focus stay in the same gray scale.
- Site chrome stays neutral gray. Exceptions granted by the user: green on copy-success feedback, and the warm-ember hover tint on the topbar gradient band.

---

## Fill order

Append every new button at the **end** of the gallery. Never insert in the middle.

1. Add the new specimen after the last existing tray so earlier numbers stay the same.
2. Update that tray’s name, blurb, and states to match the button.
3. Do not renumber or reorder filled trays.

---

## What belongs in this project

In scope:

- Button styles (solid, ghost, outline, pill, icon, split, etc.)
- Button loaders / spinners / progress on click
- Button states (default, hover, focus, active, disabled, loading, success, error)
- Related controls that are still buttons (toggles used as buttons, icon buttons, FAB)

Out of scope unless they are buttons: inputs, cards, nav, full pages.

---

## Adding a new button (checklist)

Do not ship a button until all of these are true:

1. **Live preview** — interactive, including hover / focus / disabled / loading if those states exist.
2. **Code panel** — 3 tabs, each with a full copy-paste snippet.
3. **Name + short description** — what it is and when to use it.
4. **States documented** — list which states the snippet implements.
5. **Snippets match the preview** — same markup, colors, motion, and behavior. If you change the preview, update all 3 snippets in the same change.
6. **No broken copy** — copy works from each tab; snippets run without this repo.

### How code is shown

Keep snippets **hidden** on the tray. The tray only shows three stack buttons: HTML + CSS, React, Node.

Clicking a stack opens a **modal** with the full snippet and a Copy control. Do not dump code under the preview.

Suggested shape for each button entry:

```text
[ Preview canvas ]
[ Name + description + states ]
[ HTML+CSS ] [ React ] [ Node ]   ← click opens modal
```

---

## Snippet quality

- Self-contained. Prefer a class prefix unique to that button (`btn-ripple-…`) so pasting two gallery buttons on one page does not clash.
- Accessible: real `<button>`, visible focus, `disabled` / `aria-busy` / `aria-disabled` where relevant.
- Loading buttons must disable double-submit (disable or ignore clicks while loading).
- Motion should work in the preview and in every snippet (CSS animation or equivalent, not “gallery-only” JS).

---

## For agents / future sessions

When planning and implementing features:

1. **Implementation plans**: Store all implementation plans and technical specifications in the `plans/` directory (e.g. `plans/<feature-name>.md` or `plans/YYYY-MM-DD-<topic>.md`).
2. Append the next button at the end of the gallery (do not insert or renumber earlier trays).
3. Build the live preview in black / white / gray only.
4. Write all **3** copy-paste snippets so they reproduce that preview (same gray palette).
5. Wire the 3-tab panel + copy on that button’s space.
6. Do not consider the button done until the checklist above passes.

This file is the source of truth. Do not add buttons that are preview-only.

