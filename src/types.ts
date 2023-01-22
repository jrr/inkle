export type GuessedLetter = {
  color: "green" | "yellow" | "gray";
  letter: string;
};

export type GuessedRow = {
  letters: GuessedLetter[];
};

export type GameBoardState = {
  guessedRows: GuessedRow[];
  solution: string;
};

export type GameState = {
  // guessedRows: GuessedRow[];
  // solution: string;
  gameBoard: GameBoardState;
  exitPlease?: boolean;
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
