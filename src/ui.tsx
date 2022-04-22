import { Box, Text, useApp, useInput } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import React, { FC, useEffect, useReducer } from "react";
import { GameBoard } from "./components/game-board";
import { TitleText } from "./components/title-text";
import { deriveGameColors } from "./game-colors";
import { newGame } from "./state/game-states";
import { reducer } from "./state/reducer";

export type GameAction =
  | { action: "input-letter"; letter: string }
  | { action: "submit-guess" }
  | { action: "backspace" };

const App: FC = () => {
  const { exit } = useApp();

  const [x, y] = useStdoutDimensions();

  const [gameState, dispatch] = useReducer(reducer, newGame());

  useEffect(() => {
    if (gameState.exitPlease) {
      exit();
    }
  }, [gameState.exitPlease]);

  useInput((input, key) => {
    if (key.escape) {
      exit();
    }
    if (input.length == 1) {
      const c = input.toUpperCase();
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

      <Box minHeight={2} alignItems="center" flexDirection="column">
        <Text>{gameState.note1}</Text>
        <Text color="gray">{gameState.note2}</Text>
      </Box>
    </Box>
  );
};

export default App;
