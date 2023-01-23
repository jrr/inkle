import { pickSolution } from "../game-logic.js";
import { GameState, GuessedRow } from "../types.js";

export function newGame(): GameState {
  return {
    status: "guessing",
    gameBoard: [
      {
        guessedRows: [],
        solution: pickSolution(),
      },
    ],
    currentRow: "",
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

export const stateNames = ["midgame", "win", "lose"] as const;

type TestState = (typeof stateNames)[number];
export function isKnownState(input: string): input is TestState {
  return (stateNames as readonly string[]).includes(input);
}

export const testStates: Record<(typeof stateNames)[number], GameState> = {
  midgame: {
    status: "guessing",
    gameBoard: [
      {
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
        solution: "OATER",
      },
    ],
    currentRow: "JKL",
  },
  win: {
    status: "win",
    gameBoard: [
      {
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
    ],
  },
  lose: {
    status: "loss",
    gameBoard: [
      {
        guessedRows: [
          badGuess,
          badGuess,
          badGuess,
          badGuess,
          badGuess,
          badGuess,
        ],
        solution: "PLACE",
      },
    ],
  },
};
