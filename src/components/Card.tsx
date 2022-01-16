import { Box } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";

type Props = {
  id: string;
  ref: any;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps?: DraggableProvidedDragHandleProps;
};

export function Card({ props, children }: PropsWithChildren<any>) {
  return (
    <Box h="12em" w="9em" borderRadius={6} bgColor="white" {...props}>
      {children}
    </Box>
  );
}
