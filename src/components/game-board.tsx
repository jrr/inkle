import { Newline, Text } from "ink";
import React from "react";
import { NUM_GUESSES } from "../constants";
import { onFinalGuess } from "../state/reducer";
import { GameState } from "../types";
import { spaceString } from "../util";
import { BoardRow } from "./board-row";

const rows = ["ASDFG", "QWERT", "ZXCVB", "ASD  ", "     ", "     "];
export const GameBoard: React.FC<{ gameState: GameState }> = ({
  gameState,
}) => {
  const numBlankRows =
    NUM_GUESSES -
    gameState.guessedRows.length -
    (gameState.status == "guessing" ? 1 : 0);
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
          {!onFinalGuess(gameState) && <Newline />}
        </React.Fragment>
      )}
      {numBlankRows > 0 &&
        [...Array(numBlankRows)].map((_, i) => (
          <React.Fragment key={`blank-${i}`}>
            <Text>{"         "}</Text>
            {i != numBlankRows - 1 && <Newline />}
          </React.Fragment>
        ))}
    </Text>
  );
};
