import { Button, Center, Grid, GridItem, HStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Game } from "../api/Game";
import { NewPileMenu } from "../components/NewPileMenu";
import { Pile } from "../components/Pile";
import { useSocket } from "../contexts/provider";
import { AddDeckEvent, DealEvent, MoveCardEvent } from "../events/GameEvents";

export type Card = {
  id: string;
  value: string;
};

type Props = {
  game: Game;
};

export function Lobby({ game }: Props) {
  const { send: addDeck } = useSocket<AddDeckEvent>("addDeck");
  const { send: moveCard } = useSocket<MoveCardEvent>("moveCard");
  const { send: dealCards } = useSocket<DealEvent>("deal");

  const handId = useMemo(
    () => game.players[game.players.length - 1].handId,
    []
  );
  const playerId = useMemo(() => game.players[game.players.length - 1].id, []);

  const remotePiles = game.piles;

  const playerPileIds = useMemo(
    () => game.players.map((player) => player.handId),
    [game]
  );

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list or into same pile
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    const srcPileId = parseInt(source.droppableId);
    const destPileId = parseInt(destination.droppableId);

    const card = game.piles[srcPileId].cards[source.index];
    console.log(source, destination);
    console.log(card);

    moveCard({
      code: game.code,
      srcPileId,
      destPileId,
      card,
    });
  };

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
            {game.players
              .filter((player) => handId !== player.handId)
              .map((player) => (
                <Pile
                  cards={remotePiles[player.handId].cards}
                  pileId={`${player.handId}`}
                  name={player.name}
                  isPlayerHand
                />
              ))}
          </HStack>
        </GridItem>
        <GridItem rowSpan={4} colSpan={1} alignItems="center" maxH="50vh">
          <Center h="100%">
            <HStack wrap="wrap" maxH="100%" justifyContent="space-evenly">
              {/* <Button
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
              </Button> */}
              <NewPileMenu
                onSubmit={(e) =>
                  addDeck({
                    ...e,
                    code: game.code,
                  })
                }
              />
            </HStack>
            <HStack>
              {remotePiles &&
                remotePiles
                  .map((p, i) => i)
                  .filter((i) => !playerPileIds.includes(i))
                  .map((i) => (
                    <Pile
                      cards={remotePiles[i].cards}
                      pileId={`${i}`}
                      name={i === 0 ? "Pick up" : "Discard"}
                      isFaceUp={remotePiles[i].isFaceUp}
                    />
                  ))}
            </HStack>
          </Center>
        </GridItem>
        <GridItem rowSpan={1} colSpan={1} maxH="8em">
          {remotePiles[handId] && (
            <Pile
              cards={remotePiles[handId].cards}
              pileId={`${handId}`}
              name={game.players[playerId].name}
              isFaceUp
              isSpread
              isPlayerHand
            />
          )}
        </GridItem>
      </Grid>
      {/* TODO: make it a modal or something not hardcoded and maybe by the pile :) */}
      <Button
        onClick={() =>
          dealCards({ code: game.code, handSize: 5, srcPileId: 2 })
        }
      >
        Deal
      </Button>
    </DragDropContext>
  );
}
