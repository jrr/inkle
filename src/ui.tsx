import React, { FC, useReducer, useState } from "react";
import { Box, Newline, Spacer, useApp, useInput, Text } from "ink";
import { GameBoard } from "./game-board";
import { reducer } from "./reducer";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import { TitleText } from "./title-text";
import { deriveGameColors } from "./game-colors";
import { newGame } from "./game-states";

export type GameAction =
  | { action: "input-letter"; letter: string }
  | { action: "submit-guess" }
  | { action: "backspace" };

const App: FC = () => {
  const { exit } = useApp();

  const [x, y] = useStdoutDimensions();

  const [gameState, dispatch] = useReducer(reducer, newGame());

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
