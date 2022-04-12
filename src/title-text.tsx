import React, { FC } from "react";
import { Box, Text } from "ink";
import BigText from "ink-big-text";
import { GameColors } from "./game-colors";

export const TitleText: FC<{
  large: boolean;
  title: string;
  colors: GameColors;
}> = ({ large, title, colors }) =>
  large ? (
    <BigText colors={colors.largeTitle} text={title} font="block" />
  ) : (
    <Box>
      <Text color={colors.smallTitle}>I N K L E</Text>
    </Box>
  );
