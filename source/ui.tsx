import React, { FC } from "react";
import { Box, Newline, Spacer, Text } from "ink";
import { GameBoard } from "./game-board";
import { GameState } from "./types";

const gameState: GameState = {
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
const App: FC = () => (
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

module.exports = App;
export default App;
