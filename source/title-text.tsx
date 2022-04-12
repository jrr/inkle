import React, { FC } from "react";
import { Box, Text } from "ink";
import BigText from "ink-big-text";

export const TitleText: FC<{
  large: boolean;
  title: string;
  titleColors: string[];
}> = ({ large, title, titleColors }) =>
  large ? (
    <BigText colors={titleColors} text={title} font="block" />
  ) : (
    <Box>
      <Text color={titleColors[1]}>I N K L E</Text>
    </Box>
  );
