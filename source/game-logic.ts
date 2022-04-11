import { GuessedRow } from "./types";

export function colorGuess(solution: string, currentRow: string): GuessedRow {
  // todo: more robust coloring for there-are-two-of-them situations
  return {
    letters: [...currentRow].map((c, i) => {
      if (solution[i] == c) {
        return { color: "green", letter: c };
      }
      if (solution.includes(c)) {
        return { color: "yellow", letter: c };
      }
      return { color: "gray", letter: c };
    }),
  };
}
