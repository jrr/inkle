import { expect } from "vitest";
export function expectEqual<T>(actual: T, expected: T) {
  expect(actual).toStrictEqual(expected);
}

/**
 * A small linear congruential generator, so invariant tests explore many
 * inputs while still failing the same way on every run. Not for anything
 * that needs real randomness.
 */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}
