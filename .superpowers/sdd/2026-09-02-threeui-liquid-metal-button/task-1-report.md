# Task 1 report — exact ThreeUI Liquid Metal source

## Implementation

Added `plans/threeui-liquid-metal-source.mjs`. It uses built-in Node APIs only, fetches only `https://threeui.com/source-code/liquid-metal-button.json`, rejects missing, duplicate, substituted, or unexpected paths, verifies the bundle's declared hashes and the UTF-8 bytes of every required `code` field before any write, then writes the verified bytes without line-ending or formatting changes.

Added the requested Node integrity test. It hashes the three registered source files as raw bytes and asserts that `LiquidMetalButton.tsx` imports `./liquid-metal-button.html?raw`.

Pinned those exact source paths to LF in `.gitattributes`, preventing Windows checkout conversion from changing their registered hashes.

Materialized exactly:

- `src/shaders/liquid-metal-button/LiquidMetalButton.tsx` — `89b940bab445f17fafb444a7833b3c785d24c86a28156d8ad231e18de9503e11`
- `src/shaders/liquid-metal-button/liquid-metal-button.html` — `76624e881a3aecbd79b473d9c51f53c7157d47052abd0f9dc28fefd223b0a819`
- `src/shaders/threeui.css` — `efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf`

## RED / GREEN evidence

RED command:

```powershell
node --test src/shaders/liquid-metal-button/liquid-metal-button.source.test.js
```

Result: exit 1; the test failed as intended with `missing registered source: ...\\src\\shaders\\liquid-metal-button\\LiquidMetalButton.tsx` (0 pass, 1 fail).

Materialization command:

```powershell
node plans/threeui-liquid-metal-source.mjs
```

Result: exit 0; three `verified` lines printed, each with the expected path and SHA-256 above.

Initial GREEN command (before the final committed integrity test added its second assertion):

```powershell
node --test src/shaders/liquid-metal-button/liquid-metal-button.source.test.js
```

Result: exit 0; 1 pass, 0 fail.

Final committed verification command:

```powershell
node --test src/shaders/liquid-metal-button/liquid-metal-button.source.test.js
```

Result: exit 0; 2 pass, 0 fail. The committed test independently verifies all three source SHA-256 values and the component's canonical raw-HTML import contract.

Build command:

```powershell
npm run build
```

Result: exit 0; Vite built 5,922 modules in 15.72s. It retained existing warnings from `lottie-web`'s `eval` and chunks above 500 kB; neither is introduced by Task 1.

Graph commands:

```powershell
graphify . --update
graphify . --update --code-only
```

The complete update exited 1 because the pre-existing dirty worktree includes 253 non-code files needing semantic extraction and no LLM API key is configured. The code-only update exited 0 and refreshed `graphify-out/graph.json` from the available code corpus.

## Files

- `plans/threeui-liquid-metal-source.mjs`
- `src/shaders/liquid-metal-button/LiquidMetalButton.tsx`
- `src/shaders/liquid-metal-button/liquid-metal-button.html`
- `src/shaders/threeui.css`
- `src/shaders/liquid-metal-button/liquid-metal-button.source.test.js`
- `.gitattributes`
- `.superpowers/sdd/2026-09-02-threeui-liquid-metal-button/task-1-report.md`

## Self-review

- Confirmed source bytes through independent SHA-256 checks in both the materializer and the focused test.
- Confirmed the TSX raw-HTML import contract in the focused test.
- Confirmed the index and working-tree byte hashes match, and pinned source checkout EOLs to LF.
- No visual or behavioral source was recreated, formatted, or modified after materialization.
- Preserved unrelated dirty worktree changes; only the files listed above are task-owned.

## Commit

Committed with subject `feat: add exact ThreeUI liquid metal source`.

## Concerns

The full graph semantic update remains unavailable until an LLM API key is configured or the unrelated dirty document/image changes are handled. The code-only graph update completed successfully.
