import { newGame, testStates } from "../state/game-states.js";
import { expectEqual } from "../test-util.js";
import { computeDisplayRows } from "./display-rows";

describe("computeDisplayRows", () => {
  it("starts empty", () => {
    const result = computeDisplayRows(newGame());
    expectEqual(result, [
      { rowType: "guessing" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
    ]);
  });

  it("midgame", () => {
    const result = computeDisplayRows(testStates["midgame"]);

    expectEqual(result, [
      { rowType: "guessed" },
      { rowType: "guessed" },
      { rowType: "guessing" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
    ]);
  });

  it("loss", () => {
    const result = computeDisplayRows(testStates["lose"]);

    expectEqual(result, [
      { rowType: "guessed" },
      { rowType: "guessed" },
      { rowType: "guessed" },
      { rowType: "guessed" },
      { rowType: "guessed" },
      { rowType: "guessed" },
    ]);
  });
});
