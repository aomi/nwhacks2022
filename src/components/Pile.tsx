import { Box, VStack, Text, HStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

type Props = {
  cards: { value: string; id: string }[];
  name: string;
  isFaceUp?: boolean;
  isSpread?: boolean;
};

export function Pile({ cards, name, isSpread }: Props) {
  const topCard = cards[cards.length - 1];
  return (
    <VStack>
      <Droppable droppableId={name}>
        {(provided) => (
          <HStack
            ref={provided.innerRef}
            style={{ backgroundColor: "black", padding: "5px" }}
          >
            {isSpread
              ? cards.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <Box
                        h="12em"
                        w="9em"
                        my="10px"
                        mx="5px"
                        borderRadius={6}
                        bgColor="white"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {item.id}
                      </Box>
                    )}
                  </Draggable>
                ))
              : topCard && (
                  <Draggable
                    key={topCard.id}
                    draggableId={topCard.id}
                    index={cards.length - 1}
                  >
                    {(provided) => (
                      <Box
                        h="12em"
                        w="9em"
                        my="10px"
                        mx="5px"
                        borderRadius={6}
                        bgColor="white"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {topCard.id}
                      </Box>
                    )}
                  </Draggable>
                )}
            {provided.placeholder}
          </HStack>
        )}
      </Droppable>
      <Text>cards: {cards.map((card) => card.value + ", ")}</Text>
    </VStack>
  );
}
