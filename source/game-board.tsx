import React from "react";
import { Box, Newline, Spacer, Text, Transform } from "ink";
import { BoardRow } from "./board-row";
import { GameState } from "./types";
import { spaceString } from "./util";

const rows = ["ASDFG", "QWERT", "ZXCVB", "ASD  ", "     ", "     "];
export const GameBoard: React.FC<{ gameState: GameState }> = ({
  gameState,
}) => {
  const numBlankRows =
    6 -
    (gameState.guessedRows.length + (gameState.status == "guessing" ? 1 : 0));
  return (
    <Text>
      {gameState.guessedRows.map((row, i) => (
        <BoardRow
          key={`guess-${i}`}
          guessedRow={row}
          isLastRow={i == rows.length - 1}
        />
      ))}
      {gameState.status == "guessing" && (
        <Transform transform={spaceString}>
          <Text key="current-row">{gameState.currentRow}</Text>
        </Transform>
      )}
      {numBlankRows > 0 &&
        [...Array(numBlankRows)].map((_, i) => <Newline key={`blank-${i}`} />)}
    </Text>
  );
};
