import { describe, it } from "vitest";
import { WORD_LEN } from "./constants.js";
import { colorGuess } from "./game-logic.js";
import { expectEqual, seededRandom } from "./test-util.js";
import { otherValidWords } from "./words/other-valid-words.js";
import { possibleSolutions } from "./words/possible-solutions.js";

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

/*
The example tests above pin down specific cases. These state the rules those
examples are circling, and check them across the real word lists.

Each assertion carries the solution and guess alongside the value being
checked, so a failure inside a long loop names the pair that broke it.
*/

const countOf = (word: string, letter: string) =>
  [...word].filter((c) => c == letter).length;

function checkInvariants(solution: string, guess: string) {
  const { letters } = colorGuess(solution, guess);
  const where = { solution, guess };

  // One tile per guessed letter, in the order they were guessed.
  expectEqual(
    { ...where, tiles: letters.map((l) => l.letter).join("") },
    { ...where, tiles: guess },
  );

  // Green marks exactly the positions the guess already got right.
  expectEqual(
    { ...where, green: letters.map((l) => l.color == "green") },
    { ...where, green: [...guess].map((c, i) => c == solution[i]) },
  );

  // Wordle's duplicate-letter rule: a letter earns as many coloured tiles as
  // it has occurrences in the solution, and no more.
  for (const letter of new Set(guess)) {
    expectEqual(
      {
        ...where,
        letter,
        coloured: letters.filter((l) => l.letter == letter && l.color != "gray")
          .length,
      },
      {
        ...where,
        letter,
        coloured: Math.min(countOf(guess, letter), countOf(solution, letter)),
      },
    );
  }
}

/** Words that repeat letters, where the colouring rules are subtlest. */
const trickyWords = [
  "EERIE",
  "GEESE",
  "STEER",
  "TEETH",
  "ERROR",
  "PUPPY",
  "LLAMA",
  "ABBEY",
  "MUMMY",
  "KAYAK",
  "MADAM",
  "SASSY",
];

describe("colorGuess invariants", () => {
  it("hold for every pairing of duplicate-heavy words", () => {
    for (const solution of trickyWords) {
      for (const guess of trickyWords) {
        checkInvariants(solution, guess);
      }
    }
  });

  it("hold across a sample of the real word lists", () => {
    const solutions = possibleSolutions.map((w) => w.toUpperCase());
    const guesses = [...possibleSolutions, ...otherValidWords].map((w) =>
      w.toUpperCase(),
    );
    const rand = seededRandom(20260822);
    const pick = (words: string[]) => words[Math.floor(rand() * words.length)];

    for (let i = 0; i < 2000; i++) {
      checkInvariants(pick(solutions), pick(guesses));
    }
  });

  it("colour a correct guess entirely green", () => {
    for (const word of trickyWords) {
      expectEqual(
        colorGuess(word, word).letters.map((l) => l.color),
        Array<string>(WORD_LEN).fill("green"),
      );
    }
  });
});
