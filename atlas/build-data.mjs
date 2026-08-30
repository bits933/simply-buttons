import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const batches = [
  "awwwards-live",
  "dribbble-shots",
  "behance-projects",
  "frontend-experiments",
  "design-systems",
  "curated-product-sites",
  "expansion-systems",
];

const behanceSelection = new Set([
  "Glass fashion store action",
  "Checkout payment confirmation",
  "Dark editorial brutalist CTA",
  "Soft-pink playful mobile action",
  "Blue-orange brutalist navigation",
  "Purple 3D music control",
  "Glass bank-card button",
  "Game-like 3D mobile button",
  "Dark-mode onboarding continuation",
  "Binary state toggle reference",
  "Magnetic green on-off switch",
  "Glowing dark-mode app action",
]);

const systemSelection = new Set([
  "Filled primary action",
  "Capsule primary button",
  "Negative outlined action",
  "Split action button",
  "Danger confirmation button",
  "Icon and count reaction",
  "Government start-page CTA",
  "Accessible segmented progression",
]);

const slug = (value) => value
  .normalize("NFKD")
  .replace(/[^a-zA-Z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .toLowerCase()
  .slice(0, 54);

const loaded = await Promise.all(batches.map(async (batch) => ({
  batch,
  items: JSON.parse(await readFile(path.join(root, "research", `${batch}.json`), "utf8")),
})));

const selected = [
  ...loaded.filter(({ batch }) => batch !== "expansion-systems").flatMap(({ batch, items }) => items
    .filter(({ title }) => batch === "behance-projects" ? behanceSelection.has(title)
      : batch === "design-systems" ? systemSelection.has(title)
        : true)
    .map((item) => ({ ...item, batch }))),
  ...loaded.find(({ batch }) => batch === "behance-projects").items
    .filter(({ title }) => !behanceSelection.has(title))
    .map((item) => ({ ...item, batch: "expansion-behance" })),
  ...loaded.find(({ batch }) => batch === "expansion-systems").items
    .map((item) => ({ ...item, batch: "expansion-systems" })),
];

assert.equal(selected.length, 150, "The published atlas must contain exactly 150 references.");
assert.equal(new Set(selected.map(({ sourceUrl }) => sourceUrl)).size, 150, "Published source URLs must be unique.");
assert.ok(selected.every(({ sourceUrl }) => /^https:\/\//.test(sourceUrl)), "Every reference needs an HTTPS source URL.");

const published = selected.map((item, offset) => ({
  ...item,
  index: offset + 1,
  id: `${String(offset + 1).padStart(3, "0")}-${slug(item.title)}`,
}));

await writeFile(
  path.join(root, "data.js"),
  `export const buttons = ${JSON.stringify(published, null, 2)};\n`,
);

console.log(`Published ${published.length} unique button references.`);
