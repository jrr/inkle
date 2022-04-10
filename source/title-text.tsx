import React, { FC } from "react";
import { Box, Text } from "ink";
import BigText from "ink-big-text";
import { pickTwo } from "./util";

export const TitleText: FC<{ large: boolean; title: string }> = ({
  large,
  title,
}) =>
  large ? (
    <BigText
      colors={pickTwo(["yellow", "green", "gray", "white"])}
      text={title}
      font="block"
    />
  ) : (
    <Box>
      <Text color="#fff" backgroundColor="green">
        I N K L E
      </Text>
    </Box>
  );
