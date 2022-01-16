import { Button, HStack } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from "react-beautiful-dnd";
import { Pile } from "../components/Pile";

type Result = {
  id: string;
  value: string;
};

// fake data generator
const getItems = (count: number, offset = 0): Result[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    value: `item ${k + offset}`,
  }));

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: Result[],
  destination: Result[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
  piles: Result[][]
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const pilesClone = Array.from(piles);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.push(removed);

  pilesClone[droppableSource.droppableId] = sourceClone;
  pilesClone[droppableDestination.droppableId] = destClone;

  return pilesClone;
};

const grid = 8;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: any) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
});

export function Lobby() {
  const [piles, setPiles] = useState<Result[][]>([]);

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

  const onClick = useCallback(() => {
    setPiles([...piles, getItems(5, 5 * piles.length)]);
  }, [piles, setPiles]);

  return (
    <>
      <Button onClick={onClick}>add a pile</Button>
      <DragDropContext onDragEnd={onDragEnd}>
        <HStack spacing="10" minW="100vh" wrap="wrap">
          {piles.map((pile, i) => (
            <Pile
              cards={pile}
              name={`${i}`}
              isSpread={i === 0}
              isFaceUp={i === 0}
            />
          ))}
        </HStack>
      </DragDropContext>
    </>
  );
}
