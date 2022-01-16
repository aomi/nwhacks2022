import { Box, VStack, Text, HStack, Button } from "@chakra-ui/react";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Card } from "../api/gameBoardObjects/Card";

type Props = {
  cards: Card[];
  pileId: string;
  isFaceUp?: boolean;
  isSpread?: boolean;
  isPlayerHand?: boolean;
  name: string;
  shuffle?: (cards: Card[]) => void;
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
  isPlayerHand,
  isFaceUp,
  shuffle,
}: Props) {
  const topCard = cards[cards.length - 1];

  const shuffleCards = () => {
    shuffle(cards);
  };

  return (
    <VStack>
      <p>{`pileId: ${pileId}`}</p>
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
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
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
                        {isFaceUp
                          ? `${item.value} ${item.suit}`
                          : "back of card"}
                      </Box>
                    )}
                  </Draggable>
                ))
              : topCard && (
                  <Draggable
                    key={topCard.id}
                    draggableId={topCard.id.toString()}
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
                        {isFaceUp
                          ? `${topCard.value} ${topCard.suit}`
                          : "back of card"}
                      </Box>
                    )}
                  </Draggable>
                )}
            {provided.placeholder}
          </HStack>
        )}
      </Droppable>
      <Text>{name}</Text>
      {/* {isPlayerHand && <Button onClick={shuffleCards}>Shuffle</Button>} */}
      {/* <Text>amount: {cards.map(({ id }) => id + ", ")}</Text> */}
    </VStack>
  );
}
