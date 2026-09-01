import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourceUrl = "https://threeui.com/source-code/liquid-metal-button.json";
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const requiredSources = new Map([
  [
    "src/shaders/liquid-metal-button/LiquidMetalButton.tsx",
    "89b940bab445f17fafb444a7833b3c785d24c86a28156d8ad231e18de9503e11",
  ],
  [
    "src/shaders/liquid-metal-button/liquid-metal-button.html",
    "76624e881a3aecbd79b473d9c51f53c7157d47052abd0f9dc28fefd223b0a819",
  ],
  [
    "src/shaders/threeui.css",
    "efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf",
  ],
]);

const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`ThreeUI source request failed: ${response.status}`);

const bundle = await response.json();
if (!Array.isArray(bundle.files)) throw new Error("ThreeUI source bundle has no files array");

const paths = new Set(bundle.files.map(({ path }) => path));
if (paths.size !== bundle.files.length || paths.size !== requiredSources.size) {
  throw new Error("ThreeUI source bundle paths do not exactly match the registered source paths");
}

const verified = [];
for (const [path, expectedHash] of requiredSources) {
  const file = bundle.files.find((candidate) => candidate.path === path);
  if (!file || typeof file.code !== "string" || file.sha256 !== expectedHash) {
    throw new Error(`Missing or substituted registered source: ${path}`);
  }

  const bytes = Buffer.from(file.code, "utf8");
  const actualHash = createHash("sha256").update(bytes).digest("hex");
  if (actualHash !== expectedHash) throw new Error(`Checksum mismatch: ${path}`);
  verified.push([path, bytes, actualHash]);
}

if ([...paths].some((path) => !requiredSources.has(path))) {
  throw new Error("ThreeUI source bundle includes an unregistered source path");
}

for (const [path, bytes, hash] of verified) {
  const destination = join(root, path);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, bytes);
  console.log(`verified ${path} ${hash}`);
}
