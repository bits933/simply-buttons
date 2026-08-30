import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const dir = "src/buttons";
const files = readdirSync(dir).filter((f) => f.endsWith(".snippets.js"));
const out = [];
for (const f of files) {
  const t = readFileSync(join(dir, f), "utf8");
  const re = /export const (\w+_META) = \{([\s\S]*?)\n\};/g;
  let m;
  while ((m = re.exec(t))) {
    const body = m[2];
    const get = (k) => {
      const mm = body.match(new RegExp(k + ':\\s*"([^"]*)"'));
      return mm ? mm[1] : "";
    };
    out.push({
      file: f,
      exportName: m[1],
      id: get("id"),
      name: get("name"),
      blurb: get("blurb"),
      states: get("states"),
    });
  }
}
writeFileSync("plans/meta-extract.json", JSON.stringify(out, null, 2));
console.log(out.length);
console.log(out.map((x) => x.id || x.exportName).join("\n"));
