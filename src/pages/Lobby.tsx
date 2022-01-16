import { Box, Button, HStack } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Pile } from "../components/Pile";
import { move, shuffleArray } from "../utils/gameLogic";

export type Card = {
  id: string;
  value: string;
};

// fake data generator, remove once cards loaded in
const getItems = (count: number, offset = 0): Card[] =>
  Array.from({ length: count }, (_, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    value: `item ${k + offset}`,
  }));

type Props = {
  players: string[];
  gameName: string;
};

export function Lobby({ players, gameName }: Props) {
  const [piles, setPiles] = useState<Card[][]>([]);

  // set piles for each player
  useEffect(() => {
    players.forEach(() => {
      console.log("yo");
      setPiles([...piles, getItems(5, 5 * piles.length)]);
    });
  }, [players]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list or into same pile
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    const newResult = move(
      piles[source.droppableId],
      piles[destination.droppableId],
      source,
      destination,
      piles
    );

    setPiles(newResult);
  };

  const shufflePile = useCallback(
    (array: Card[]) => {
      const pilesClone = Array.from(piles);
      const idx = piles.indexOf(array);
      pilesClone[idx] = shuffleArray(array);
      setPiles(pilesClone);
    },
    [piles, setPiles]
  );

  const onClick = useCallback(() => {
    setPiles([...piles, getItems(5, 5 * piles.length)]);
  }, [piles, setPiles]);

  return (
    <Box minW="100vh" minH="100vh" bgColor="green.300">
      <Button onClick={onClick}>add a pile</Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <HStack spacing="10" minW="100vh" wrap="wrap">
          {piles.map((pile, i) => (
            <Pile
              cards={pile}
              pileId={`${i}`}
              name={i === 0 ? "Player 1" : "Discard"}
              isSpread={i === 0}
              isFaceUp={i === 0}
              shuffle={shufflePile}
            />
          ))}
        </HStack>
      </DragDropContext>
    </Box>
  );
}
