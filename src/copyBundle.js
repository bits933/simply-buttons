export function formatButtonCopy(slot) {
  const name = String(slot?.name || "Untitled").trim();
  const blurb = String(slot?.blurb || "").trim();
  const states = Array.isArray(slot?.states)
    ? slot.states.join(", ")
    : String(slot?.states || "").trim();
  const snippets = slot?.snippets || {};

  const parts = [`Button: ${name}`];
  if (blurb) parts.push(`Prompt: ${blurb}`);
  if (states) parts.push(`States: ${states}`);
  parts.push(
    "",
    "## HTML + CSS",
    String(snippets.html || "").trim(),
    "",
    "## React",
    String(snippets.react || "").trim(),
    "",
    "## Node",
    String(snippets.node || "").trim(),
  );

  return `${parts.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`;
}

export function selectElementText(node) {
  if (!node || typeof window === "undefined") return;
  const selection = window.getSelection();
  if (!selection) return;
  const range = document.createRange();
  range.selectNodeContents(node);
  selection.removeAllRanges();
  selection.addRange(range);
}

export async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
