import { filterSlots } from "./search.js";

export function shuffleSlots(slots) {
  const shuffled = [...slots];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function nextShuffle(slots, query, currentIds) {
  const next = shuffleSlots(slots);
  if (!currentIds || currentIds.length < 2) return next;
  const current = currentIds.join("|");
  const arrangementOf = (candidate) =>
    filterSlots(candidate, query)
      .map((slot) => slot.id)
      .join("|");
  if (arrangementOf(next) !== current) return next;
  // A tiny filtered set can land on the same visible arrangement by chance;
  // redraw so every click visibly reshuffles.
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = shuffleSlots(slots);
    if (arrangementOf(candidate) !== current) return candidate;
  }
  return next;
}
