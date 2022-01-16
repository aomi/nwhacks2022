import { Box } from "@chakra-ui/react";
import React from "react";

type Props = {
  name: string;
};

export function Card({ name }: Props) {
  return (
    <Box h="12em" w="9em" borderRadius={6} bgColor="black" color="white">
      {name}
    </Box>
  );
}
