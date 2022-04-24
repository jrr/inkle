import React, { FC, useEffect, useReducer } from "react";
import { Box, Newline, Text, useApp, useInput, useStdout } from "ink";
import { spaceString } from "../util";
import { GameState } from "../types";
import { stringify } from "querystring";
const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
type Props = {
  gameState: GameState;
};
export const Keyboard: React.FC<Props> = (props) => {
  const keyColors = computeKeyColors(props.gameState);
  return (
    <Box
      alignItems="center"
      flexDirection="column"
      justifyContent="space-around"
    >
      {keyboardRows.map((row) => (
        <KeyboardRow row={row} keyColors={keyColors} />
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
      {[...row].map((c, i) => {
        return (
          <Box marginX={0.5}>
            <Text color={colorFor(keyColors, c)}>{c}</Text>
          </Box>
        );
      })}
      {/* <Text>{spaceString(row)}</Text> */}
    </Box>
  );
};
type KeyColor = "green" | "yellow" | "gray";
type KeyColors = { green: string; yellow: string; gray: string };
function computeKeyColors(gameState: GameState): KeyColors {
  const x = gameState.guessedRows.flatMap((gr) => gr.letters);
  const gray = x // todo: groupBy
    .filter((f) => f.color == "gray")
    .map((f) => f.letter)
    .join();
  const green = x
    .filter((f) => f.color == "green")
    .map((f) => f.letter)
    .join();
  const yellow = x
    .filter((f) => f.color == "yellow")
    .map((f) => f.letter)
    .join();
  return { gray, green, yellow };
}
function colorFor(keyColors: KeyColors, c: string): string {
  const theColors = ["green", "yellow", "gray"];

  for (const color of theColors) {
    if (keyColors[color as KeyColor]?.includes(c)) {
      return color;
    }
  }
  return "white";
}
