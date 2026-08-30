import { readFileSync, writeFileSync } from "fs";

const path = "src/slots.js";
const source = readFileSync(path, "utf8");
const next = source.replace(
  /states: (\w+_META)\.states,\r?\n(\s+)preview:/g,
  "states: $1.states,\n$2keywords: $1.keywords,\n$2preview:",
);
if (next === source) {
  throw new Error("no replacements");
}
writeFileSync(path, next);
console.log((next.match(/keywords: \w+_META\.keywords/g) || []).length);
