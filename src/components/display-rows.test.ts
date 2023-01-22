import { newGame, testStates } from "../state/game-states.js";
import { expectEqual } from "../test-util.js";
import { computeDisplayRows } from "./display-rows";

describe("computeDisplayRows", () => {
  it("new game", () => {
    const result = computeDisplayRows(newGame());
    expectEqual(result, [
      { rowType: "guessing", currentRow: "" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
    ]);
  });

  it("midgame", () => {
    const result = computeDisplayRows(testStates.midgame);

    expectEqual(result, [
      {
        rowType: "guessed",
        letters: testStates.midgame.gameBoard.guessedRows[0].letters,
      },
      {
        rowType: "guessed",
        letters: testStates.midgame.gameBoard.guessedRows[1].letters,
      },
      { currentRow: "JKL", rowType: "guessing" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
    ]);
  });

  it("loss", () => {
    const result = computeDisplayRows(testStates.lose);

    expectEqual(
      result,
      testStates.lose.gameBoard.guessedRows.map((r) => ({
        rowType: "guessed" as const,
        letters: r.letters,
      }))
    );
  });
});
