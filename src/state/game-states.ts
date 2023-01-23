import { pickSolution } from "../game-logic.js";
import { GameState, GuessedRow } from "../types.js";

export function newGame(numGames = 1): GameState {
  numGames;
  return {
    status: "guessing",
    gameBoards: Array.from({ length: numGames }).map(() => ({
      guessedRows: [],
      solution: pickSolution(),
      boardStatus: "in-play",
    })),
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
    gameBoards: [
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
        boardStatus: "in-play",
      },
    ],
    currentRow: "JKL",
  },
  win: {
    status: "win",
    gameBoards: [
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
        boardStatus: "won",
      },
    ],
  },
  lose: {
    status: "loss",
    gameBoards: [
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
        boardStatus: "in-play",
      },
    ],
  },
};
