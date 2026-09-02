import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  UNSEEN_ENTER_META,
  UNSEEN_ENTER_SNIPPETS,
} from "./unseen-enter-button.snippets.js";
import { LOCO_SHUFFLE_META, LOCO_SHUFFLE_SNIPPETS } from "./loco-shuffle-button.snippets.js";
import { EXO_CIRCLE_META, EXO_CIRCLE_SNIPPETS } from "./exo-circle-button.snippets.js";
import { K95_CHARS_META, K95_CHARS_SNIPPETS } from "./k95-chars-button.snippets.js";
import { ZAJNO_UNDERLINE_META, ZAJNO_UNDERLINE_SNIPPETS } from "./zajno-underline-button.snippets.js";
import { OBYS_UNDERLINE_META, OBYS_UNDERLINE_SNIPPETS } from "./obys-underline-button.snippets.js";
import { LUSION_ARROW_META, LUSION_ARROW_SNIPPETS } from "./lusion-arrow-button.snippets.js";
import { RESN_ROLL_SLAB_META, RESN_ROLL_SLAB_SNIPPETS } from "./resn-roll-slab-button.snippets.js";
import { BASEMENT_SEGMENT_META, BASEMENT_SEGMENT_SNIPPETS } from "./basement-segment-button.snippets.js";
import { LENIS_SWAP_META, LENIS_SWAP_SNIPPETS } from "./lenis-swap-button.snippets.js";

const buttons = [
  { meta: UNSEEN_ENTER_META, snippets: UNSEEN_ENTER_SNIPPETS, preview: "UnseenEnterButtonPreview" },
  { meta: LOCO_SHUFFLE_META, snippets: LOCO_SHUFFLE_SNIPPETS, preview: "LocoShuffleButtonPreview" },
  { meta: EXO_CIRCLE_META, snippets: EXO_CIRCLE_SNIPPETS, preview: "ExoCircleButtonPreview" },
  { meta: K95_CHARS_META, snippets: K95_CHARS_SNIPPETS, preview: "K95CharsButtonPreview" },
  { meta: ZAJNO_UNDERLINE_META, snippets: ZAJNO_UNDERLINE_SNIPPETS, preview: "ZajnoUnderlineButtonPreview" },
  { meta: OBYS_UNDERLINE_META, snippets: OBYS_UNDERLINE_SNIPPETS, preview: "ObysUnderlineButtonPreview" },
  { meta: LUSION_ARROW_META, snippets: LUSION_ARROW_SNIPPETS, preview: "LusionArrowButtonPreview" },
  { meta: RESN_ROLL_SLAB_META, snippets: RESN_ROLL_SLAB_SNIPPETS, preview: "ResnRollSlabButtonPreview" },
  { meta: BASEMENT_SEGMENT_META, snippets: BASEMENT_SEGMENT_SNIPPETS, preview: "BasementSegmentButtonPreview" },
  { meta: LENIS_SWAP_META, snippets: LENIS_SWAP_SNIPPETS, preview: "LenisSwapButtonPreview" },
];

const GALLERY_AW_REMOVED = new Set([
  "aw-loco-shuffle",
  "aw-k95-chars",
  "aw-lusion-arrow",
  "aw-basement-segment",
]);

const GALLERY_AW_KEPT = [
  "aw-unseen-enter",
  "aw-exo-circle",
  "aw-zajno-underline",
  "aw-obys-underline",
  "aw-resn-slab",
  "aw-lenis-swap",
];

const CATEGORY_IDS = new Set(["styles", "loaders", "states", "awwwards"]);

async function readTrayOrder() {
  const source = await readFile(new URL("../slots.js", import.meta.url), "utf8");
  const ids = [...source.matchAll(/id: "([^"]+)"/g)].map((m) => m[1]);
  return ids.filter((id) => !CATEGORY_IDS.has(id));
}

test("the awwwards batch registers ten unique, contract-clean slots", async () => {
  assert.equal(buttons.length, 10);
  const ids = buttons.map(({ meta }) => meta.id);
  assert.equal(new Set(ids).size, 10);
  assert.equal(new Set(buttons.map(({ meta }) => meta.name)).size, 10);
  assert.ok(ids.every((id) => id.startsWith("aw-")));

  for (const { meta, snippets } of buttons) {
    assert.ok(meta.keywords.length >= 17, `${meta.name} needs 17+ keywords`);
    assert.ok(meta.keywords.includes("animated button"), `${meta.name} needs the animated button keyword`);
    assert.ok(meta.keywords.includes("interactive button"), `${meta.name} needs the interactive button keyword`);
    for (const [stack, snippet] of Object.entries(snippets)) {
      assert.ok(snippet.includes("<button"), `${meta.name} ${stack} snippet needs a button element`);
      // the node tab embeds the HTML page as a JSON string, so its quotes are escaped
      if (stack !== "node") {
        assert.ok(snippet.includes("type=\"button\""), `${meta.name} ${stack} snippet needs type=button`);
      }
    }
    assert.ok(snippets.node.includes("express"), `${meta.name} node snippet must serve via Express`);
  }

  const slotsSource = await readFile(new URL("../slots.js", import.meta.url), "utf8");
  for (const { meta, preview } of buttons) {
    const hits = slotsSource.match(new RegExp(`id: "${meta.id}"`, "g")) ?? [];
    if (GALLERY_AW_REMOVED.has(meta.id)) {
      assert.equal(hits.length, 0, `${meta.id} must stay off the gallery`);
      assert.ok(!slotsSource.includes(`preview: ${preview}`), `${meta.id} preview must stay unregistered`);
      continue;
    }
    assert.equal(hits.length, 1);
    assert.ok(slotsSource.includes(`preview: ${preview}`), `${meta.id} must register ${preview}`);
  }
});

test("gallery order is 86 prior + 34 x50 + 6 remaining awwards trays + Search Slash + Water Ripple + Jelly Switch + Dot Border + Liquid metal play + Generate + Spinning Border + Plasma Drive + Liquid metal pill + Arjun Connect + Arjun Social + Nextjs Flare", async () => {
  const order = await readTrayOrder();

  assert.equal(order.length, 138);
  assert.equal(order[137], "nextjs-flare");
  assert.equal(order[136], "arjun-social");
  assert.equal(order[135], "arjun-connect");
  assert.equal(order[134], "plasma-button");
  assert.equal(order[133], "spinning-border-button");
  assert.equal(order[132], "generate-button");
  assert.equal(order[131], "threeui-liquid-metal");
  assert.equal(order[130], "liquid-metal-play");
  assert.equal(order[129], "dot-border");
  assert.equal(order[128], "jelly-switch");
  assert.equal(order[127], "water-ripple");
  assert.equal(order[0], "pixel-load");
  assert.equal(order[85], "dust-premium");

  const x50 = order.filter((id) => id.startsWith("x50-"));
  assert.equal(x50.length, 34);
  for (let i = 86; i < 86 + 34; i += 1) {
    assert.ok(order[i].startsWith("x50-"), `tray ${i + 1} must hold an x50 button, got ${order[i]}`);
  }

  const aw = order.filter((id) => id.startsWith("aw-"));
  assert.deepEqual(aw, GALLERY_AW_KEPT);
  GALLERY_AW_KEPT.forEach((id, i) => {
    assert.equal(order[86 + 34 + i], id, `tray ${121 + i} expected ${id}, got ${order[86 + 34 + i]}`);
  });
});
