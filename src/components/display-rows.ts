import { NUM_GUESSES } from "../constants.js";
import { GameState, GuessedLetter } from "../types.js";

export type DisplayRow =
  | { rowType: "guessed"; letters: GuessedLetter[] }
  | { rowType: "guessing"; currentRow: string }
  | { rowType: "blank" };

export function computeDisplayRows(gameState: GameState): DisplayRow[] {
  const numBlankRows =
    NUM_GUESSES -
    gameState.guessedRows.length -
    (gameState.status == "guessing" ? 1 : 0);

  const guesses = gameState.guessedRows.map((row, i) => ({
    rowType: "guessed" as const,
    letters: row.letters,
  }));
  const guessing =
    gameState.status == "guessing"
      ? [{ rowType: "guessing" as const, currentRow: gameState.currentRow }]
      : [];

  const blanks = [...Array(numBlankRows)].map(() => ({
    rowType: "blank" as const,
  }));

  return [...guesses, ...guessing, ...blanks];
}
