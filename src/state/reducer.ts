import { KEY_NEW_GAME, KEY_QUIT, NUM_GUESSES, WORD_LEN } from "../constants.js";
import { colorGuess, isValidWord } from "../game-logic.js";
import { GameBoardState, GameState } from "../types.js";
import { GameAction } from "../ui.js";
import { newGame } from "./game-states.js";

const rowIsFull = (state: GameState & { status: "guessing" }) =>
  state.currentRow.length == WORD_LEN;

export const onFinalGuess = (state: GameState) =>
  state.gameBoards[0].guessedRows.length == NUM_GUESSES - 1;

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
          return handleSubmission(state);
        }
    }
  } else {
    if (action.action == "input-letter" && action.letter == KEY_NEW_GAME) {
      return newGame(state.gameBoards.length);
    }
    if (action.action == "input-letter" && action.letter == KEY_QUIT) {
      return { ...state, exitPlease: true };
    }
  }
  return state;
}

function handleSubmission(
  state: GameState & { status: "guessing" }
): GameState {
  if (!isValidWord(state.currentRow)) {
    return {
      ...state,
      currentRow: "",
      note: `'${state.currentRow.toLowerCase()}' is not a valid word.`,
    };
  }

  //  =======
  const updatedBoards: GameBoardState[] = state.gameBoards.map((board) => {
    if (state.currentRow == board.solution) {
      return {
        ...board,
        boardStatus: "won",
        guessedRows: [
          ...board.guessedRows,
          colorGuess(board.solution, state.currentRow),
        ],
      };
    }
    return {
      ...board,
      guessedRows: [
        ...board.guessedRows,
        colorGuess(board.solution, state.currentRow),
      ],
    };
  });

  // look at all boards
  // if all won -> game won
  if (allBoardsWon(updatedBoards)) {
    return { ...state, status: "win", gameBoards: updatedBoards };
  }
  // if not and on final guess -> loss
  if (onFinalGuess(state)) {
    return {
      ...state,
      status: "loss",
      gameBoards: updatedBoards,
    };
  }
  return {
    ...state,
    currentRow: "",
    gameBoards: updatedBoards,
    note: undefined,
  };
}

function allBoardsWon(updatedBoards: GameBoardState[]) {
  const s = [...new Set(updatedBoards.map((b) => b.boardStatus))];
  return s.length == 1 && s[0] == "won";
}
