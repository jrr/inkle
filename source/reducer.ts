import { GameState, GuessedRow } from "./types";
import { GameAction } from "./ui";

const rowIsFull = (state: GameState & { status: "guessing" }) =>
  state.currentRow.length == 5;
const onFinalGuess = (state: GameState) => state.guessedRows.length == 6 - 1;

export function reducer(state: GameState, action: GameAction): GameState {
  if (state.status == "guessing") {
    switch (action.action) {
      case "backspace":
        if (state.currentRow.length >= 1) {
          return {
            ...state,
            currentRow: state.currentRow.slice(0, state.currentRow.length - 1),
          };
        }
        break;
      case "input-letter":
        if (!rowIsFull(state)) {
          return { ...state, currentRow: state.currentRow + action.letter };
        }
        break;
      case "submit-guess":
        if (rowIsFull(state)) {
          if (onFinalGuess(state)) {
            return {
              ...state,
              status: "complete",
              guessedRows: [...state.guessedRows, buildGuess(state.currentRow)],
            };
          } else {
            return {
              ...state,
              currentRow: "",
              guessedRows: [...state.guessedRows, buildGuess(state.currentRow)],
            };
          }
        }
    }
  }

  if (state.status == "complete") {
  }
  return state;
}

function buildGuess(currentRow: string): GuessedRow {
  return {
    letters: [...currentRow].map((c) => ({ color: "gray", letter: c })),
  };
}
