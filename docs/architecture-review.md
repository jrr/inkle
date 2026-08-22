# inkle — architecture & code health review

Reviewed at `6be12e7` on branch `claude/architecture-code-health-review-cnby7b`.
Scope: everything under `src/` (excluding the two word-list files), plus build,
lint, test and CI configuration.

Every finding marked "reproduced" below was verified by running the code, not by
reading alone.

## Summary

For a ~700-line hobby project the bones are good: pure game logic is cleanly
separated from rendering, state is a discriminated union, and CI is unusually
thorough (Node 20/22/24 matrix plus real `npx` install smoke tests in Docker).

The main problem is that **game-level state is being read off `gameBoards[0]`**.
That single shortcut produces a reproducible crash in the multi-board mode the
readme advertises, and it survived because the reducer — the core state machine —
has no tests at all.

---

## 1. Correctness

### 1.1 Multi-board games can never be lost, and then crash the UI — High

`onFinalGuess` reads the guess count off board 0:

```ts
// src/state/reducer.ts:10
export const onFinalGuess = (state: GameState) =>
  state.gameBoards[0].guessedRows.length == state.numGuessesAllowed - 1;
```

But `handleSubmission` freezes a board once it is won:

```ts
// src/state/reducer.ts:64
if (board.boardStatus == "won") {
  return board; // guessedRows stops growing
}
```

So in any `--num-boards > 1` game where board 0 is solved before the others, the
guess counter stalls forever. The loss condition never fires and the player gets
unlimited guesses.

It then gets worse. `computeDisplayRows` derives the number of blank rows by
subtraction:

```ts
// src/components/display-rows.ts:22
const numBlankRows = gameState.numGuessesAllowed - guesses.length - guessing.length;
const blanks = [...Array(numBlankRows)].map(...);
```

Once guesses exceed `numGuessesAllowed`, `numBlankRows` goes negative and
`Array(-n)` throws `RangeError: Invalid array length` during render.

**Reproduced.** Two boards (`CIGAR`, `REBUT`), `numGuessesAllowed: 3`, board 0
solved on guess 1:

```
guess 1: status=guessing | CIGAR:won:1 REBUT:in-play:1
guess 2: status=guessing | CIGAR:won:1 REBUT:in-play:2
guess 3: status=guessing | CIGAR:won:1 REBUT:in-play:3   <- should be a loss
guess 6: status=guessing | CIGAR:won:1 REBUT:in-play:6
```

Driving the same scenario through `ink-testing-library` renders normally for one
frame and then goes blank — the render throws and Ink tears the tree down. In a
real terminal that is a dead screen mid-game.

**Fix direction.** Guesses-used is a property of the _game_, not of a board.
Either track it explicitly on `GameState` (`guessesUsed: number`, incremented in
`handleSubmission`), or derive it with
`Math.max(...state.gameBoards.map((b) => b.guessedRows.length))`. The explicit
field is preferable — it makes the invariant impossible to violate by freezing a
board.

### 1.2 `computeDisplayRows` has no floor on the blank-row count — Medium

Independently of 1.1, `Array(negative)` throwing is a sharp edge in a pure
display function. `Math.max(0, numBlankRows)` makes the renderer total, so a
state-machine bug degrades to a wrong-looking board rather than a crash.

### 1.3 CLI flags are unvalidated — Medium

`--num-boards -3` reaches `Array.from({ length: -3 })`, producing an empty
`gameBoards`. Every `gameBoards[0]` access then reads `undefined` and
`deriveGameColors` throws before the first frame. **Reproduced:**
`newGame({ numBoards: -3 })` → `boards: 0`, `gameBoards[0] is undefined`.

`newGame` uses `opts?.numBoards || 1`, so `0` is accidentally rescued by the
falsy check while `-3` and `NaN` are not. Validate in `cli.tsx` (positive
integer, sane upper bound) and reject with a message the way the unknown
`--test` state already does.

### 1.4 `allBoardsWon([])` — Low

```ts
const s = [...new Set(updatedBoards.map((b) => b.boardStatus))];
return s.length == 1 && s[0] == "won";
```

A Set round-trip to express "all equal". `updatedBoards.every((b) => b.boardStatus == "won")`
is clearer — note it also flips the empty-array answer to `true`, which is
another reason to reject an empty board list at the CLI boundary (1.3).

### 1.5 The invalid-word note is never cleared while typing — Low, UX

Submitting `zzzzz` sets `note` and clears the row. The note then persists through
every subsequent keystroke and is only cleared by the _next successful_
submission. **Reproduced:** after typing `A`, `note` is still
`"'zzzzz' is not a valid word."`. Clear `note` on `input-letter` (or on the
first keystroke after a rejection).

### 1.6 `stringSum` reduces without an initial value — Low

```ts
// src/game-colors.ts:9
s.split("")
  .map((c) => c.charCodeAt(0))
  .reduce((a, b) => a + b);
```

Throws `TypeError` on an empty string. It is safe today only because
`deriveGameColors` guards on `guessedRows.length == 0` and solutions are always
5 characters. Pass `0` as the seed.

### 1.7 Accidental array-to-string coercion — Low

```ts
// src/game-colors.ts:16
const s =
  state.solution +
  state.guessedRows.flatMap((r) => r.letters.flatMap((l) => l.letter));
```

The right-hand side is an array; `+` stringifies it with commas. **Reproduced:**
this yields `"OATERA,B"`, so comma char codes are folded into the color hash. The
result is deterministic, so nothing is _broken_ — but the commas are clearly
unintended. Use `.join("")`.

### 1.8 `lettersForColor` builds a comma-joined string used as a set — Low

```ts
allGuesses
  .filter((g) => g.color == color)
  .map((g) => g.letter)
  .join();
```

`.join()` with no argument inserts commas, and the result is then queried with
`.includes(c)`. It works only because every key is a single character that is
never `,`. `Set<string>` is the type this code actually wants.

---

## 2. Architecture

### 2.1 Layering inversion between state and UI — Medium

`src/state/reducer.ts:4` imports `GameAction` from `../ui.js`, while
`src/ui.tsx:9` imports `reducer` from `./state/reducer.js`. That is a genuine
module cycle. It is invisible today because the import is type-only and TypeScript
erases it, but it inverts the dependency direction (the state layer should not
know the UI exists) and it breaks the moment `verbatimModuleSyntax` or
`isolatedModules` is turned on.

Move `GameAction` to `src/types.ts` or a new `src/state/actions.ts`.

### 2.2 `gameBoards[0]` as a proxy for game-level state — Medium

This is the root cause of 1.1 and shows up in three places:

| Site                            | What it reads from board 0 | Correct for N boards?           |
| ------------------------------- | -------------------------- | ------------------------------- |
| `state/reducer.ts:11`           | guesses used               | **No** — bug 1.1                |
| `game-colors.ts:38-40`          | title/border color seed    | Cosmetic, but arbitrary         |
| `components/status-text.tsx:17` | the solution to reveal     | Yes — guarded by a length check |

The type system permits it because `GameState` models a board _array_ but no
game-level progress. Adding `guessesUsed` to `GameState` fixes the bug and
removes the temptation.

### 2.3 `handleSubmission` has two near-identical branches — Low

The `state.currentRow == board.solution` branch and the fallthrough differ only
in `boardStatus`; both append the same `colorGuess(...)`. Collapse to one object
with a computed `boardStatus`. The stray `//  =======` separator comment at
`reducer.ts:62` can go with it.

### 2.4 `notesForState` returns a positional 3-tuple — Low

`[string, string, boolean]` where the boolean means "the second string is the
give-up hint, so delay it". Destructuring at the call site names it
`note2IsGiveUpHint`, which is a hint that the tuple wants to be an object —
`{ primary, secondary, delaySecondary }`.

### 2.5 The give-up hint timer never resets — Low

`StatusText`'s `useEffect` has a `[]` dependency list, so the 15-second timer
runs once per mount. Pressing `N` for a new game does not unmount the component,
so from then on the hint is visible immediately in every subsequent game. Key the
effect on the game identity, or reset `hintReady` when a new game starts.

### 2.6 Word lists — Low, tidiness only

`isValidWord` does two linear `Array.includes` scans over 2,315 + 10,657 entries.
Measured worst case is ~0.1 ms per lookup, which is irrelevant for a
human-driven game — flagging for shape, not speed. Building a `Set` once at
module load would be both faster and a better expression of intent.

### 2.7 What is working well

Worth keeping as-is:

- `display-rows.ts` and `game-colors.ts` extract presentation _decisions_ into
  pure, testable functions, leaving the `.tsx` files as thin renderers. This is
  the right split and it is why `display-rows` has real tests.
- The `GameState` discriminated union means `currentRow` only exists in the
  `guessing` variant, and the reducer's outer `if (state.status == "guessing")`
  narrows it correctly.
- `colorGuess` handles the genuinely tricky duplicate-letter Wordle rules with a
  two-pass mark-and-consume algorithm, and the tests cover
  yellow+green / yellow+yellow / yellow+gray / green+gray.
- The CI matrix packs a real tarball and runs it via `npm exec` in clean Node
  20/22/24 Docker images. Most projects this size never test their published
  artifact at all.

---

## 3. Test coverage

Current state: 11 tests, all passing, across `colorGuess` (8) and
`computeDisplayRows` (3).

**The reducer has zero tests.** It is the core state machine — guess submission,
win/loss detection, multi-board fan-out, new-game and quit keys — and none of it
is exercised. Bug 1.1 is a three-line test away from being caught:

```ts
it("ends a two-board game at the guess limit even if board 0 was solved", ...)
```

Also untested: `newGame` defaults, `deriveGameColors`, and the CLI flag path.

**`ink-testing-library` is a devDependency with zero usages in `src/`.** There
are no render tests despite the tooling being installed and working — I used it
to reproduce 1.1 without any configuration changes. A single snapshot-style test
of a `--test midgame` frame would guard the whole render path.

**`test-util.ts` has its arguments reversed:**

```ts
export function expectEqual<T>(actual: T, expected: T) {
  expect(expected).toStrictEqual(actual); // <- swapped
}
```

Assertions still pass and fail correctly, but every failure diff labels expected
and actual backwards, which is actively misleading while debugging. Should be
`expect(actual).toStrictEqual(expected)`.

---

## 4. Tooling and configuration

### 4.1 React lint rules are installed but not running — Medium

`eslint-plugin-react` and `eslint-plugin-react-hooks` are in `devDependencies`
but are **not referenced anywhere in `eslint.config.mjs`**. No React rules
execute. `react-hooks/exhaustive-deps` would have flagged
`src/ui.tsx:37` — the `useEffect` depends on `exit` but lists only
`[gameState.exitPlease]` — and would likely have caught 2.5 as well.

Related: `yarn install` reports a peer conflict —
`eslint@10.2.0` does not satisfy what `eslint-plugin-react-hooks` requests
("non-overlapping ranges"). Worth resolving before wiring the plugins in.

### 4.2 Dead files and dead config

- **`src/multi-board.ts` is empty** (0 bytes) with no importers. Delete.
- **`babel.config.js` is dead.** It references `@babel/preset-env` and
  `@babel/preset-typescript`; neither is installed. Vitest transforms via
  esbuild. Delete.

### 4.3 TypeScript configuration is stale

- `"target": "ES2020", // Node.js 14` — but `engines.node` is `>=20` and CI tests
  20/22/24. The comment is wrong and the target is needlessly old; ES2022 is safe.
- `"jsx": "react"` is the classic transform. React 19 emits
  _"Your app (or one of its dependencies) is using an outdated JSX transform"_ at
  runtime — I saw this warning during testing. Switching to `"jsx": "react-jsx"`
  silences it and lets the seven `import React from "react"` lines go away.
- `noUncheckedIndexedAccess` is off. Turning it on would have made every
  `gameBoards[0]` and `sample()`'s `input[pos]` a compile error, i.e. it would
  have surfaced 1.1 and 1.3 statically.

### 4.4 ESLint config uses compatibility shims

`eslint.config.mjs` pulls `eslint:recommended` and
`plugin:@typescript-eslint/recommended` through `FlatCompat`. Both ship native
flat configs now (`js.configs.recommended`, `tseslint.configs.recommended`),
which would remove the `@eslint/eslintrc` dependency and the
`__dirname` boilerplate.

### 4.5 Build and CI nits

- The `Makefile`'s `dist/cli.js:` rule has no prerequisites, so make treats an
  existing (possibly stale) `dist/cli.js` as up to date and skips `yarn build`.
  Depend on the sources, or make it `.PHONY`.
- `make test-npx-node-*` runs `npm version --no-git-tag-version 0.0.0-testing`,
  which rewrites `package.json` in the working tree. It happens to run after
  `yarn prettier --check .` in CI, so nothing breaks — but the workflow now
  depends on step ordering for correctness.

---

## Suggested order of work

1. Fix 1.1 — add `guessesUsed` to `GameState` and read the guess count from it.
2. Add reducer tests, including the two-board scenario above.
3. Floor the blank-row count (1.2) and validate CLI flags (1.3).
4. Move `GameAction` out of `ui.tsx` (2.1).
5. Wire up the React ESLint plugins (4.1); fix what they report.
6. Delete `src/multi-board.ts` and `babel.config.js` (4.2).
7. Fix `expectEqual`'s argument order (§3).
8. Modernize tsconfig — `react-jsx`, ES2022, `noUncheckedIndexedAccess` (4.3).
