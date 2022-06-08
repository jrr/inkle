import { newGame } from "../state/game-states.js";
import { expectEqual } from "../test-util.js";
import { computeDisplayRows } from "./game-board.js";

describe("computeDisplayRows", () => {
  it("starts empty", () => {
    const result = computeDisplayRows(newGame());
    expectEqual(result, [
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
      { rowType: "blank" },
    ]);
  });
});
