import { GameState } from "./types";

export type GameColors = {
  largeTitle: string[];
  smallTitle: string;
  boardBorder: string;
};

const stringSum = (s: string) =>
  s
    .split("")
    .map((c) => c.charCodeAt(0))
    .reduce((a, b) => a + b);

function numbersFromGameState(state: GameState): [number, number] {
  const s =
    state.solution +
    state.guessedRows.flatMap((r) => r.letters.flatMap((l) => l.letter));
  const s1 = s.substring(0, s.length / 2);
  const s2 = s.substring(s.length / 2);
  return [stringSum(s1), stringSum(s2)];
}

const TITLE_COLORS = ["yellow", "green", "gray", "white"];

function colorN([n1, n2]: [number, number]): [string, string] {
  const color1 = TITLE_COLORS[n1 % TITLE_COLORS.length];
  const remainingColors = TITLE_COLORS.filter((c) => c != color1);
  const color2 = remainingColors[n2 % remainingColors.length];
  if (color1 == undefined || color2 == undefined) {
    throw new Error("Color selection error");
  }
  return [color1, color2];
}

export function deriveGameColors(state: GameState): GameColors {
  const [c1, c2] =
    state.guessedRows.length == 0
      ? ["green", "yellow"]
      : colorN(numbersFromGameState(state));
  return {
    boardBorder: { guessing: "white", loss: "red", win: "green" }[state.status],
    largeTitle: state.status == "loss" ? ["black", "red"] : [c1, c2],
    smallTitle: state.status == "loss" ? "red" : c1,
  };
}
