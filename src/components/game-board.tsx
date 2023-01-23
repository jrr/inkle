import { Newline, Text } from "ink";
import React, { Fragment } from "react";
import { GameBoardState, GameState } from "../types.js";
import { spaceString } from "../util.js";
import { BoardRow } from "./board-row.js";
import { computeDisplayRows, DisplayRow } from "./display-rows.js";

export const GameBoard: React.FC<{
  gameBoardState: GameBoardState;
  gameState: GameState;
}> = ({ gameBoardState, gameState }) => {
  const rows = computeDisplayRows(gameBoardState, gameState);

  return (
    <Text>
      {rows.map((row, i) => {
        const isLastRow = i == rows.length - 1;
        return (
          <Fragment key={i}>
            <GameBoardRow row={row} />
            {!isLastRow && <Newline />}
          </Fragment>
        );
      })}
    </Text>
  );
};

const GameBoardRow: React.FC<{ row: DisplayRow }> = ({ row }): JSX.Element => {
  switch (row.rowType) {
    case "guessed":
      return <BoardRow guessedRow={row} />;
    case "guessing":
      return <Text>{spaceString(row.currentRow)}</Text>;
    case "blank":
      return <Text>{spaceString("     ")}</Text>;
  }
};
