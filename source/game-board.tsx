import React from "react";
import { Box, Newline, Spacer, Text } from "ink";

const rows = ["ASDFG", "QWERT", "ZXCVB", "ASD  ", "     ", "     "];
export const GameBoard: React.FC = () => {
  return (
    <Text>
      {rows.map((value, idx) => (
        <React.Fragment key={idx}>
          <Text>{value}</Text>
          {idx != rows.length - 1 && <Newline />}
        </React.Fragment>
      ))}
    </Text>
  );
};
