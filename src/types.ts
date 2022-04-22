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
  note1?: string;
  note2?: string;
  exitPlease?: boolean;
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
