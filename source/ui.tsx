import React, { FC, useReducer, useState } from "react";
import { Box, Newline, Spacer, Text, useApp, useInput } from "ink";
import { GameBoard } from "./game-board";
import { GameState } from "./types";
import { reducer } from "./reducer";

const initialState: GameState = {
  guessedRows: [
    {
      letters: [
        { color: "gray", letter: "F" },
        { color: "gray", letter: "L" },
        { color: "gray", letter: "O" },
        { color: "yellow", letter: "A" },
        { color: "yellow", letter: "T" },
      ],
    },
    {
      letters: [
        { color: "green", letter: "S" },
        { color: "green", letter: "T" },
        { color: "green", letter: "A" },
        { color: "yellow", letter: "R" },
        { color: "gray", letter: "R" },
      ],
    },
  ],
  currentRow: "JKL",
};
export type GameAction =
  | { action: "input-letter"; letter: string }
  | { action: "submit-guess" }
  | { action: "backspace" };
const App: FC = () => {
  const { exit } = useApp();

  const [gameState, dispatch] = useReducer(reducer, initialState);
  useInput((input, key) => {
    if (key.escape) {
      exit();
    }
    if (input.length == 1) {
      let c = input.toUpperCase();
      if (c >= "A" && c <= "Z") {
        dispatch({ action: "input-letter", letter: c });
      }
    }
    if (key.return) {
      dispatch({ action: "submit-guess" });
    }
    if (key.backspace || key.delete) {
      dispatch({ action: "backspace" });
    }
  });
  return (
    <>
      <Box
        flexDirection="column"
        alignItems="center"
        minHeight={12}
        justifyContent="space-around"
      >
        <Box>
          <Text color="#fff" backgroundColor="green">
            INKLE
          </Text>
        </Box>
        <Box borderStyle="round" borderColor="green">
          <GameBoard gameState={gameState} />
        </Box>
      </Box>
    </>
  );
};

module.exports = App;
export default App;
