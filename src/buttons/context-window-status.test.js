import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const componentPath = join(directory, "ContextWindowStatusButton.tsx");
const snippetsPath = join(directory, "context-window-status.snippets.js");

test("registers the context-window status button in the gallery", () => {
  const slots = readFileSync(join(directory, "..", "slots.js"), "utf8");

  assert.match(slots, /ContextWindowStatusPreview/);
  assert.match(slots, /CONTEXT_WINDOW_STATUS_META/);
  assert.match(slots, /CONTEXT_WINDOW_STATUS_SNIPPETS/);
  assert.match(slots, /id: "context-window-status"/);
});

test("ships the requested accessible compression loop as one TSX component", () => {
  assert.ok(existsSync(componentPath), "missing ContextWindowStatusButton.tsx");
  const component = readFileSync(componentPath, "utf8");

  assert.match(component, /usedTokens = 200_000/);
  assert.match(component, /maxTokens = 1_000_000/);
  assert.match(component, /const usedRatio = currentUsed \/ safeMax/);
  assert.match(component, /strokeDashoffset=\{CIRCLE_LENGTH \* \(1 - usedRatio\)\}/);
  assert.match(component, /const nextUsed = Math\.round\(safeMax \* 0\.01\)/);
  assert.match(component, /onCompress\?: \(\) => void/);
  assert.match(component, /<button/);
  assert.match(component, /aria-label=\{`Context \$\{formatTokens\(currentUsed\)\} of \$\{formatTokens\(safeMax\)\}, compress`\}/);
  assert.match(component, /busyRef\.current/);
  assert.match(component, /prefers-reduced-motion/);
  assert.match(component, /onCompress\?\.\(\)/);
  assert.match(component, /getBoundingClientRect\(\)\.width/);
  assert.match(component, /data-phase=\{phase\}/);
  assert.match(component, /context-window-button__label--compressing.{0,4}compressing/);
  assert.doesNotMatch(component, /context-window-button__label--compressing.{0,4}compression/);
  assert.match(component, /compressed/);
  assert.doesNotMatch(component, /LOADER_(?:TRACK|ROWS)|[\u2588\u2593\u2592\u2591]/);
  assert.match(component, /context-window-button__square-field/);
  assert.match(component, /context-window-button__square-fill/);
  assert.match(component, /context-window-button__square-fill::after/);
  assert.match(component, /radial-gradient\(circle at center/);
  assert.match(component, /background-size: 3\.5px 3\.5px/);
  assert.match(component, /-webkit-mask-image: linear-gradient\(90deg, #000 0 20%, rgb\(0 0 0 \/ \.92\) 36%, rgb\(0 0 0 \/ \.62\) 67%, rgb\(0 0 0 \/ \.32\) 86%, rgb\(0 0 0 \/ \.18\) 100%\)/);
  assert.match(component, /mask-image: linear-gradient\(90deg, #000 0 20%, rgb\(0 0 0 \/ \.92\) 36%, rgb\(0 0 0 \/ \.62\) 67%, rgb\(0 0 0 \/ \.32\) 86%, rgb\(0 0 0 \/ \.18\) 100%\)/);
  assert.match(component, /opacity: \.35/);
  assert.match(component, /@keyframes context-square-fill/);
  assert.match(component, /animation: context-square-fill 3s var\(--context-ease-in-out\)/);
  assert.match(component, /@keyframes context-text-shimmer/);
  assert.match(component, /@keyframes context-compressed-pop/);
  assert.match(component, /animation: context-text-shimmer 1\.8s/);
  assert.match(component, /animation: context-compressed-pop 600ms/);
  assert.match(component, /--context-shimmer-base: #1e293b/);
  assert.match(component, /--context-shimmer-accent: #2563eb/);
  assert.match(component, /--context-shimmer-base: #f0f4ff/);
  assert.match(component, /--context-shimmer-accent: #93c5fd/);
  assert.match(component, /color: var\(--context-shimmer-base\)/);
  assert.match(component, /var\(--context-shimmer-accent\)/);
  assert.match(component, /transition: opacity 420ms var\(--context-ease-out\)/);
  assert.match(component, /schedule\(\(\) => setPhase\("compressing"\), 220\)/);
  assert.match(component, /schedule\(\(\) => setPhase\("compressed"\), 3220\)/);
  assert.match(component, /schedule\(\(\) => beginReturn\(nextUsed\), 4120\)/);
  assert.match(component, /schedule\(\(\) => finish\(\), 4700\)/);
  assert.match(component, /schedule\(\(\) => setPhase\("compressed"\), 500\)/);
  assert.match(component, /schedule\(\(\) => beginReturn\(nextUsed\), 1100\)/);
  assert.match(component, /schedule\(\(\) => finish\(\), 1350\)/);
  assert.match(component, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(component, /height: 38px/);
  assert.match(component, /padding: 0 12px/);
  assert.match(component, /font-variant-numeric: tabular-nums/);
});

test("copyable examples preserve the defaults, sequence, and single-button demo", async () => {
  assert.ok(existsSync(snippetsPath), "missing context-window snippets");
  const { CONTEXT_WINDOW_STATUS_META, CONTEXT_WINDOW_STATUS_SNIPPETS } =
    await import("./context-window-status.snippets.js");

  assert.equal(CONTEXT_WINDOW_STATUS_META.id, "context-window-status");
  assert.equal(CONTEXT_WINDOW_STATUS_META.name, "Context compression");
  assert.match(CONTEXT_WINDOW_STATUS_META.blurb, /blue square grid matrix/i);
  assert.doesNotMatch(CONTEXT_WINDOW_STATUS_META.blurb, /accordion/i);
  assert.match(CONTEXT_WINDOW_STATUS_META.states, /blue square grid|compression sweep/i);
  assert.doesNotMatch(CONTEXT_WINDOW_STATUS_META.states, /compression loader|accordion/i);
  assert.deepEqual(
    ["square grid", "square matrix", "compression sweep", "dense leading edge"].every((keyword) => CONTEXT_WINDOW_STATUS_META.keywords.includes(keyword)),
    true,
  );
  assert.ok(CONTEXT_WINDOW_STATUS_META.keywords.includes("ui animation"));
  assert.ok(!CONTEXT_WINDOW_STATUS_META.keywords.includes("accordion loader"));

  for (const snippet of Object.values(CONTEXT_WINDOW_STATUS_SNIPPETS)) {
    assert.match(snippet, /200(?:_000|000)/);
    assert.match(snippet, /1(?:_000_000|000000)/);
    assert.match(snippet, /context-window-button__label--compressing.{0,4}compressing/);
    assert.doesNotMatch(snippet, /context-window-button__label--compressing.{0,4}compression/);
    assert.match(snippet, /compressed/);
    assert.match(snippet, /aria-(?:label|busy)/);
    assert.match(snippet, /prefers-reduced-motion/);
    assert.match(snippet, /font-family:inherit/);
    assert.match(snippet, /(?:10(?:_000|000)|safeMax\*\.01)/);
    assert.match(snippet, /usedRatio/);
    assert.match(snippet, /1-usedRatio/);
    assert.doesNotMatch(snippet, /LOADER_(?:TRACK|ROWS)|[\u2588\u2593\u2592\u2591]/);
    assert.match(snippet, /context-window-button__square-field/);
    assert.match(snippet, /context-window-button__square-fill/);
    assert.match(snippet, /context-window-button__square-fill::after/);
    assert.match(snippet, /radial-gradient\(circle at center/);
    assert.match(snippet, /background-size:\s*3\.5px 3\.5px/);
    assert.match(snippet, /-webkit-mask-image:\s*linear-gradient\(90deg,#000 0 20%,rgb\(0 0 0\/\.92\) 36%,rgb\(0 0 0\/\.62\) 67%,rgb\(0 0 0\/\.32\) 86%,rgb\(0 0 0\/\.18\) 100%\)/);
    assert.match(snippet, /mask-image:\s*linear-gradient\(90deg,#000 0 20%,rgb\(0 0 0\/\.92\) 36%,rgb\(0 0 0\/\.62\) 67%,rgb\(0 0 0\/\.32\) 86%,rgb\(0 0 0\/\.18\) 100%\)/);
    assert.match(snippet, /opacity:\s*\.35/);
    assert.match(snippet, /context-square-fill 3s/);
    assert.match(snippet, /context-text-shimmer/);
    assert.match(snippet, /1\.8s/);
    assert.match(snippet, /600ms/);
    assert.match(snippet, /--context-shimmer-base:#1e293b/);
    assert.match(snippet, /--context-shimmer-accent:#2563eb/);
    assert.match(snippet, /--context-shimmer-base:#f0f4ff/);
    assert.match(snippet, /--context-shimmer-accent:#93c5fd/);
    assert.match(snippet, /color:var\(--context-shimmer-base\)/);
    assert.match(snippet, /var\(--context-shimmer-accent\)/);
    assert.match(snippet, /3220/);
    assert.match(snippet, /4120/);
    assert.match(snippet, /4700/);
    assert.match(snippet, /(?:compressed.{0,12}500|500.{0,12}compressed)/);
    assert.match(snippet, /1100/);
    assert.match(snippet, /1350/);
    assert.doesNotMatch(snippet, /font:500 12px\/1 inherit/);
  }
});
