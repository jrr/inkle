export type GuessedLetter = {
  color: "green" | "yellow" | "gray";
  letter: string;
};

export type GuessedRow = {
  letters: GuessedLetter[];
};

export type GameState = {
  guessedRows: GuessedRow[];
} & (
  | {
      status: "guessing";
      currentRow: string;
    }
  | {
      status: "complete";
    }
);

export const NUM_TRIES = 6;
export const WORD_LEN = 5;
