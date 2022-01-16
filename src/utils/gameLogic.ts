import { DraggableLocation } from "react-beautiful-dnd";
import { Card } from "../pages/Lobby";

/**
 * Moves an item from one list to another list.
 */
export const move = (
  source: Card[],
  destination: Card[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation,
  piles: Card[][]
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

/**
 * Shuffles an array (duh)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
};
