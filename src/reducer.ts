import { KEY_NEW_GAME } from "./constants";
import { colorGuess, isValidWord } from "./game-logic";
import { newGame } from "./game-states";
import { GameState, GuessedRow } from "./types";
import { GameAction } from "./ui";

const rowIsFull = (state: GameState & { status: "guessing" }) =>
  state.currentRow.length == 5;
export const onFinalGuess = (state: GameState) =>
  state.guessedRows.length == 6 - 1;

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
          if (state.currentRow == state.solution) {
            return {
              ...state,
              status: "win",
              guessedRows: [
                ...state.guessedRows,
                colorGuess(state.solution, state.currentRow),
              ],
              note: `You win! Press '${KEY_NEW_GAME}' for a new game.`,
            };
          }
          if (!isValidWord(state.currentRow)) {
            return {
              ...state,
              currentRow: "",
              note: `'${state.currentRow.toLowerCase()}' is not a valid word.`,
            };
          }
          if (onFinalGuess(state)) {
            return {
              ...state,
              status: "loss",
              guessedRows: [
                ...state.guessedRows,
                colorGuess(state.solution, state.currentRow),
              ],
              note: `The word was ${state.solution}. Better luck next time. Press '${KEY_NEW_GAME}' for a new game.`,
            };
          }
          {
            return {
              ...state,
              currentRow: "",
              guessedRows: [
                ...state.guessedRows,
                colorGuess(state.solution, state.currentRow),
              ],
            };
          }
        }
    }
  } else {
    if (action.action == "input-letter" && action.letter == KEY_NEW_GAME) {
      return newGame();
    }
  }
  return state;
}
