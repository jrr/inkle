import { describe, it } from "vitest";
import { keyToAction } from "./key-actions.js";
import { expectEqual } from "./test-util.js";

/** No modifier or special key pressed. */
const plain = {};

describe("keyToAction", () => {
  describe("letters", () => {
    it("types a lowercase letter as uppercase", () => {
      expectEqual(keyToAction("a", plain), {
        action: "input-letter",
        letter: "A",
      });
    });

    it("types an uppercase letter as-is", () => {
      expectEqual(keyToAction("Z", plain), {
        action: "input-letter",
        letter: "Z",
      });
    });

    it("accepts every letter of the alphabet, in either case", () => {
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (const letter of alphabet) {
        expectEqual(keyToAction(letter, plain), {
          action: "input-letter",
          letter,
        });
        expectEqual(keyToAction(letter.toLowerCase(), plain), {
          action: "input-letter",
          letter,
        });
      }
    });

    it("ignores anything that is not a letter", () => {
      for (const input of ["1", " ", "-", "?", "é", "🙂"]) {
        expectEqual(keyToAction(input, plain), undefined);
      }
    });

    it("ignores multi-character input, such as a paste", () => {
      expectEqual(keyToAction("abc", plain), undefined);
      expectEqual(keyToAction("", plain), undefined);
    });
  });

  describe("editing keys", () => {
    it("submits on return", () => {
      expectEqual(keyToAction("", { return: true }), {
        action: "submit-guess",
      });
    });

    it("deletes on backspace", () => {
      expectEqual(keyToAction("", { backspace: true }), {
        action: "backspace",
      });
    });

    it("deletes on delete", () => {
      expectEqual(keyToAction("", { delete: true }), { action: "backspace" });
    });
  });

  describe("ctrl chords", () => {
    it("gives up on ctrl+Q", () => {
      expectEqual(keyToAction("q", { ctrl: true }), { action: "give-up" });
    });

    it("does not also type a Q on ctrl+Q", () => {
      // The handler used to run each check independently, so ctrl+Q both
      // typed a letter and gave up. Only the give-up should survive.
      const action = keyToAction("q", { ctrl: true });
      expectEqual(action?.action, "give-up");
    });

    it("ignores every other ctrl chord", () => {
      for (const input of ["a", "c", "n", "z"]) {
        expectEqual(keyToAction(input, { ctrl: true }), undefined);
      }
    });
  });

  describe("keys the game leaves alone", () => {
    it("ignores escape, which quits the app rather than moving the game", () => {
      expectEqual(keyToAction("", { escape: true }), undefined);
    });
  });
});
