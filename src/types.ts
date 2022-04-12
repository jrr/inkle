export type GuessedLetter = {
  color: "green" | "yellow" | "gray";
  letter: string;
};

export type GuessedRow = {
  letters: GuessedLetter[];
};

export type GameState = {
  guessedRows: GuessedRow[];
  solution: string;
  note?: string;
} & (
  | {
      status: "guessing";
      currentRow: string;
    }
  | {
      status: "win";
    }
  | {
      status: "loss";
    }
);
