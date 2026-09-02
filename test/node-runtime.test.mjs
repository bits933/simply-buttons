import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("deployment targets a Vite-compatible Node runtime", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url)));
  const nvmrc = (await readFile(new URL("../.nvmrc", import.meta.url), "utf8")).trim();
  const workflow = await readFile(new URL("../.github/workflows/build.yml", import.meta.url), "utf8");

  assert.equal(packageJson.engines.node, ">=22.12.0");
  assert.equal(nvmrc, "22.12.0");
  assert.match(workflow, /node-version-file: \.nvmrc/);
});
