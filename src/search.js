const RELATED = {
  loader: ["load", "loading", "spinner", "progress", "wait", "busy"],
  loading: ["loader", "spinner", "progress"],
  spinner: ["loader", "loading", "orb"],
  progress: ["loader", "fill", "percent", "determinate"],
  cta: ["call to action", "hero", "primary", "get started"],
  hover: ["rollover", "mouseover", "pointer"],
  toggle: ["switch", "on off", "boolean"],
  like: ["heart", "favorite", "reaction", "love"],
  star: ["github", "bookmark", "favorite"],
  glass: ["frosted", "blur", "glassmorphism", "translucent"],
  glitch: ["scramble", "ascii", "distort", "close"],
  download: ["mac", "file", "cta"],
  send: ["submit", "tick", "success", "morph"],
  confirm: ["hold", "press and hold", "destructive"],
  menu: ["hamburger", "nav", "navigation", "icon"],
  metal: ["machined", "brushed", "industrial", "physical"],
  concrete: ["destroy", "fracture", "3d", "rubble"],
  rocket: ["get started", "wondermake", "lottie", "magnetic"],
  wipe: ["fill", "reveal", "invert", "swipe"],
  ripple: ["material", "ink", "touch"],
  neu: ["neumorphic", "soft ui", "emboss"],
  pixel: ["grid", "8bit", "retro", "loader"],
  liquid: ["gooey", "blob", "fluid", "morph"],
  keyboard: ["keycap", "mechanical", "click"],
  scramble: ["ascii", "glitch", "decode"],
};

function fold(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[+_/.,()—–-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(list) {
  return [...new Set(list.filter(Boolean))];
}

export function tokenize(query) {
  return fold(query)
    .split(" ")
    .filter((token) => token.length > 0);
}

export function relatedTerms(token) {
  const extra = RELATED[token] ?? [];
  return unique([token, ...extra.map(fold)]);
}

export function buildSearchText(slot) {
  const keywords = Array.isArray(slot.keywords) ? slot.keywords : [];
  return fold(
    [
      slot.id,
      slot.name,
      slot.blurb,
      slot.states,
      slot.category,
      slot.categoryLabel,
      ...keywords,
    ].join(" "),
  );
}

export function slotMatchesQuery(slot, query) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return true;
  const hay = slot.searchText ?? buildSearchText(slot);
  return tokens.every((token) =>
    relatedTerms(token).some((term) => hay.includes(term)),
  );
}

export function filterSlots(slots, query) {
  if (!tokenize(query).length) return slots;
  return slots.filter((slot) => slotMatchesQuery(slot, query));
}

export function withSearchIndex(slots) {
  return slots.map((slot) => ({
    ...slot,
    searchText: buildSearchText(slot),
  }));
}
