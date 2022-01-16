import { Box, Button, HStack, VStack, Text } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { Card } from "../components/Card";
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

// a little function to help us with reordering the result
const reorder = (list: Result[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  console.log(result);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: Result[],
  destination: Result[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.push(removed);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
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
  const [items, setItems] = useState(getItems(5));
  const [selected, setSelected] = useState(getItems(5, 5));

  const idList = [items, selected];

  const getList = (id: number) => idList[id];

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    const newResult = move(
      getList(source.droppableId === "droppable" ? 0 : 1),
      getList(destination.droppableId === "droppable" ? 0 : 1),
      source,
      destination
    );

    setItems(newResult.droppable);
    setSelected(newResult.droppable2);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <VStack spacing="10">
        <Pile cards={items} name="droppable" />
        <Pile cards={selected} name="droppable2" />
      </VStack>
    </DragDropContext>
  );
}
