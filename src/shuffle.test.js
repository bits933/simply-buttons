import assert from "node:assert/strict";
import test from "node:test";
import { nextShuffle, shuffleSlots } from "./shuffle.js";

const ids = (slots) => slots.map((slot) => slot.id);

test("shuffleSlots returns a fresh permutation without mutating its input", () => {
  const slots = Array.from({ length: 12 }, (_, i) => ({ id: `slot-${i}` }));
  const shuffled = shuffleSlots(slots);
  assert.equal(shuffled.length, slots.length);
  assert.deepEqual(ids(shuffled).sort(), ids(slots).sort());
  assert.notEqual(shuffled, slots);
  assert.deepEqual(ids(slots), Array.from({ length: 12 }, (_, i) => `slot-${i}`));
});

test("nextShuffle never repeats the current arrangement", () => {
  const slots = [{ id: "a" }, { id: "b" }, { id: "c" }];
  let current = ids(slots);
  for (let click = 0; click < 30; click += 1) {
    const next = ids(nextShuffle(slots, "", current));
    assert.deepEqual([...next].sort(), ["a", "b", "c"]);
    assert.notDeepEqual(next, current);
    current = next;
  }
});

test("nextShuffle keeps reshuffling through an active query", () => {
  const slots = [
    { id: "a", keywords: ["loader"] },
    { id: "b" },
    { id: "c", keywords: ["loader"] },
  ];
  let current = ["a", "c"];
  for (let click = 0; click < 20; click += 1) {
    const next = ids(nextShuffle(slots, "loader", current).filter((slot) => slot.keywords));
    assert.equal(next.join("|"), current.join("|") === "a|c" ? "c|a" : "a|c");
    current = next;
  }
});

test("nextShuffle degrades gracefully for tiny galleries", () => {
  const one = [{ id: "only" }];
  assert.deepEqual(ids(nextShuffle(one, "", ["only"])), ["only"]);
  assert.deepEqual(ids(nextShuffle([], "", [])), []);
});
