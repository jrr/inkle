export type GuessedLetter = {
  color: "green" | "yellow" | "gray";
  letter: string;
};

export type GuessedRow = {
  letters: GuessedLetter[];
};

export type GameState = {
  guessedRows: GuessedRow[];
  currentRow: string | null;
};
