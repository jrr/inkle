import { GameBoardState, GameState, GuessedLetter } from "../types.js";

export type DisplayRow =
  | { rowType: "guessed"; letters: GuessedLetter[] }
  | { rowType: "guessing"; currentRow: string }
  | { rowType: "blank" };

export function computeDisplayRows(
  gameBoardState: GameBoardState,
  gameState: GameState
): DisplayRow[] {
  const guesses = gameBoardState.guessedRows.map((row) => ({
    rowType: "guessed" as const,
    letters: row.letters,
  }));

  const guessing =
    gameState.status == "guessing" && gameBoardState.boardStatus == "in-play"
      ? [{ rowType: "guessing" as const, currentRow: gameState.currentRow }]
      : [];

  const numBlankRows =
    gameState.numGuessesAllowed - guesses.length - guessing.length;

  const blanks = [...Array(numBlankRows)].map(() => ({
    rowType: "blank" as const,
  }));

  return [...guesses, ...guessing, ...blanks];
}
