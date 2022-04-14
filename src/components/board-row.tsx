import { Newline, Text } from "ink";
import React from "react";
import { GuessedRow } from "../types";

export const BoardRow: React.FC<{
  guessedRow: GuessedRow;
  isLastRow: boolean;
}> = ({ guessedRow, isLastRow }) => {
  return (
    <>
      {guessedRow.letters.map((l, i) => (
        <React.Fragment key={i}>
          <Text color={l.color}>{l.letter}</Text>
          {i != guessedRow.letters.length - 1 && <Text> </Text>}
        </React.Fragment>
      ))}
      {!isLastRow && <Newline key={`newline`} />}
    </>
  );
};
