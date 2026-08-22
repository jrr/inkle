import { describe, it } from "vitest";
import { KEY_NEW_GAME, KEY_QUIT, WORD_LEN } from "../constants.js";
import { expectEqual, seededRandom } from "../test-util.js";
import { GameAction, GameState } from "../types.js";
import { possibleSolutions } from "../words/possible-solutions.js";
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

/*
Rules that should hold throughout any game, checked by playing out seeded
random games rather than by listing cases. Violations are collected rather
than asserted one at a time, so a failure reports every rule that broke and
the seed that broke it.
*/

const BOARD_COUNTS = [1, 2, 3];
const SEEDS = 30;
const MAX_TURNS = 200;

type Violation = { boards: number; seed: number; rule: string; detail: string };
type ReportFn = (rule: string, detail: string) => void;

/**
 * Plays one random game, stopping as soon as it ends. Staying inside a single
 * game keeps the new-game key from resetting the boards mid-sequence, which
 * would legitimately break several of these rules.
 */
function playRandomGame(boards: number, seed: number): GameState[] {
  const rand = seededRandom(seed * 1000 + boards);
  const words = possibleSolutions.map((w) => w.toUpperCase());
  const pick = (from: string[]) => from[Math.floor(rand() * from.length)];

  const solutions = Array.from({ length: boards }, () => pick(words));
  let state = newGame({ solutions });
  const history = [state];

  for (let turn = 0; turn < MAX_TURNS && state.status == "guessing"; turn++) {
    const roll = rand();
    if (roll < 0.6) {
      // a whole word, often one of the answers, so games actually finish
      state = guess(state, rand() < 0.3 ? pick(solutions) : pick(words));
    } else if (roll < 0.85) {
      state = type(state, String.fromCharCode(65 + Math.floor(rand() * 26)));
    } else {
      state = backspace(state);
    }
    history.push(state);
  }
  return history;
}

function eachGame(check: (states: GameState[], report: ReportFn) => void) {
  const violations: Violation[] = [];
  for (const boards of BOARD_COUNTS) {
    for (let seed = 1; seed <= SEEDS; seed++) {
      check(playRandomGame(boards, seed), (rule, detail) =>
        violations.push({ boards, seed, rule, detail }),
      );
    }
  }
  return violations;
}

describe("invariants", () => {
  it("hold for every state a random game passes through", () => {
    const violations = eachGame((states, report) => {
      for (const state of states) {
        if (state.status == "guessing" && state.currentRow.length > WORD_LEN) {
          report("the current row fits in a word", `row '${state.currentRow}'`);
        }
        state.gameBoards.forEach((board, i) => {
          if (board.guessedRows.some((r) => r.letters.length != WORD_LEN)) {
            report("every guessed row is a full word", `board ${i}`);
          }
        });
      }
    });

    expectEqual(violations, []);
  });

  it("hold across every move a random game makes", () => {
    const violations = eachGame((states, report) => {
      for (let i = 1; i < states.length; i++) {
        const before = states[i - 1].gameBoards;
        const after = states[i].gameBoards;

        after.forEach((board, b) => {
          const added = board.guessedRows.length - before[b].guessedRows.length;

          if (added < 0) {
            report("guessed rows never disappear", `board ${b}: ${added}`);
          }
          if (added > 1) {
            report("a move adds at most one row", `board ${b}: +${added}`);
          }
          // A board takes the guess that wins it, then nothing further.
          if (before[b].boardStatus == "won" && added > 0) {
            report(
              "an already-solved board takes no more guesses",
              `board ${b}`,
            );
          }
          if (before[b].boardStatus == "won" && board.boardStatus != "won") {
            report("a solved board stays solved", `board ${b}`);
          }
        });
      }
    });

    expectEqual(violations, []);
  });

  const overGuessLimit = (boardCounts: number[]) =>
    eachGame((states, report) => {
      for (const state of states) {
        state.gameBoards.forEach((board, i) => {
          if (board.guessedRows.length > state.numGuessesAllowed) {
            report(
              "no board exceeds the guess limit",
              `board ${i}: ${board.guessedRows.length} rows, ${state.numGuessesAllowed} allowed`,
            );
          }
        });
      }
    }).filter((v) => boardCounts.includes(v.boards));

  it("keep a single-board game inside its guess limit", () => {
    expectEqual(overGuessLimit([1]), []);
  });

  // Known bug — see docs/architecture-review.md finding 1.1. This is the broad
  // form of the targeted case above: random play of a multi-board game runs
  // past the limit. Flip to `it` when fixed.
  it.fails("keep a multi-board game inside its guess limit", () => {
    expectEqual(overGuessLimit([2, 3]), []);
  });
});
