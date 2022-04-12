import React, { FC, useReducer, useState } from "react";
import { Box, Newline, Spacer, useApp, useInput, Text } from "ink";
import { reducer } from "./state/reducer";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import { deriveGameColors } from "./game-colors";
import { newGame } from "./state/game-states";
import { TitleText } from "./components/title-text";
import { GameBoard } from "./components/game-board";

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

      <Box minHeight={1}>
        <Text>{gameState.note}</Text>
      </Box>
    </Box>
  );
};

export default App;
