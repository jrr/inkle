import React, { FC, useReducer, useState } from "react";
import { Box, Newline, Spacer, useApp, useInput, Text } from "ink";
import { GameBoard } from "./game-board";
import { GameState } from "./types";
import { reducer } from "./reducer";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import { TitleText } from "./title-text";
import { pickSolution } from "./game-logic";
import { deriveGameColors } from "./game-colors";

const initialState: GameState = {
  status: "guessing",
  guessedRows: [],
  currentRow: "",
  solution: pickSolution(),
};

// todo: make this accessible behind command-line flag
const testState: GameState = {
  status: "guessing",
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
  solution: "OATER",
};

export type GameAction =
  | { action: "input-letter"; letter: string }
  | { action: "submit-guess" }
  | { action: "backspace" };

const App: FC = () => {
  const { exit } = useApp();

  const [x, y] = useStdoutDimensions();

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
  const colors = deriveGameColors(gameState);

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      height={y}
      justifyContent="space-around"
    >
      <TitleText large={x > 45 && y > 16} title="INKLE" colors={colors} />

      <Box borderStyle="round" borderColor={colors.boardBorder}>
        <GameBoard gameState={gameState} />
      </Box>

      <Text>{gameState.note || " "}</Text>
    </Box>
  );
};

export default App;
