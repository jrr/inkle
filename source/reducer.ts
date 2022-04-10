import { GameState, GuessedRow } from "./types";
import { GameAction } from "./ui";

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.action) {
    case "backspace":
      if (state.currentRow != null && state.currentRow.length >= 1) {
        return {
          ...state,
          currentRow: state.currentRow.slice(0, state.currentRow.length - 1),
        };
      }
      break;
    case "input-letter":
      if (state.currentRow == null) {
        return { ...state, currentRow: action.letter };
      }
      if (state.currentRow.length < 5) {
        return { ...state, currentRow: state.currentRow + action.letter };
      }
      break;
    case "submit-guess":
      if (state.currentRow?.length == 5) {
        if (state.guessedRows.length == 5 - 1) {
          return {
            ...state,
            currentRow: "",
            guessedRows: [...state.guessedRows, buildGuess(state.currentRow)],
          };
        } else {
          return {
            ...state,
            currentRow: null,
            guessedRows: [...state.guessedRows, buildGuess(state.currentRow)],
          };
        }
      }
  }
  return state;
}
function buildGuess(currentRow: string): GuessedRow {
  return {
    letters: [...currentRow].map((c) => ({ color: "gray", letter: c })),
  };
}
