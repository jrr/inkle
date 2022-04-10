import React, { FC } from "react";
import { Box, Newline, Spacer, Text } from "ink";
import { GameBoard } from "./game-board";

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
        <GameBoard />
      </Box>
    </Box>
  </>
);

module.exports = App;
export default App;
