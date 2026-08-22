import { describe, it } from "vitest";
import { KEY_NEW_GAME, KEY_QUIT } from "../constants.js";
import { expectEqual } from "../test-util.js";
import { GameAction } from "../ui.js";
import { GameState } from "../types.js";
import { newGame } from "./game-states.js";
import { reducer } from "./reducer.js";

const act = (state: GameState, action: GameAction) => reducer(state, action);

const type = (state: GameState, letters: string) =>
  [...letters].reduce(
    (s, letter) => act(s, { action: "input-letter", letter }),
    state,
  );

const submit = (state: GameState) => act(state, { action: "submit-guess" });
const guess = (state: GameState, word: string) => submit(type(state, word));
const backspace = (state: GameState) => act(state, { action: "backspace" });
const giveUp = (state: GameState) => act(state, { action: "give-up" });

/** Narrows to the guessing variant, which is the only one with a currentRow. */
function guessing(state: GameState) {
  if (state.status != "guessing") {
    throw new Error(`expected a 'guessing' state, got '${state.status}'`);
  }
  return state;
}

const rowCounts = (state: GameState) =>
  state.gameBoards.map((b) => b.guessedRows.length);

const colorsOf = (state: GameState, board: number, row: number) =>
  state.gameBoards[board].guessedRows[row].letters.map((l) => l.color);

describe("reducer", () => {
  describe("typing", () => {
    it("appends letters to the current row", () => {
      const state = type(newGame({ solutions: ["CIGAR"] }), "CIG");
      expectEqual(guessing(state).currentRow, "CIG");
    });

    it("ignores letters once the row is full", () => {
      const full = type(newGame({ solutions: ["CIGAR"] }), "HUMPH");
      expectEqual(guessing(type(full, "X")).currentRow, "HUMPH");
    });

    it("removes the last letter on backspace", () => {
      const state = backspace(type(newGame({ solutions: ["CIGAR"] }), "CIG"));
      expectEqual(guessing(state).currentRow, "CI");
    });

    it("ignores backspace on an empty row", () => {
      const empty = newGame({ solutions: ["CIGAR"] });
      expectEqual(backspace(empty), empty);
    });
  });

  describe("submitting", () => {
    it("ignores a submission before the row is full", () => {
      const partial = type(newGame({ solutions: ["CIGAR"] }), "CIG");
      expectEqual(submit(partial), partial);
    });

    it("records a valid guess and clears the row", () => {
      const state = guess(newGame({ solutions: ["CIGAR"] }), "HUMPH");
      expectEqual(guessing(state).currentRow, "");
      expectEqual(rowCounts(state), [1]);
    });

    it("rejects a word that is not in the word list", () => {
      const state = guess(newGame({ solutions: ["CIGAR"] }), "ZZZZZ");
      expectEqual(guessing(state).currentRow, "");
      expectEqual(state.note, "'zzzzz' is not a valid word.");
      expectEqual(rowCounts(state), [0]);
    });

    it("clears a stale note once a valid guess lands", () => {
      const rejected = guess(newGame({ solutions: ["CIGAR"] }), "ZZZZZ");
      expectEqual(guess(rejected, "HUMPH").note, undefined);
    });

    // Known bug — see docs/architecture-review.md finding 1.4. The note from a
    // rejected word survives every later keystroke. Flip to `it` when fixed.
    it.fails("clears a stale note as soon as the player types again", () => {
      const rejected = guess(newGame({ solutions: ["CIGAR"] }), "ZZZZZ");
      expectEqual(type(rejected, "A").note, undefined);
    });
  });

  describe("colouring", () => {
    it("colours a guess against each board's own solution", () => {
      const state = guess(newGame({ solutions: ["CIGAR", "REBUT"] }), "CIGAR");
      expectEqual(colorsOf(state, 0, 0), [
        "green",
        "green",
        "green",
        "green",
        "green",
      ]);
      expectEqual(colorsOf(state, 1, 0), [
        "gray",
        "gray",
        "gray",
        "gray",
        "yellow",
      ]);
    });
  });

  describe("winning", () => {
    it("wins a single-board game on the right word", () => {
      const state = guess(newGame({ solutions: ["CIGAR"] }), "CIGAR");
      expectEqual(state.status, "win");
      expectEqual(state.gameBoards[0].boardStatus, "won");
    });

    it("wins a two-board game only once both boards are solved", () => {
      const first = guess(newGame({ solutions: ["CIGAR", "REBUT"] }), "CIGAR");
      expectEqual(first.status, "guessing");
      expectEqual(guess(first, "REBUT").status, "win");
    });
  });

  describe("losing", () => {
    it("loses a single-board game once the guesses run out", () => {
      const first = guess(
        newGame({ solutions: ["CIGAR"], numGuesses: 2 }),
        "HUMPH",
      );
      expectEqual(first.status, "guessing");
      expectEqual(guess(first, "SISSY").status, "loss");
    });

    it("gives up on request", () => {
      expectEqual(giveUp(newGame({ solutions: ["CIGAR"] })).status, "loss");
    });
  });

  describe("multiple boards", () => {
    it("applies a guess to every board still in play", () => {
      const state = guess(newGame({ solutions: ["CIGAR", "REBUT"] }), "HUMPH");
      expectEqual(rowCounts(state), [1, 1]);
    });

    it("stops adding rows to a board once it is solved", () => {
      const solved = guess(newGame({ solutions: ["CIGAR", "REBUT"] }), "CIGAR");
      const state = guess(solved, "HUMPH");
      expectEqual(rowCounts(state), [1, 2]);
      expectEqual(state.gameBoards[0].boardStatus, "won");
    });

    // Known bug — see docs/architecture-review.md finding 1.1. onFinalGuess
    // counts rows on gameBoards[0], which stops growing once that board is
    // won, so the game runs past its own limit and the renderer then throws.
    // Flip to `it` when fixed.
    it.fails(
      "ends at the guess limit even when board 0 was solved first",
      () => {
        const solved = guess(
          newGame({ solutions: ["CIGAR", "REBUT"], numGuesses: 3 }),
          "CIGAR",
        );
        const state = guess(guess(solved, "HUMPH"), "SISSY");
        expectEqual(state.status, "loss");
      },
    );
  });

  describe("after the game ends", () => {
    const won = guess(
      newGame({ solutions: ["CIGAR"], numGuesses: 4 }),
      "CIGAR",
    );

    it(`'${KEY_NEW_GAME}' starts a fresh game of the same size`, () => {
      const fresh = act(won, {
        action: "input-letter",
        letter: KEY_NEW_GAME,
      });
      expectEqual(fresh.status, "guessing");
      expectEqual(fresh.numGuessesAllowed, 4);
      expectEqual(rowCounts(fresh), [0]);
      expectEqual(fresh.exitPlease, undefined);
    });

    it(`'${KEY_QUIT}' asks the app to exit`, () => {
      const quit = act(won, { action: "input-letter", letter: KEY_QUIT });
      expectEqual(quit.exitPlease, true);
      expectEqual(quit.status, "win");
    });

    it("ignores any other letter", () => {
      expectEqual(act(won, { action: "input-letter", letter: "X" }), won);
    });

    it("ignores further guesses and give-up", () => {
      expectEqual(submit(won), won);
      expectEqual(giveUp(won), won);
    });
  });
});
