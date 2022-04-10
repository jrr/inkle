import { GameState, GuessedRow } from "./types";
import { GameAction } from "./ui";

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
        if (state.currentRow.length < 5) {
          return { ...state, currentRow: state.currentRow + action.letter };
        }
        break;
      case "submit-guess":
        if (state.currentRow.length == 5) {
          // todo: "if(rowIsFull(gameState))"
          if (state.guessedRows.length == 6 - 1) {
            // todo: "if(onFinalGuess(gameState))"
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
