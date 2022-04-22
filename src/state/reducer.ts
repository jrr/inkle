import { KEY_NEW_GAME, KEY_QUIT, NUM_GUESSES, WORD_LEN } from "../constants";
import { colorGuess, isValidWord } from "../game-logic";
import { GameState } from "../types";
import { GameAction } from "../ui";
import { newGame } from "./game-states";

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
              note1: `🏆 You win! 🏆`,
              note2: `Press '${KEY_NEW_GAME}' for a new game, or '${KEY_QUIT}' to quit.`,
            };
          }
          if (!isValidWord(state.currentRow)) {
            return {
              ...state,
              currentRow: "",
              note1: `'${state.currentRow.toLowerCase()}' is not a valid word.`,
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
              note1: `The word was ${state.solution}. Better luck next time.`,
              note2: `Press '${KEY_NEW_GAME}' for a new game, or '${KEY_QUIT}' to quit.`,
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
              note1: undefined,
              note2: undefined,
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
