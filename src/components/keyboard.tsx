import { Box, Text } from "ink";
import React from "react";
import { GameBoardState, GuessedLetter } from "../types.js";
const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
type Props = {
  gameBoard: GameBoardState;
};
export const Keyboard: React.FC<Props> = ({ gameBoard }) => {
  const keyColors = computeKeyColors(gameBoard);
  return (
    <Box
      alignItems="center"
      flexDirection="column"
      justifyContent="space-around"
    >
      {keyboardRows.map((row) => (
        <KeyboardRow key={row} row={row} keyColors={keyColors} />
      ))}
    </Box>
  );
};

const KeyboardRow: React.FC<{ row: string; keyColors: KeyColors }> = ({
  row,
  keyColors,
}) => {
  return (
    <Box>
      {[...row].map((c) => {
        return (
          <Box marginX={0.5} key={c}>
            <Text color={colorFor(keyColors, c)}>{c}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

type KeyColor = "green" | "yellow" | "gray";
type KeyColors = Record<KeyColor, string>;

function computeKeyColors(gameBoard: GameBoardState): KeyColors {
  const allGuesses = gameBoard.guessedRows.flatMap((gr) => gr.letters);
  return {
    gray: lettersForColor(allGuesses, "gray"),
    green: lettersForColor(allGuesses, "green"),
    yellow: lettersForColor(allGuesses, "yellow"),
  };
}

function colorFor(keyColors: KeyColors, c: string): string {
  const theColors: KeyColor[] = ["green", "yellow", "gray"];

  for (const color of theColors) {
    if (keyColors[color].includes(c)) {
      return color;
    }
  }
  return "whiteBright";
}

const lettersForColor = (allGuesses: GuessedLetter[], color: string) =>
  allGuesses
    .filter((g) => g.color == color)
    .map((g) => g.letter)
    .join();
