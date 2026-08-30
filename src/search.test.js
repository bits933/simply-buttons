import assert from "node:assert/strict";
import test from "node:test";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { filterSlots, slotMatchesQuery, tokenize } from "./search.js";

const fixtures = [
  {
    id: "pixel-load",
    name: "Pixel load",
    blurb: "In-button pixel-grid wait for long work.",
    states: "loading",
    keywords: ["loader", "spinner"],
  },
  {
    id: "fill-load",
    name: "Fill load",
    blurb: "Determinate fill and a live percent after click.",
    keywords: ["progress bar"],
  },
  {
    id: "orb-load",
    name: "Orb load",
    blurb: "Circular arrow that blooms into a thinking orb.",
    keywords: ["generating"],
  },
  {
    id: "like-burst",
    name: "Like burst",
    blurb: "Heart fills and sprays particles on like.",
    keywords: ["favorite"],
  },
  {
    id: "star-button",
    name: "Star split",
    blurb: "GitHub-style split pill",
    keywords: ["github star"],
  },
  {
    id: "igloo-close",
    name: "Glitch",
    blurb: "Viewfinder Close. Hover scrambles the label.",
    keywords: ["glitch", "scramble"],
  },
];

test("tokenize folds punctuation and case", () => {
  assert.deepEqual(tokenize("  Star-Split  CTA  "), ["star", "split", "cta"]);
});

test("empty query returns every slot", () => {
  assert.equal(filterSlots(fixtures, "").length, fixtures.length);
  assert.equal(filterSlots(fixtures, "   ").length, fixtures.length);
});

test("name and blurb matches are case-insensitive", () => {
  const hits = filterSlots(fixtures, "GLITCH");
  assert.ok(hits.some((slot) => slot.id === "igloo-close"));
});

test("related terms surface the intended specimens", () => {
  const loaders = filterSlots(fixtures, "loader");
  assert.ok(loaders.some((slot) => slot.id === "pixel-load"));
  assert.ok(loaders.some((slot) => slot.id === "fill-load"));
  assert.ok(loaders.some((slot) => slot.id === "orb-load"));

  const hearts = filterSlots(fixtures, "heart");
  assert.ok(hearts.some((slot) => slot.id === "like-burst"));
});

test("AND tokens require every word", () => {
  const hits = filterSlots(fixtures, "github star");
  assert.ok(hits.some((slot) => slot.id === "star-button"));
  assert.equal(
    hits.every((slot) => slotMatchesQuery(slot, "github star")),
    true,
  );
});

test("unknown tokens do not crash and can yield zero hits", () => {
  assert.deepEqual(filterSlots(fixtures, "zzzz-not-a-button"), []);
});

function readShippedSlots() {
  const dir = join(dirname(fileURLToPath(import.meta.url)), "buttons");
  const files = readdirSync(dir).filter((name) => name.endsWith(".snippets.js"));
  const slots = [];
  for (const file of files) {
    const text = readFileSync(join(dir, file), "utf8");
    const metas = text.match(/export const \w+_META = \{[\s\S]*?\n\};/g) ?? [];
    for (const block of metas) {
      const grab = (key) => {
        const match = block.match(new RegExp(key + ':\\s*"([^"]*)"'));
        return match ? match[1] : "";
      };
      const list = /keywords:\s*\[([\s\S]*?)\]/.exec(block);
      const keywords = list
        ? [...list[1].matchAll(/"([^"]+)"/g)].map((item) => item[1])
        : [];
      slots.push({
        id: grab("id") || grab("name").toLowerCase().replace(/\s+/g, "-"),
        name: grab("name"),
        blurb: grab("blurb"),
        states: grab("states"),
        keywords,
      });
    }
  }
  return slots;
}

test("every snippet META ships an expanded keywords array", () => {
  const slots = readShippedSlots();
  assert.ok(slots.length >= 30);
  for (const slot of slots) {
    assert.ok(slot.keywords.length >= 17, slot.name || slot.id);
    assert.ok(slot.keywords.includes("animated button"), slot.name || slot.id);
    assert.ok(slot.keywords.includes("interactive button"), slot.name || slot.id);
  }
});

test("shipped keywords find glitch, rocket, and github star", () => {
  const slots = readShippedSlots();
  const glitch = filterSlots(slots, "glitch");
  assert.ok(glitch.some((slot) => /glitch|igloo|close/i.test(`${slot.id} ${slot.name}`)));
  const rocket = filterSlots(slots, "rocket");
  assert.ok(rocket.some((slot) => /rocket|wondermake/i.test(`${slot.id} ${slot.name} ${slot.keywords.join(" ")}`)));
  const star = filterSlots(slots, "github star");
  assert.ok(star.some((slot) => slot.id === "star-button" || /star/i.test(slot.name)));
});
