import React, { FC } from "react";
import { Box, Text } from "ink";
import BigText from "ink-big-text";
import { GameColors } from "../game-colors";

export const TitleText: FC<{
  large: boolean;
  title: string;
  colors: GameColors;
}> = ({ large, title, colors }) =>
  /*
todo: is there a better way to make this adaptive to the available space? (rather than the parent deciding whether it's in 'large' or 'small' mode)
*/
  large ? (
    <BigText colors={colors.largeTitle} text={title} font="block" />
  ) : (
    <Box>
      <Text color={colors.smallTitle}>I N K L E</Text>
    </Box>
  );
