import { chooseTwoTitleColors, colorGuess, isValidWord } from "./game-logic";
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
              note: "You win!",
              titleColors: chooseTwoTitleColors(),
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
              note: `The word was ${state.solution}. Better luck next time.`,
              titleColors: ["black", "red"],
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
              titleColors: chooseTwoTitleColors(),
            };
          }
        }
    }
  }

  return state;
}
