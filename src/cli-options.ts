import { isKnownState, testStates } from "./state/game-states.js";
import { GameState } from "./types.js";

export const knownStateNames = Object.keys(testStates).join("|");

/** The flags meow hands back, narrowed to what the game reads. */
export type CliFlags = {
  test?: string;
  quit?: boolean;
  numBoards: number;
  numGuesses?: number;
};

/** The props cli.tsx passes to App. */
export type CliOptions = {
  initialState?: GameState;
  numBoards: number;
  numGuesses?: number;
};

/** Either the options to start with, or the reason we can't start. */
export type ParseResult =
  | { ok: true; options: CliOptions }
  | { ok: false; error: string };

export function parseFlags(flags: CliFlags): ParseResult {
  const { test, quit, numBoards, numGuesses } = flags;

  if (test != undefined && !isKnownState(test)) {
    return {
      ok: false,
      error: `Unknown test state '${test}'. Valid states are ${knownStateNames}`,
    };
  }

  return {
    ok: true,
    options: {
      initialState:
        test == undefined
          ? undefined
          : { ...testStates[test], exitPlease: quit },
      // `||` rather than `??`: meow yields 0 for `--num-boards 0` and NaN for
      // a non-numeric value, and neither should mean "no boards at all".
      numBoards: numBoards || 1,
      numGuesses,
    },
  };
}
