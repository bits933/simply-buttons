import assert from "node:assert/strict";
import test from "node:test";
import { formatButtonCopy } from "./copyBundle.js";

test("one copy payload includes the prompt and all three stacks", () => {
  const text = formatButtonCopy({
    name: "Water Ripple",
    blurb: "A teal water pill with click splash.",
    states: ["idle", "hover", "ripple"],
    snippets: {
      html: "<button class=\"btn-water-ripple\">Click Me</button>",
      react: "export default function WaterRippleButton() {}",
      node: "app.listen(3000)",
    },
  });

  assert.match(text, /^Button: Water Ripple/m);
  assert.match(text, /^Prompt: A teal water pill with click splash\./m);
  assert.match(text, /^States: idle, hover, ripple/m);
  assert.match(text, /## HTML \+ CSS/);
  assert.match(text, /btn-water-ripple/);
  assert.match(text, /## React/);
  assert.match(text, /WaterRippleButton/);
  assert.match(text, /## Node/);
  assert.match(text, /app\.listen\(3000\)/);
});
