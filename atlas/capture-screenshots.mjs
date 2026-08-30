import { mkdir, stat, unlink, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buttons } from "./data.js";

const root = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(root, "..", "public", "atlas", "screenshots");
const batch = process.argv[2];
const force = process.argv.includes("--force");
const selected = batch === "codepen"
  ? buttons.filter((button) => button.sourceSite === "CodePen")
  : batch ? buttons.filter((button) => button.batch === batch) : buttons;

if (!selected.length) throw new Error(`No references found for batch: ${batch || "all"}`);

await mkdir(output, { recursive: true });

async function previewEndpoint(button) {
  if (button.sourceSite === "CodePen") {
    const source = new URL(button.sourceUrl);
    const [, creator, , pen] = source.pathname.split("/");
    return `https://images.weserv.nl/?url=shots.codepen.io/${creator}/pen/${pen}-800.jpg&output=png`;
  }

  let imageUrl = button.imageUrl;
  if (!imageUrl && ["Awwwards", "Behance"].includes(button.sourceSite)) {
    try {
      const html = await (await fetch(button.sourceUrl)).text();
      const tag = [...html.matchAll(/<meta\b[^>]*>/gi)]
        .map(([value]) => value)
        .find((value) => /(?:property|name)=["']og:image["']/i.test(value));
      imageUrl = tag?.match(/content=["']([^"']+)/i)?.[1].replaceAll("&amp;", "&");
    } catch {}
  }

  const fallbackHeight = button.sourceSite === "Dribbble" ? 900 : 600;
  return imageUrl
    ? `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl)}&w=960&h=600&fit=cover&output=png`
    : `https://image.thum.io/get/width/960/crop/${fallbackHeight}/noanimate/wait/2/${button.sourceUrl}`;
}

async function capture(button) {
  const destination = path.join(output, `${button.id}.png`);
  if (!force) {
    try {
      if ((await stat(destination)).size > 1_000) return { skipped: true };
    } catch {}
  }

  if (/\.mp4(?:\?|$)/i.test(button.imageUrl)) {
    const temporary = path.join(os.tmpdir(), `${button.id}.mp4`);
    try {
      const response = await fetch(button.imageUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await writeFile(temporary, Buffer.from(await response.arrayBuffer()));
      const frame = spawnSync("ffmpeg", [
        "-y", "-ss", "0.5", "-i", temporary, "-frames:v", "1",
        "-vf", "scale=960:600:force_original_aspect_ratio=increase,crop=960:600",
        destination,
      ], { stdio: "ignore" });
      if (frame.status !== 0) throw new Error("ffmpeg could not extract a preview frame");
      return { skipped: false };
    } finally {
      await unlink(temporary).catch(() => {});
    }
  }

  const endpoint = await previewEndpoint(button);
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);
    try {
      const response = await fetch(endpoint, { signal: controller.signal });
      if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) {
        throw new Error(`HTTP ${response.status}`);
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 1_000) throw new Error("Screenshot response was unexpectedly small");
      await writeFile(destination, bytes);
      return { skipped: false };
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`${button.id}: ${lastError.message}`);
}

let captured = 0;
let skipped = 0;
let failed = 0;

for (const button of selected) {
  try {
    const result = await capture(button);
    result.skipped ? skipped += 1 : captured += 1;
    console.log(`${result.skipped ? "skip" : "saved"} ${button.id}`);
  } catch (error) {
    failed += 1;
    console.error(`failed ${error.message}`);
  }
}

console.log(`${batch || "all"}: ${captured} captured, ${skipped} existing, ${failed} failed.`);
if (failed) process.exitCode = 1;
