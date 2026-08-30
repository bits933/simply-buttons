import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const keywordDir = "plans/keywords";
const files = readdirSync(keywordDir).filter((name) => name.endsWith(".json"));
const catalog = {};
for (const file of files) {
  Object.assign(catalog, JSON.parse(readFileSync(join(keywordDir, file), "utf8")));
}
const sharedKeywords = [
  "animated button",
  "interactive button",
  "button microinteraction",
  "ui animation",
];

function formatList(list) {
  const unique = [...new Set(list.map((item) => String(item).toLowerCase().trim()).filter(Boolean))];
  return unique.map((item) => `    ${JSON.stringify(item)},`).join("\n");
}

const snippetDir = "src/buttons";
const snippets = readdirSync(snippetDir).filter((name) => name.endsWith(".snippets.js"));
let patched = 0;
let missing = [];

for (const file of snippets) {
  const path = join(snippetDir, file);
  let text = readFileSync(path, "utf8");
  const original = text;
  text = text.replace(
    /export const (\w+_META) = \{([\s\S]*?)\n\};/g,
    (full, exportName, body) => {
      const idMatch = body.match(/id:\s*"([^"]+)"/);
      const nameMatch = body.match(/name:\s*"([^"]+)"/);
      const id =
        (idMatch && idMatch[1]) ||
        (exportName === "ORBIT_DROP_META"
          ? "orbit-drop"
          : exportName === "SIGNAL_CAPSULE_META"
            ? "signal-capsule"
            : "");
      const keywords = catalog[id];
      if (!keywords) {
        missing.push(`${file}:${exportName}:${id || nameMatch?.[1]}`);
        return full;
      }
      const block = `  keywords: [\n${formatList([...keywords, ...sharedKeywords])}\n  ],`;
      if (/\bkeywords:\s*\[/.test(body)) {
        const nextBody = body.replace(/\n  keywords:\s*\[[\s\S]*?\],/, `\n${block}`);
        return `export const ${exportName} = {${nextBody}\n};`;
      }
      const nextBody = body.replace(/(\n  states:[^\n]*\n)/, `$1${block}\n`);
      if (nextBody === body) {
        return `export const ${exportName} = {${body}\n${block}\n};`;
      }
      return `export const ${exportName} = {${nextBody}};`;
    },
  );
  if (text !== original) {
    writeFileSync(path, text);
    patched += 1;
  }
}

console.log(JSON.stringify({ files: files.length, ids: Object.keys(catalog).length, patched, missing }, null, 2));
