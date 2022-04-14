import { pickSolution } from "../game-logic";
import { GameState } from "../types";

export function newGame(): GameState {
  return {
    status: "guessing",
    guessedRows: [],
    currentRow: "",
    solution: pickSolution(),
  };
}

// todo: make this accessible behind command-line flag
const testState: GameState = {
  status: "guessing",
  guessedRows: [
    {
      letters: [
        { color: "gray", letter: "F" },
        { color: "gray", letter: "L" },
        { color: "gray", letter: "O" },
        { color: "yellow", letter: "A" },
        { color: "yellow", letter: "T" },
      ],
    },
    {
      letters: [
        { color: "green", letter: "S" },
        { color: "green", letter: "T" },
        { color: "green", letter: "A" },
        { color: "yellow", letter: "R" },
        { color: "gray", letter: "R" },
      ],
    },
  ],
  currentRow: "JKL",
  solution: "OATER",
};
