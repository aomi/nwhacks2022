import { Box, VStack, Text, HStack, Image } from "@chakra-ui/react";
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
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (
  isDraggingOver: boolean,
  items: number,
  isSpread: boolean
) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  justifyContent: "space-between",
  width: isSpread ? items * 88 + 50 * items : "fit-content", // do not ask
  minWidth: "115px",
  maxWidth: !isSpread ? "115px" : "100000px",
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

  return (
    <VStack>
      <p>{`pileId: ${pileId}`}</p>
      <Droppable droppableId={pileId} direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            // height="142px"
            // minW="108px"
            // w="100%"
            style={{
              backgroundColor: "black",
              padding: "5px",
              height: "142px",
              ...getListStyle(snapshot.isDraggingOver, cards.length, isSpread),
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
                        my="5px"
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
                        {isFaceUp ? (
                          <Image
                            src={
                              process.env.PUBLIC_URL +
                              `/assets/cards/${item.suit.toLowerCase()}/${
                                item.value + 1
                              }.png`
                            }
                            alt={`The ${item.value} of ${item.suit}`}
                          />
                        ) : (
                          <Image
                            src={
                              process.env.PUBLIC_URL + "/assets/cards/back.png"
                            }
                            alt="The back of a playing card"
                          />
                        )}
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
                        my="5px"
                        ml="8px"
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
                        {isFaceUp ? (
                          <Image
                            src={
                              process.env.PUBLIC_URL +
                              `/assets/cards/${topCard.suit.toLowerCase()}/${
                                topCard.value + 1
                              }.png`
                            }
                            alt={`The ${topCard.value} of ${topCard.suit}`}
                          />
                        ) : (
                          <Image
                            src={
                              process.env.PUBLIC_URL + "/assets/cards/back.png"
                            }
                            alt="The back of a playing card"
                          />
                        )}
                      </Box>
                    )}
                  </Draggable>
                )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Text>{name}</Text>
      {/* <Text>amount: {cards.map(({ id }) => id + ", ")}</Text> */}
    </VStack>
  );
}
