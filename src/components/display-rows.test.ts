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
    const result = computeDisplayRows(testStates["midgame"]);

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "letters": Array [
            Object {
              "color": "gray",
              "letter": "F",
            },
            Object {
              "color": "gray",
              "letter": "L",
            },
            Object {
              "color": "gray",
              "letter": "O",
            },
            Object {
              "color": "yellow",
              "letter": "A",
            },
            Object {
              "color": "yellow",
              "letter": "T",
            },
          ],
          "rowType": "guessed",
        },
        Object {
          "letters": Array [
            Object {
              "color": "green",
              "letter": "S",
            },
            Object {
              "color": "green",
              "letter": "T",
            },
            Object {
              "color": "green",
              "letter": "A",
            },
            Object {
              "color": "yellow",
              "letter": "R",
            },
            Object {
              "color": "gray",
              "letter": "R",
            },
          ],
          "rowType": "guessed",
        },
        Object {
          "currentRow": "JKL",
          "rowType": "guessing",
        },
        Object {
          "rowType": "blank",
        },
        Object {
          "rowType": "blank",
        },
        Object {
          "rowType": "blank",
        },
      ]
    `);
  });

  it("loss", () => {
    const result = computeDisplayRows(testStates["lose"]);

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "letters": Array [
            Object {
              "color": "gray",
              "letter": "B",
            },
            Object {
              "color": "gray",
              "letter": "O",
            },
            Object {
              "color": "gray",
              "letter": "N",
            },
            Object {
              "color": "gray",
              "letter": "K",
            },
            Object {
              "color": "gray",
              "letter": "S",
            },
          ],
          "rowType": "guessed",
        },
        Object {
          "letters": Array [
            Object {
              "color": "gray",
              "letter": "B",
            },
            Object {
              "color": "gray",
              "letter": "O",
            },
            Object {
              "color": "gray",
              "letter": "N",
            },
            Object {
              "color": "gray",
              "letter": "K",
            },
            Object {
              "color": "gray",
              "letter": "S",
            },
          ],
          "rowType": "guessed",
        },
        Object {
          "letters": Array [
            Object {
              "color": "gray",
              "letter": "B",
            },
            Object {
              "color": "gray",
              "letter": "O",
            },
            Object {
              "color": "gray",
              "letter": "N",
            },
            Object {
              "color": "gray",
              "letter": "K",
            },
            Object {
              "color": "gray",
              "letter": "S",
            },
          ],
          "rowType": "guessed",
        },
        Object {
          "letters": Array [
            Object {
              "color": "gray",
              "letter": "B",
            },
            Object {
              "color": "gray",
              "letter": "O",
            },
            Object {
              "color": "gray",
              "letter": "N",
            },
            Object {
              "color": "gray",
              "letter": "K",
            },
            Object {
              "color": "gray",
              "letter": "S",
            },
          ],
          "rowType": "guessed",
        },
        Object {
          "letters": Array [
            Object {
              "color": "gray",
              "letter": "B",
            },
            Object {
              "color": "gray",
              "letter": "O",
            },
            Object {
              "color": "gray",
              "letter": "N",
            },
            Object {
              "color": "gray",
              "letter": "K",
            },
            Object {
              "color": "gray",
              "letter": "S",
            },
          ],
          "rowType": "guessed",
        },
        Object {
          "letters": Array [
            Object {
              "color": "gray",
              "letter": "B",
            },
            Object {
              "color": "gray",
              "letter": "O",
            },
            Object {
              "color": "gray",
              "letter": "N",
            },
            Object {
              "color": "gray",
              "letter": "K",
            },
            Object {
              "color": "gray",
              "letter": "S",
            },
          ],
          "rowType": "guessed",
        },
      ]
    `);
  });
});
