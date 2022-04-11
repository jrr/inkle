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
    5 -
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
        <React.Fragment key="current-row">
          <Text>{spaceString(gameState.currentRow)}</Text>
          <Newline />
        </React.Fragment>
      )}
      {numBlankRows > 0 &&
        [...Array(numBlankRows)].map((_, i) => (
          <React.Fragment key={`blank-${i}`}>
            <Text>{"         "}</Text>
            <Newline />
          </React.Fragment>
        ))}
    </Text>
  );
};
