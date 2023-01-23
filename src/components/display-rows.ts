import { NUM_GUESSES } from "../constants.js";
import { GameState, GuessedLetter } from "../types.js";

export type DisplayRow =
  | { rowType: "guessed"; letters: GuessedLetter[] }
  | { rowType: "guessing"; currentRow: string }
  | { rowType: "blank" };

export function computeDisplayRows(gameState: GameState): DisplayRow[] {
  const guesses = gameState.gameBoards[0].guessedRows.map((row) => ({
    rowType: "guessed" as const,
    letters: row.letters,
  }));

  const guessing =
    gameState.status == "guessing"
      ? [{ rowType: "guessing" as const, currentRow: gameState.currentRow }]
      : [];

  const numBlankRows = NUM_GUESSES - guesses.length - guessing.length;

  const blanks = [...Array(numBlankRows)].map(() => ({
    rowType: "blank" as const,
  }));

  return [...guesses, ...guessing, ...blanks];
}
