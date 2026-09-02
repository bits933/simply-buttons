# Brainless Agent Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new, animation-rich gallery buttons that translate the visual language of Brainless's Claude Code, Codex, and Grok terminal components into compact native buttons.

**Architecture:** Follow the existing gallery pattern: one React preview component, one scoped CSS file, one copyable-snippets module, and one `node:test` file per button. Keep the buttons dependency-free beyond React, use transform/opacity-first CSS motion, and register all three at the end of `src/slots.js` so numbering remains stable.

**Tech Stack:** React 19, JavaScript/JSX, scoped CSS, Node's built-in test runner, Vite.

**Spec:** This plan implements the user's 2026-08-31 request and derives visual tokens from the Brainless registry sources for `claude-header`, `claude-thinking`, `codex-header`, `codex-working`, `grok-header`, and `grok-thinking`.

## Global Constraints

- The three entries are new buttons named `Claude Code`, `Codex`, and `Grok`; they must not copy whole terminal panels.
- Use native `<button type="button">` elements with useful `aria-label`, `:focus-visible`, `:active`, and `prefers-reduced-motion` behavior.
- Keep dimensions stable across idle, hover, focus, and active states; animate only transform, opacity, background position, or clip-path.
- Support the gallery's light and dark themes through scoped CSS custom properties and `[data-theme="dark"]` overrides.
- Preserve Brainless taste: Claude uses terracotta `#cd694a` and a playful sparkle/terminal cue; Codex uses terse monochrome, `>_`, and a grayscale working shimmer; Grok uses a crisp dot-matrix mark, charcoal chrome, and restrained amber `#e0af68`.
- Copyable HTML, React, and Node snippets must visually and behaviorally match each live preview.
- No new dependency, timer, canvas, GSAP, or Framer Motion is needed; CSS is the smallest 60fps-capable solution.
- Run `graphify update .` after every code or documentation change.

---

### Task 1: Claude Code Button

**Files:**
- Create: `src/buttons/ClaudeCodeButton.jsx`
- Create: `src/buttons/claude-code-button.css`
- Create: `src/buttons/claude-code-button.snippets.js`
- Create: `src/buttons/claude-code-button.test.js`

**Interfaces:**
- Produces: `ClaudeCodeButton`, `ClaudeCodeButtonPreview`, `CLAUDE_CODE_META`, and `CLAUDE_CODE_SNIPPETS`.
- The button accepts `label = "Ask Claude"`, `className = ""`, `onClick`, and native button props.

- [ ] **Step 1: Write the failing test**

Add a `node:test` that imports the snippet module and verifies all three stacks ship a native `Ask Claude` button, terracotta `#cd694a`, a terminal `❯` cue, an animated sparkle/shine state, active scale feedback, focus visibility, and reduced-motion fallback. Verify metadata id `claude-code` and states include hover, active, focus-visible, and reduced motion.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test src/buttons/claude-code-button.test.js`

Expected: FAIL because the snippet module does not exist.

- [ ] **Step 3: Implement the minimum faithful button**

Build a 48px-high, compact rounded-6px terminal button. Use a dark/off-white theme surface, terracotta border/accent, a stable `❯` prompt, label, and a small sparkle. On hover/focus, let a terracotta-tinted surface sweep in with eased clip-path motion, nudge the prompt by 2px, and run a restrained highlight across the sparkle/label; on active scale the whole button to `0.98`. Stop decorative motion under reduced motion.

- [ ] **Step 4: Mirror the live implementation in all snippets**

Ship complete standalone HTML, self-contained React, and Express/Node page strings. Keep class names and animation values aligned with the live CSS.

- [ ] **Step 5: Run the test and verify GREEN**

Run: `node --test src/buttons/claude-code-button.test.js`

Expected: PASS.

---

### Task 2: Codex Button

**Files:**
- Create: `src/buttons/CodexAgentButton.jsx`
- Create: `src/buttons/codex-agent-button.css`
- Create: `src/buttons/codex-agent-button.snippets.js`
- Create: `src/buttons/codex-agent-button.test.js`

**Interfaces:**
- Produces: `CodexAgentButton`, `CodexAgentButtonPreview`, `CODEX_AGENT_META`, and `CODEX_AGENT_SNIPPETS`.
- The button accepts `label = "Run Codex"`, `className = ""`, `onClick`, and native button props.

- [ ] **Step 1: Write the failing test**

Add a `node:test` that verifies all stacks ship a native `Run Codex` button, the `>_` identifier, monochrome `#1a1a1a` / `#ededed` taste, Codex grayscale shimmer, a restrained cyan `#5cc2e0` command/cursor accent, active scale, focus visibility, and reduced-motion fallback. Verify metadata id `codex-agent`.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test src/buttons/codex-agent-button.test.js`

Expected: FAIL because the snippet module does not exist.

- [ ] **Step 3: Implement the minimum faithful button**

Build a 48px-high, rounded-6px monochrome terminal button with a fixed `>_` mark, label, and compact cursor/status cell. Hover/focus reveals the captured `#353535` command surface, runs one grayscale shimmer across the label, and shifts the cyan cursor/status cell by 2px without changing width. Active scales to `0.98`; reduced motion leaves all information visible and static.

- [ ] **Step 4: Mirror the live implementation in all snippets**

Ship complete HTML, React, and Node versions using the same tokens, markup, and CSS behavior.

- [ ] **Step 5: Run the test and verify GREEN**

Run: `node --test src/buttons/codex-agent-button.test.js`

Expected: PASS.

---

### Task 3: Grok Button

**Files:**
- Create: `src/buttons/GrokAgentButton.jsx`
- Create: `src/buttons/grok-agent-button.css`
- Create: `src/buttons/grok-agent-button.snippets.js`
- Create: `src/buttons/grok-agent-button.test.js`

**Interfaces:**
- Produces: `GrokAgentButton`, `GrokAgentButtonPreview`, `GROK_AGENT_META`, and `GROK_AGENT_SNIPPETS`.
- The button accepts `label = "Ask Grok"`, `className = ""`, `onClick`, and native button props.

- [ ] **Step 1: Write the failing test**

Add a `node:test` that verifies all stacks ship a native `Ask Grok` button, a DOM/SVG dot-matrix mark, charcoal `#1a1a1a`, border `#505058`, restrained amber `#e0af68`, shimmer/scan motion, active scale, focus visibility, and reduced-motion fallback. Verify metadata id `grok-agent`.

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test src/buttons/grok-agent-button.test.js`

Expected: FAIL because the snippet module does not exist.

- [ ] **Step 3: Implement the minimum faithful button**

Build a 48px-high, rounded-6px charcoal button with a small crisp dot-matrix `x` mark, label, and a quiet amber event diamond. On hover/focus, sweep a grayscale highlight across the dot mark, softly tint the border amber, and rotate/pulse the event diamond with eased keyframes. Active scales to `0.98`; reduced motion freezes all decorative animation.

- [ ] **Step 4: Mirror the live implementation in all snippets**

Ship complete HTML, React, and Node versions using the same tokens, markup, and CSS behavior.

- [ ] **Step 5: Run the test and verify GREEN**

Run: `node --test src/buttons/grok-agent-button.test.js`

Expected: PASS.

---

### Task 4: Gallery Integration and Validation

**Files:**
- Modify: `src/slots.js`
- Create: `src/buttons/brainless-agent-buttons.integration.test.js`

**Interfaces:**
- Consumes: all three preview, metadata, and snippets exports from Tasks 1-3.
- Produces: three consecutive filled gallery slots appended after the current final item.

- [x] **Step 1: Write the failing integration test**

Add a `node:test` that imports all three metadata/snippet modules, asserts unique ids and names, checks every stack contains the matching label, and reads `src/slots.js` to confirm each preview and snippet export is registered once in Claude → Codex → Grok order.

- [x] **Step 2: Run the test and verify RED**

Run: `node --test src/buttons/brainless-agent-buttons.integration.test.js`

Expected: FAIL because `src/slots.js` does not register the new entries.

- [x] **Step 3: Register the buttons**

Add the six imports and append three slot objects using ids `claude-code`, `codex-agent`, and `grok-agent`. Do not change existing slot order or card-height CSS.

- [x] **Step 4: Verify the complete project**

Run: `node --test`

Run: `npm run build`

Open the local gallery and verify all three cards in light and dark themes, hover/focus/active behavior, fixed dimensions, reduced-motion CSS, fullscreen preview, and copied React code.

Expected: all tests pass, Vite build exits 0, and no button causes card reflow.
