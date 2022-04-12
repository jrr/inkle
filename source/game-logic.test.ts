import { colorGuess } from "./game-logic";

function expectEqual<T>(actual: T, expected: T) {
  expect(expected).toStrictEqual(actual);
}
describe("colorGuess", () => {
  it("colors green", () => {
    const result = colorGuess("ABCDE", "ABCDE");
    expect(result).toBeTruthy();
    expectEqual(result, {
      letters: [
        { color: "green", letter: "A" },
        { color: "green", letter: "B" },
        { color: "green", letter: "C" },
        { color: "green", letter: "D" },
        { color: "green", letter: "E" },
      ],
    });
  });
});
