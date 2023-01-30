import { pickSolution } from "../game-logic.js";
import { GameState, GuessedRow } from "../types.js";

type NewGameParams = {
  numBoards?: number;
  numGuesses?: number;
};
export function newGame(opts?: NewGameParams): GameState {
  const numBoards = opts?.numBoards || 1;
  const numGuesses = opts?.numGuesses || numBoards + 5;
  return {
    numGuessesAllowed: numGuesses,
    status: "guessing",
    gameBoards: Array.from({ length: numBoards }).map(() => ({
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
    numGuessesAllowed: 6,
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
    numGuessesAllowed: 6,
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
    numGuessesAllowed: 6,
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
