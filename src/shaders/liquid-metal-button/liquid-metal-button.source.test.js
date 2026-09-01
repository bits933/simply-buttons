import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const dir = dirname(fileURLToPath(import.meta.url));
const shaders = join(dir, "..");

const HASHES = {
  "LiquidMetalButton.tsx":
    "89b940bab445f17fafb444a7833b3c785d24c86a28156d8ad231e18de9503e11",
  "liquid-metal-button.html":
    "76624e881a3aecbd79b473d9c51f53c7157d47052abd0f9dc28fefd223b0a819",
  "threeui.css": "efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf",
};

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

test("registered ThreeUI liquid metal files match SHA-256", () => {
  assert.equal(sha256(join(dir, "LiquidMetalButton.tsx")), HASHES["LiquidMetalButton.tsx"]);
  assert.equal(sha256(join(dir, "liquid-metal-button.html")), HASHES["liquid-metal-button.html"]);
  assert.equal(sha256(join(shaders, "threeui.css")), HASHES["threeui.css"]);
});

test("component imports the canonical HTML as raw source", () => {
  const tsx = readFileSync(join(dir, "LiquidMetalButton.tsx"), "utf8");
  assert.match(tsx, /from "\.\/liquid-metal-button\.html\?raw"/);
  assert.match(tsx, /variant === "play"/);
  assert.match(tsx, /liquidMetalPlayButton/);
});
