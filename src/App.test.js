import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("gallery is flat and the top bar exposes a search control", async () => {
  const app = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("./index.css", import.meta.url), "utf8");
  const slots = await readFile(new URL("./slots.js", import.meta.url), "utf8");

  assert.match(slots, /export const SLOTS = CATEGORIES\.flatMap/);
  assert.match(app, /MagnifyingGlass/);
  assert.match(app, /aria-label="Search specimens"/);
  assert.match(app, /useState/);
  assert.match(app, /placeholder="Search for your button"/);
  assert.match(app, /aria-expanded=\{searchOpen\}/);
  assert.match(app, /<button[\s\S]*?<input/);
  assert.match(app, /useRef/);
  assert.match(app, /searchInputRef\.current\?\.focus\(\)/);
  assert.match(app, /onBlur=/);
  assert.match(app, /setSearchOpen\(false\)/);
  assert.match(app, /event\.key === "Escape"/);
  assert.match(app, /filterSlots/);
  assert.match(app, /visible\.map/);
  assert.match(app, /Seo/);
  assert.doesNotMatch(app, /top-nav/);
  assert.doesNotMatch(app, /family-head/);
  assert.match(css, /\.search-button/);
  assert.match(css, /\.search\.is-open \.search-input/);
  assert.doesNotMatch(css, /\.family-head\s*\{/);
});

test("gallery exposes a randomize control that reshuffles on every click", async () => {
  const app = await readFile(new URL("./App.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("./index.css", import.meta.url), "utf8");
  const slot = await readFile(new URL("./Slot.jsx", import.meta.url), "utf8");
  const shuffle = await readFile(new URL("./shuffle.js", import.meta.url), "utf8");

  assert.match(app, /import \{ GithubLogo, MagnifyingGlass \} from "@phosphor-icons\/react"/);
  assert.match(app, /import \{ Lottie \} from "lottie-react"/);
  assert.match(app, /wired-outline-1471-dice-cube\.json/);
  assert.match(app, /import \{ nextShuffle \} from "\.\/shuffle\.js"/);
  assert.match(app, /const \[order, setOrder\] = useState\(null\)/);
  assert.match(app, /useMemo\(\(\) => filterSlots\(base, query\), \[base, query\]\)/);
  assert.match(app, /className="randomize-btn"/);
  assert.match(app, /onClick=\{randomize\}/);
  assert.match(app, /randomizeLottieRef/);
  assert.match(app, /gallery-tools/);
  assert.match(app, /reset-order/);
  assert.match(app, /onClick=\{restoreOrder\}/);
  assert.match(app, /setOrder\(null\)/);
  assert.match(app, /useLayoutEffect/);
  assert.match(app, /getBoundingClientRect\(\)/);
  assert.match(app, /prefers-reduced-motion: reduce/);
  assert.match(app, /role="status"/);
  assert.match(slot, /data-slot-id=\{slot\.id\}/);
  assert.match(shuffle, /export function shuffleSlots/);
  assert.match(shuffle, /export function nextShuffle/);
  assert.match(shuffle, /for \(let attempt = 0; attempt < 20/);
  assert.match(css, /\.gallery-tools/);
  assert.match(css, /\.randomize-btn/);
  assert.match(css, /\.randomize-lottie-icon/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
