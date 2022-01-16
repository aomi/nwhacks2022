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
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

export function NewPileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();

  // Form data
  const [isInvalid, setIsInvalid] = useState(false);
  const [pileName, setPileName] = useState("");
  const [hasDeck, setHasDeck] = useState(false);
  const [isFaceUp, setIsFaceUp] = useState(false);

  const onSubmit = useCallback(() => {
    if (pileName.length < 1) {
      setIsInvalid(true);
      return;
    }
    // API call
    setPileName("");
    setHasDeck(false);
    setIsFaceUp(false);
    onClose();
  }, [pileName, isFaceUp, hasDeck]);

  useEffect(() => {
    if (pileName.length >= 1) {
      setIsInvalid(false);
    }
  }, [pileName]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add a Pile</Button>
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
                {isInvalid && <Text color="red">Must have a pile name</Text>}
                <Input
                  placeholder="Pile name"
                  value={pileName}
                  isInvalid={isInvalid}
                  onChange={({ currentTarget: { value } }) =>
                    setPileName(value)
                  }
                />
                <Checkbox
                  isChecked={hasDeck}
                  onChange={() => setHasDeck(!hasDeck)}
                >
                  Has deck of cards
                </Checkbox>
                <Checkbox
                  isChecked={isFaceUp}
                  onChange={() => setIsFaceUp(!isFaceUp)}
                >
                  Is face up
                </Checkbox>
              </VStack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={onSubmit} ml={3}>
                Add
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
