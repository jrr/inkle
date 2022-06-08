import { NUM_GUESSES } from "../constants.js";
import { GameState } from "../types.js";

/*

 */
type DisplayRow =
  | { rowType: "guessed" }
  | { rowType: "guessing" }
  | { rowType: "blank" };

export function computeDisplayRows(gameState: GameState): DisplayRow[] {
  const numBlankRows =
    NUM_GUESSES -
    gameState.guessedRows.length -
    (gameState.status == "guessing" ? 1 : 0);

  const guesses = gameState.guessedRows.map((row, i) => ({
    rowType: "guessed" as const,
  }));
  const guessing =
    gameState.status == "guessing" ? [{ rowType: "guessing" as const }] : [];

  const blanks = [...Array(numBlankRows)].map((_, i) => ({
    rowType: "blank" as const,
  }));

  return [...guesses, ...guessing, ...blanks];
}
