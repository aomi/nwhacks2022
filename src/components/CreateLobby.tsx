import React from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useState } from "react";
import { CreateEvent } from "../events/LobbyEvents";

export type CreateGameProps = {
  onSubmit: (event: CreateEvent) => void;
  name?: string;
};

export function CreateLobby({ onSubmit, name }: CreateGameProps) {
  const [gameName, setGameName] = useState<string>("");

  const handleSubmit = () => {
    if (gameName.length > 0) {
      onSubmit({
        gameName,
        maxPlayuers: 4,
        playerName: name,
      });
    }
  };

  return (
    <Box maxW="md">
      <Heading>create a game</Heading>
      <InputGroup my="2">
        <InputLeftAddon children="Game Name" />
        <Input
          type="text"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
      </InputGroup>
      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        disabled={name?.length === 0}
      >
        Create Game
      </Button>
    </Box>
  );
}
