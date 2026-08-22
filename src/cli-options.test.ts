import { describe, it } from "vitest";
import { knownStateNames, parseFlags } from "./cli-options.js";
import { testStates } from "./state/game-states.js";
import { expectEqual } from "./test-util.js";

/** meow always supplies these two, so every case starts from them. */
const baseFlags = { numBoards: 1, quit: false };

const optionsOf = (result: ReturnType<typeof parseFlags>) => {
  if (!result.ok) {
    throw new Error(`expected flags to parse, got: ${result.error}`);
  }
  return result.options;
};

describe("parseFlags", () => {
  describe("test states", () => {
    it("starts an ordinary game when --test is absent", () => {
      expectEqual(optionsOf(parseFlags(baseFlags)).initialState, undefined);
    });

    it("loads a known test state", () => {
      const { initialState } = optionsOf(
        parseFlags({ ...baseFlags, test: "midgame" }),
      );
      expectEqual(initialState?.status, testStates.midgame.status);
      expectEqual(
        initialState?.gameBoards[0].solution,
        testStates.midgame.gameBoards[0].solution,
      );
    });

    it("marks the state for exit with --quit", () => {
      const { initialState } = optionsOf(
        parseFlags({ ...baseFlags, test: "win", quit: true }),
      );
      expectEqual(initialState?.exitPlease, true);
    });

    it("leaves the state running without --quit", () => {
      const { initialState } = optionsOf(
        parseFlags({ ...baseFlags, test: "win" }),
      );
      expectEqual(initialState?.exitPlease, false);
    });

    it("rejects an unknown test state, naming the valid ones", () => {
      const result = parseFlags({ ...baseFlags, test: "bogus" });
      expectEqual(result, {
        ok: false,
        error: `Unknown test state 'bogus'. Valid states are ${knownStateNames}`,
      });
    });

    it("names every known state in that message", () => {
      for (const name of Object.keys(testStates)) {
        expectEqual(knownStateNames.split("|").includes(name), true);
      }
    });
  });

  describe("board count", () => {
    it("passes an ordinary count through", () => {
      expectEqual(
        optionsOf(parseFlags({ ...baseFlags, numBoards: 3 })).numBoards,
        3,
      );
    });

    // meow hands back 0 for `--num-boards 0` and NaN for `--num-boards abc`.
    // Neither should leave the game with no boards to render.
    it("treats zero boards as one", () => {
      expectEqual(
        optionsOf(parseFlags({ ...baseFlags, numBoards: 0 })).numBoards,
        1,
      );
    });

    it("treats a non-numeric count as one board", () => {
      expectEqual(
        optionsOf(parseFlags({ ...baseFlags, numBoards: NaN })).numBoards,
        1,
      );
    });

    // Known bug — see docs/architecture-review.md finding 1.3. A negative
    // count still reaches newGame and leaves it with no boards at all.
    // Flip to `it` when fixed.
    it.fails("rejects a negative board count", () => {
      expectEqual(parseFlags({ ...baseFlags, numBoards: -3 }).ok, false);
    });
  });

  describe("guess count", () => {
    it("passes --num-guesses through", () => {
      expectEqual(
        optionsOf(parseFlags({ ...baseFlags, numGuesses: 10 })).numGuesses,
        10,
      );
    });

    it("leaves the guess count unset when absent", () => {
      expectEqual(optionsOf(parseFlags(baseFlags)).numGuesses, undefined);
    });
  });
});
