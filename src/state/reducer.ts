import { KEY_NEW_GAME, KEY_QUIT, NUM_GUESSES, WORD_LEN } from "../constants.js";
import { colorGuess, isValidWord } from "../game-logic.js";
import { GameState } from "../types.js";
import { GameAction } from "../ui.js";
import { newGame } from "./game-states.js";

const rowIsFull = (state: GameState & { status: "guessing" }) =>
  state.currentRow.length == WORD_LEN;

export const onFinalGuess = (state: GameState) =>
  state.guessedRows.length == NUM_GUESSES - 1;

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
              note: undefined,
            };
          }
        }
    }
  } else {
    if (action.action == "input-letter" && action.letter == KEY_NEW_GAME) {
      return newGame();
    }
    if (action.action == "input-letter" && action.letter == KEY_QUIT) {
      return { ...state, exitPlease: true };
    }
  }
  return state;
}
