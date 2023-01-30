import { Box, Text } from "ink";
import React from "react";
import { KEY_NEW_GAME, KEY_QUIT } from "../constants.js";
import { GameState } from "../types.js";

function notesForState(gameState: GameState): [string, string] {
  switch (gameState.status) {
    case "win":
      return [
        `🏆 You win! 🏆`,
        `Press '${KEY_NEW_GAME}' for a new game, or '${KEY_QUIT}' to quit.`,
      ];
    case "loss":
      if (gameState.gameBoards.length == 1) {
        return [
          `The word was ${gameState.gameBoards[0].solution}. Better luck next time.`,
          `Press '${KEY_NEW_GAME}' for a new game, or '${KEY_QUIT}' to quit.`,
        ];
      }
      return [
        `The words were ${gameState.gameBoards
          .map((b) => b.solution)
          .join(",")}. Better luck next time.`,
        `Press '${KEY_NEW_GAME}' for a new game, or '${KEY_QUIT}' to quit.`,
      ];
  }
  if (gameState.note) {
    return [gameState.note, ""];
  }
  return ["", ""];
}

export const StatusText: React.FC<{ gameState: GameState }> = ({
  gameState,
}) => {
  const [note1, note2] = notesForState(gameState);

  return (
    <Box minHeight={2} alignItems="center" flexDirection="column">
      <Text>{note1}</Text>
      <Text color="gray">{note2}</Text>
    </Box>
  );
};
