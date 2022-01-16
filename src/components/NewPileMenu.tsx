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
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { DECK_TYPES } from "../enums/SharedEnums";
import { AddDeckEvent } from "../events/GameEvents";

export type NewPileProps = {
  onSubmit?: (event: Omit<AddDeckEvent, "code">) => void;
};

export function NewPileMenu({ onSubmit }: NewPileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  const [hasDeck, setHasDeck] = useState(false);
  const [isFaceUp, setIsFaceUp] = useState(false);
  const [isFanned, setIsFanned] = useState(false);
  const [dontShuffle, setDontShuffle] = useState(false);

  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit({
        deckType: hasDeck ? DECK_TYPES.STANDARD : DECK_TYPES.EMPTY,
        isFaceUp,
        isFanned,
        dontShuffle,
      });
    }

    setHasDeck(false);
    setIsFaceUp(false);
    setIsFanned(false);
    onClose();
  }, [isFaceUp, hasDeck, isFanned, dontShuffle]);

  return (
    <>
      <Button
        h="142px"
        w="108px"
        border="dotted"
        colorScheme="whiteAlpha"
        color="black"
        aria-label="Add a new pile"
        onClick={() => setIsOpen(true)}
      >
        <AddIcon />
      </Button>
      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Add a pile
            </AlertDialogHeader>

            <AlertDialogBody>
              Adding a pile gives you the opportunity to add a new spot to place
              and take cards or a new deck to play with.
              <VStack alignItems="left" mt="2">
                <RadioGroup
                  onChange={(e) => {
                    setHasDeck(e === "draw_pile");
                  }}
                >
                  <Radio value="draw_pile">Draw Pile</Radio>
                  <Radio value="discard_pile">Empty Pile</Radio>
                </RadioGroup>
                <Checkbox
                  isChecked={isFaceUp}
                  onChange={() => setIsFaceUp(!isFaceUp)}
                >
                  Face Up?
                </Checkbox>
                <Checkbox
                  isChecked={isFanned}
                  onChange={() => setIsFanned(!isFanned)}
                >
                  Fan it out? (Recommended with only Discard)
                </Checkbox>
                <Checkbox
                  isChecked={dontShuffle}
                  onChange={() => setDontShuffle(!dontShuffle)}
                >
                  Don't shuffle
                </Checkbox>
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
