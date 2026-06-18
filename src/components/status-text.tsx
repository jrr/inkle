import { Box, Text } from "ink";
import React, { useEffect, useState } from "react";
import { GIVE_UP_HINT_DELAY_MS, KEY_NEW_GAME, KEY_QUIT } from "../constants.js";
import { GameState } from "../types.js";

function notesForState(gameState: GameState): [string, string, boolean] {
  switch (gameState.status) {
    case "win":
      return [
        `🏆 You win! 🏆`,
        `Press '${KEY_NEW_GAME}' for a new game, or '${KEY_QUIT}' to quit.`,
        false,
      ];
    case "loss":
      if (gameState.gameBoards.length == 1) {
        return [
          `The word was ${gameState.gameBoards[0].solution}. Better luck next time.`,
          `Press '${KEY_NEW_GAME}' for a new game, or '${KEY_QUIT}' to quit.`,
          false,
        ];
      }
      return [
        `The words were ${gameState.gameBoards
          .map((b) => b.solution)
          .join(",")}. Better luck next time.`,
        `Press '${KEY_NEW_GAME}' for a new game, or '${KEY_QUIT}' to quit.`,
        false,
      ];
  }
  const giveUpHint = "Ctrl+Q to give up";
  if (gameState.note) {
    return [gameState.note, giveUpHint, true];
  }
  return ["", giveUpHint, true];
}

export const StatusText: React.FC<{ gameState: GameState }> = ({
  gameState,
}) => {
  const [note1, note2, note2IsGiveUpHint] = notesForState(gameState);

  const [hintReady, setHintReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHintReady(true), GIVE_UP_HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const showNote2 = !note2IsGiveUpHint || hintReady;

  return (
    <Box minHeight={2} alignItems="center" flexDirection="column">
      <Text>{note1}</Text>
      <Text color="gray">{showNote2 ? note2 : ""}</Text>
    </Box>
  );
};
