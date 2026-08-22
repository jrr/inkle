import { Box, useApp, useInput } from "ink";
import React, { FC, useEffect, useReducer } from "react";
import { GameBoard } from "./components/game-board.js";
import { Keyboard } from "./components/keyboard.js";
import { StatusText } from "./components/status-text.js";
import { TitleText } from "./components/title-text.js";
import { deriveGameColors } from "./game-colors.js";
import { keyToAction } from "./key-actions.js";
import { pickSolutions } from "./game-logic.js";
import { newGame } from "./state/game-states.js";
import { reducer } from "./state/reducer.js";
import { GameState } from "./types.js";
import { useStdoutDimensions } from "./use-stdout-dimensions.js";

const App: FC<{
  initialState?: GameState;
  numBoards?: number;
  numGuesses?: number;
}> = ({ initialState, numBoards, numGuesses }) => {
  const { exit } = useApp();

  const [x, y] = useStdoutDimensions();

  // Lazy init: the initial-state argument is re-evaluated on every render, so
  // picking the words here rather than inline avoids drawing throwaway
  // solutions on each keystroke.
  const [gameState, dispatch] = useReducer(
    reducer,
    initialState,
    (initial) =>
      initial ??
      newGame({ solutions: pickSolutions(numBoards ?? 1), numGuesses }),
  );

  useEffect(() => {
    if (gameState.exitPlease) {
      exit();
    }
  }, [gameState.exitPlease]);

  useInput(
    (input, key) => {
      if (key.escape) {
        exit();
        return;
      }
      const action = keyToAction(input, key);
      if (action) {
        dispatch(action);
      }
    },
    { isActive: gameState.exitPlease != true },
  );
  const colors = deriveGameColors(gameState);

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      height={y}
      justifyContent="space-around"
    >
      <TitleText large={x > 45 && y > 20} title="INKLE" colors={colors} />

      <Box flexDirection="row">
        {gameState.gameBoards.map((board, i) => {
          return (
            <Box
              flexDirection="column"
              marginX={1}
              alignItems={"center"}
              key={`${i}-${board.solution}`}
            >
              <Box
                borderStyle="round"
                borderColor={colors.boardBorder}
                flexShrink={2}
              >
                <GameBoard gameBoardState={board} gameState={gameState} />
              </Box>
              <Keyboard gameBoard={board}></Keyboard>
            </Box>
          );
        })}
      </Box>

      <StatusText gameState={gameState} />
    </Box>
  );
};

export default App;
