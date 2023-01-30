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
  boardStatus: "in-play" | "won";
};

export type GameState = {
  numGuessesAllowed: number;
  gameBoards: GameBoardState[];
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
