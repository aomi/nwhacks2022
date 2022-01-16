import { Box, VStack, Text, HStack, Button } from "@chakra-ui/react";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

type Props = {
  cards: { value: string; id: string }[];
  pileId: string;
  isFaceUp?: boolean;
  isSpread?: boolean;
  name: string;
  shuffle?: (cards: { value: string; id: string }[]) => void;
};

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  margin: `0 0 ${8}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen !important" : "grey !important",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
});

export function Pile({
  cards,
  name,
  pileId,
  isSpread,
  isFaceUp,
  shuffle,
}: Props) {
  const topCard = cards[cards.length - 1];

  const shuffleCards = () => {
    shuffle(cards);
  };

  return (
    <VStack>
      <Droppable droppableId={pileId}>
        {(provided, snapshot) => (
          <HStack
            ref={provided.innerRef}
            style={{
              backgroundColor: "black",
              padding: "5px",
              ...getListStyle(snapshot.isDraggingOver),
            }}
          >
            {isSpread
              ? cards.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        h="7em"
                        w="5.5em"
                        my="10px"
                        mx="5px"
                        borderRadius={6}
                        bgColor="white"
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {isFaceUp ? item.id : "back of card"}
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
                    {(provided, snapshot) => (
                      <Box
                        h="7em"
                        w="5.5em"
                        my="10px"
                        mx="5px"
                        borderRadius={6}
                        bgColor="white"
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {isFaceUp ? topCard.id : "back of card"}
                      </Box>
                    )}
                  </Draggable>
                )}
            {provided.placeholder}
          </HStack>
        )}
      </Droppable>
      <Text>{name}</Text>
      <Button onClick={shuffleCards}>Shuffle</Button>
      <Text>cards: {cards.map((card) => card.value + ", ")}</Text>
    </VStack>
  );
}
