import { WORD_LEN } from "./constants";
import { GuessedRow } from "./types";
import { possibleSolutions } from "./words/possible-solutions";
import { validWords } from "./words/valid-words";
import { sample } from "lodash-es";

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
      if (c.color == "green") {
        return c;
      } else {
        const n = remainingSolution.indexOf(c.letter);
        if (n == -1) {
          remainingSolution[n] = "_";
          return { color: "gray" as const, letter: c.letter };
        } else {
          remainingSolution[n] = "_";
          return { color: "yellow" as const, letter: c.letter };
        }
      }
    });

  return { letters };
}

export const isValidWord = (s: string) =>
  validWords.includes(s.toLowerCase()) ||
  possibleSolutions.includes(s.toLowerCase());

export const pickSolution = () => {
  const word = sample(possibleSolutions);
  if (typeof word == "string" && word.length == WORD_LEN) {
    return word.toUpperCase();
  }
  throw new Error("Problem selecting word.");
};
