import { expect } from "vitest";
export function expectEqual<T>(actual: T, expected: T) {
  expect(expected).toStrictEqual(actual);
}
