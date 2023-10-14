import { describe, it, expect } from "vitest";
import { expectEqual } from "./test-util.js";
import { colorGuess } from "./game-logic.js";

describe("colorGuess", () => {
  it("colors green", () => {
    const result = colorGuess("ABCDE", "ABCDE");
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

  it("colors yellow", () => {
    const result = colorGuess("EABCD", "ABCDE");
    expectEqual(result, {
      letters: [
        { color: "yellow", letter: "A" },
        { color: "yellow", letter: "B" },
        { color: "yellow", letter: "C" },
        { color: "yellow", letter: "D" },
        { color: "yellow", letter: "E" },
      ],
    });
  });

  it("colors gray", () => {
    const result = colorGuess("JKLMN", "ABCDE");
    expectEqual(result, {
      letters: [
        { color: "gray", letter: "A" },
        { color: "gray", letter: "B" },
        { color: "gray", letter: "C" },
        { color: "gray", letter: "D" },
        { color: "gray", letter: "E" },
      ],
    });
  });

  it("handles a mixture", () => {
    const result = colorGuess("FEWER", "RIPEN");
    expectEqual(result, {
      letters: [
        { color: "yellow", letter: "R" },
        { color: "gray", letter: "I" },
        { color: "gray", letter: "P" },
        { color: "green", letter: "E" },
        { color: "gray", letter: "N" },
      ],
    });
  });

  it("two-letter case: yellow+green", () => {
    const result = colorGuess("FEWER", "STEER");
    expectEqual(result, {
      letters: [
        { color: "gray", letter: "S" },
        { color: "gray", letter: "T" },
        { color: "yellow", letter: "E" },
        { color: "green", letter: "E" },
        { color: "green", letter: "R" },
      ],
    });
  });

  it("two-letter case: yellow+yellow", () => {
    const result = colorGuess("TWIST", "OTTER");
    expectEqual(result, {
      letters: [
        { color: "gray", letter: "O" },
        { color: "yellow", letter: "T" },
        { color: "yellow", letter: "T" },
        { color: "gray", letter: "E" },
        { color: "gray", letter: "R" },
      ],
    });
  });

  it("two-letter case: yellow+gray", () => {
    // https://nerdschalk.com/wordle-same-letter-twice-rules-explained-how-does-it-work/
    const result = colorGuess("ABBEY", "KEEPS");
    expectEqual(result, {
      letters: [
        { color: "gray", letter: "K" },
        { color: "yellow", letter: "E" },
        { color: "gray", letter: "E" },
        { color: "gray", letter: "P" },
        { color: "gray", letter: "S" },
      ],
    });
  });

  it("two-letter case: green+gray", () => {
    const result = colorGuess("BONKS", "BAMBI");
    expectEqual(result, {
      letters: [
        { color: "green", letter: "B" },
        { color: "gray", letter: "A" },
        { color: "gray", letter: "M" },
        { color: "gray", letter: "B" },
        { color: "gray", letter: "I" },
      ],
    });
  });
});
