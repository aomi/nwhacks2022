import { AddIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Checkbox,
  Input,
  VStack,
  Text,
  RadioGroup,
  Radio,
  Select,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Pile } from "../api/gameBoardObjects/Pile";
import { DECK_TYPES } from "../enums/SharedEnums";
import { AddDeckEvent } from "../events/GameEvents";

export type NewPileProps = {
  onSubmit?: (event: Omit<AddDeckEvent, "code">) => void;
  piles: Pile[];
};

export function DealMenu({ onSubmit, piles }: NewPileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  const thePiles = useMemo(() => piles, [piles]);

  const [hasDeck, setHasDeck] = useState(false);
  const [isFaceUp, setIsFaceUp] = useState(false);
  const [isFanned, setIsFanned] = useState(false);

  console.log("the piles: ", thePiles);

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit({
        deckType: hasDeck ? DECK_TYPES.STANDARD : DECK_TYPES.EMPTY,
        isFaceUp,
        isFanned,
      });
    }

    setHasDeck(false);
    setIsFaceUp(false);
    setIsFanned(false);
    onClose();
  }, [isFaceUp, hasDeck, isFanned]);

  return (
    <>
      <Button
        bgColor="blue.300"
        _hover={{
          bgColor: "blue.500",
          color: "white",
        }}
        w="100%"
        aria-label="Deal cards"
        onClick={() => setIsOpen(true)}
      >
        Deal
      </Button>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deal cards
            </AlertDialogHeader>

            <AlertDialogBody>
              Dealing cards takes as many cards as possible from a selected deck
              and distributes them evenly based on the value you provide.
              <VStack alignItems="left" mt="2">
                {thePiles && (
                  <Select placeholder="Select a pile">
                    {thePiles.map((pile, i) => {
                      <option value={i}>{`Pile ${i}`}</option>;
                    })}
                  </Select>
                )}
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleSubmit} ml={3}>
                Add
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
