import { WORD_LEN } from "./constants.js";
import { GuessedRow } from "./types.js";
import { possibleSolutions } from "./words/possible-solutions.js";
import { otherValidWords } from "./words/other-valid-words.js";

export function colorGuess(solution: string, _guess: string): GuessedRow {
  const remainingSolution = Array.from(solution);

  const letters = Array.from(_guess)
    .map((c, i) => {
      if (remainingSolution[i] == c) {
        remainingSolution[i] = "_";
        return { color: "green" as const, letter: c };
      } else {
        return { color: "not-green" as const, letter: c };
      }
    })
    .map((c) => {
      switch (c.color) {
        case "green":
          return c;
        case "not-green": {
          const n = remainingSolution.indexOf(c.letter);
          if (n == -1) {
            return { color: "gray" as const, letter: c.letter };
          } else {
            remainingSolution[n] = "_";
            return { color: "yellow" as const, letter: c.letter };
          }
        }
      }
    });

  return { letters };
}

export const isValidWord = (s: string) =>
  possibleSolutions.includes(s.toLowerCase()) ||
  otherValidWords.includes(s.toLowerCase());

function sample<T>(input: T[]): T {
  const pos = Math.floor(Math.random() * input.length);
  return input[pos];
}

export const pickSolution = () => {
  const word = sample(possibleSolutions);
  if (typeof word == "string" && word.length == WORD_LEN) {
    return word.toUpperCase();
  }
  throw new Error("Problem selecting word.");
};
