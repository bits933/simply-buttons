export const ASCII_SCRAMBLE_GLYPHS = "#*?>%0";
export const ASCII_SCRAMBLE_MS = 720;

export function buildAsciiScrambleFrame(text, progress, tick = 0) {
  const amount = Math.min(1, Math.max(0, progress));
  const resolved = Math.floor(text.length * amount);
  if (amount >= 1) return text;
  return [...text].map((character, index) => {
    if (character === " " || index < resolved) return character;
    return ASCII_SCRAMBLE_GLYPHS[(index + tick) % ASCII_SCRAMBLE_GLYPHS.length];
  }).join("");
}
