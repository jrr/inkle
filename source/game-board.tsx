import React from "react";
import { Box, Newline, Spacer, Text } from "ink";
import { BoardRow } from "./board-row";
import { GameState } from "./types";

const spaceString = (s: string) => [...s].join(" ");

const rows = ["ASDFG", "QWERT", "ZXCVB", "ASD  ", "     ", "     "];
export const GameBoard: React.FC<{ gameState: GameState }> = ({
  gameState,
}) => {
  const numBlankRows =
    6 - gameState.guessedRows.length - (gameState.currentRow == null ? 0 : 1);
  return (
    <Text>
      {gameState.guessedRows.map((row, i) => (
        <BoardRow
          key={`guess-${i}`}
          guessedRow={row}
          isLastRow={i == rows.length - 1}
        />
      ))}
      {gameState.currentRow != null && (
        <Text key="current-row">{spaceString(gameState.currentRow)}</Text>
      )}
      {[...Array(numBlankRows)].map((_, i) => (
        <Newline key={`blank-${i}`} />
      ))}
    </Text>
  );
};
