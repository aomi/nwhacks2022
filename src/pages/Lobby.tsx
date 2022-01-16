import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Game } from "../api/Game";
import { NewPileMenu } from "../components/NewPileMenu";
import { Pile } from "../components/Pile";
import { useSocket } from "../contexts/provider";
import { AddDeckEvent, DealEvent, MoveCardEvent } from "../events/GameEvents";
import { ResetGameEvent } from "../events/LobbyEvents";

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
  const { send: resetGame } = useSocket<ResetGameEvent>("reset");

  const [dealAmount, setDealAmount] = useState(0);
  const handleChange = (value) => setDealAmount(value);

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
        minH="100vh"
        maxH="100vh"
        bgColor="green.300"
        style={{
          backgroundImage:
            'url("https://www.transparenttextures.com/patterns/45-degree-fabric-dark.png")',
        }}
        templateRows="repeat(6, 1fr)"
        templateColumns="repeat(8, 1fr)"
        py="6"
      >
        <GridItem colSpan={8} rowSpan={1} h="fit-content">
          {game.players.length > 1 ? (
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
          ) : (
            <VStack>
              <Text>Waiting for players</Text>
              <Spinner ml="3" />
            </VStack>
          )}
        </GridItem>
        <GridItem rowSpan={4} colSpan={1}>
          <Center h="100%" w="100%">
            <VStack
              w="100%"
              h="50%"
              justifyContent="space-evenly"
              ml="1"
              bgColor="blackAlpha.700"
              px="2"
              borderRadius={3}
            >
              <VStack p="2">
                <Text color="white" textAlign="center">
                  Send the code to your friends!
                </Text>
                <HStack>
                  <Text fontWeight="bold" color="white">
                    {`${window.location.hostname}/lobbly/${game.code}`}
                  </Text>
                </HStack>
              </VStack>
              <HStack>
                <Button
                  w="100%"
                  bgColor="blue.300"
                  _hover={{
                    bgColor: "blue.500",
                    color: "white",
                  }}
                  aria-label="Deal cards from the first deck"
                  onClick={() =>
                    dealCards({
                      code: game.code,
                      handSize: dealAmount,
                      srcPileId: remotePiles
                        .map((_, i) => i)
                        .filter((i) => !playerPileIds.includes(i))[0],
                    })
                  }
                >
                  Deal
                </Button>
                <NumberInput
                  color="white"
                  value={dealAmount}
                  onChange={handleChange}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </HStack>
              <Button
                w="100%"
                bgColor="red.300"
                _hover={{
                  bgColor: "red.500",
                  color: "white",
                }}
                aria-label="Reset the board"
                onClick={() => resetGame({ code: game.code })}
              >
                Reset
              </Button>
            </VStack>
          </Center>
        </GridItem>
        <GridItem rowSpan={4} colSpan={6} alignItems="center" maxH="50vh">
          <Center h="100%">
            <NewPileMenu
              onSubmit={(e) =>
                addDeck({
                  ...e,
                  code: game.code,
                })
              }
            />
            <HStack ml="2" wrap="wrap">
              {remotePiles &&
                remotePiles
                  .map((p, i) => i)
                  .filter((i) => !playerPileIds.includes(i))
                  .map((i) => (
                    <Pile
                      cards={remotePiles[i].cards}
                      pileId={`${i}`}
                      name={`Pile ${i}`}
                      isFaceUp={remotePiles[i].isFaceUp}
                      isSpread={remotePiles[i].isSpread}
                    />
                  ))}
            </HStack>
          </Center>
        </GridItem>
        <GridItem rowSpan={1} colSpan={8}>
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
    </DragDropContext>
  );
}
