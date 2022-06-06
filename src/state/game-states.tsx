import { pickSolution } from "../game-logic.js";
import { GameState, GuessedRow } from "../types.js";

export function newGame(): GameState {
  return {
    status: "guessing",
    guessedRows: [],
    currentRow: "",
    solution: pickSolution(),
  };
}

const badGuess: GuessedRow = {
  letters: [
    { color: "gray", letter: "B" },
    { color: "gray", letter: "O" },
    { color: "gray", letter: "N" },
    { color: "gray", letter: "K" },
    { color: "gray", letter: "S" },
  ],
};

export const testStates: Record<string, GameState> = {
  midgame: {
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
  },
  win: {
    status: "win",
    guessedRows: [
      {
        letters: [
          { color: "green", letter: "B" },
          { color: "green", letter: "O" },
          { color: "green", letter: "N" },
          { color: "green", letter: "K" },
          { color: "green", letter: "S" },
        ],
      },
    ],
    solution: "BONKS",
  },
  lose: {
    status: "loss",
    guessedRows: [badGuess, badGuess, badGuess, badGuess, badGuess, badGuess],
    solution: "PLACE",
  },
};
