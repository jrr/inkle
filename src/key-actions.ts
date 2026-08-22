import { GameAction } from "./types.js";

/**
 * The parts of ink's Key that the game looks at. Declared structurally rather
 * than importing ink's Key so tests can describe a keypress in a few fields.
 */
export type KeyPress = {
  escape?: boolean;
  return?: boolean;
  backspace?: boolean;
  delete?: boolean;
  ctrl?: boolean;
};

/**
 * What a keypress means to the game, or undefined for keys it ignores.
 * Quitting the app is deliberately not here: it ends the process rather than
 * moving the game along, so ui.tsx handles escape itself.
 */
export function keyToAction(
  input: string,
  key: KeyPress,
): GameAction | undefined {
  if (key.ctrl) {
    // A ctrl chord is never a letter to type. Checking this first is what
    // stops ctrl+Q from both typing a 'Q' and giving up.
    return input == "q" ? { action: "give-up" } : undefined;
  }
  if (key.return) {
    return { action: "submit-guess" };
  }
  if (key.backspace || key.delete) {
    return { action: "backspace" };
  }
  const letter = input.toUpperCase();
  if (input.length == 1 && letter >= "A" && letter <= "Z") {
    return { action: "input-letter", letter };
  }
  return undefined;
}
