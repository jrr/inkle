import { Newline, Text } from "ink";
import React from "react";
import { NUM_GUESSES } from "../constants.js";
import { onFinalGuess } from "../state/reducer.js";
import { GameState } from "../types.js";
import { spaceString } from "../util.js";
import { BoardRow } from "./board-row.js";

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
          isLastRow={i == NUM_GUESSES - 1}
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
