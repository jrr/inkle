import { newGame, testStates } from "../state/game-states.js";
import { expectEqual } from "../test-util.js";
import { computeDisplayRows } from "./display-rows.js";

describe("computeDisplayRows", () => {
  it("new game", () => {
    const game = newGame();
    const result = computeDisplayRows(game.gameBoards[0], game);
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
    const result = computeDisplayRows(
      testStates.midgame.gameBoards[0],
      testStates.midgame
    );

    expectEqual(result, [
      {
        rowType: "guessed",
        letters: testStates.midgame.gameBoards[0].guessedRows[0].letters,
      },
      {
        rowType: "guessed",
        letters: testStates.midgame.gameBoards[0].guessedRows[1].letters,
      },
      { currentRow: "JKL", rowType: "guessing" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
    ]);
  });

  it("loss", () => {
    const result = computeDisplayRows(
      testStates.lose.gameBoards[0],
      testStates.lose
    );

    expectEqual(
      result,
      testStates.lose.gameBoards[0].guessedRows.map((r) => ({
        rowType: "guessed" as const,
        letters: r.letters,
      }))
    );
  });
});
