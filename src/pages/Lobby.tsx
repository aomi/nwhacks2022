import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Game } from "../api/Game";
import { NewPileMenu } from "../components/NewPileMenu";
import { Pile } from "../components/Pile";
import { useSocket } from "../contexts/provider";
import { AddDeckEvent } from "../events/GameEvents";
import { move, shuffleArray } from "../utils/gameLogic";

import { DECK_TYPES } from "../enums/SharedEnums";

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
  game: Game;
};

export function Lobby({ game }: Props) {
  const [piles, setPiles] = useState<Card[][]>([]);
  const { send: addDeck } = useSocket<AddDeckEvent>("addDeck");

  useEffect(() => {
    setPiles(game.players.map(() => []));
  }, [game.players]);

  const remotePiles = game.piles;

  const playerPiles = useMemo(
    () => piles.slice(1, game.players.length),
    [piles]
  );
  const remainingPiles = useMemo(
    () => piles.slice(game.players.length),
    [piles]
  );

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
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid
        minW="100vh"
        maxH="100vh"
        bgColor="green.300"
        templateRows="repeat(6, 1fr)"
        templateColumns="repeat(1, 1fr)"
        py="6"
      >
        <GridItem colSpan={1} rowSpan={1} h="fit-content" maxH="8em">
          <HStack justifyContent="space-evenly" minW="100vh" wrap="wrap">
            {playerPiles.map((pile, i) => (
              <Pile
                cards={[]}
                pileId={`${i + 1}`}
                name={game.players[i + 1].name}
                isPlayerHand
              />
            ))}
          </HStack>
        </GridItem>
        <GridItem rowSpan={4} colSpan={1} alignItems="center" maxH="50vh">
          <Center h="100%">
            <HStack wrap="wrap" maxH="100%" justifyContent="space-evenly">
              <Button
                onClick={() =>
                  addDeck({
                    deckType: DECK_TYPES.STANDARD,
                    isFaceUp: true,
                    code: game.code,
                  })
                }
                h="7em"
                w="5.5em"
              >
                add a pile
              </Button>
              <NewPileMenu />
              {remainingPiles.length > 0 &&
                remainingPiles.map((pile, i) => (
                  <Pile
                    cards={[]}
                    pileId={`${i + game.players.length}`}
                    name={i === 0 ? "Pick up" : "Discard"}
                    isFaceUp={i === 0}
                  />
                ))}
            </HStack>
            <HStack>
              {remotePiles &&
                remotePiles.map((pile, i) => (
                  <Pile
                    cards={pile.cards}
                    pileId={`${i + game.players.length}`}
                    name={i === 0 ? "Pick up" : "Discard"}
                    isFaceUp={pile.isFaceUp}
                  />
                ))}
            </HStack>
          </Center>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} mavH="8em">
          {piles[0] && (
            <Pile
              cards={[]}
              pileId="0"
              name="Player 1"
              isFaceUp
              isSpread
              isPlayerHand
            />
          )}
        </GridItem>
      </Grid>
    </DragDropContext>
  );
}
