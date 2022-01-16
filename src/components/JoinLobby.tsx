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
import { JoinEvent } from "../events/LobbyEvents";

export type JoinLobbyProps = {
  onSubmit: (event: JoinEvent) => void;
  code?: string;
  name?: string;
};

export function JoinLobby({ onSubmit, code: inputCode, name }: JoinLobbyProps) {
  const [code, setCode] = useState<string>(inputCode);
  const handleCodeChange = (event) => setCode(event.target.value);

  const handleSubmit = () => {
    if (code.length > 0 && name?.length > 0) {
      onSubmit({
        code,
        playerName: name,
      });
    }
  };

  return (
    <Box maxW="md">
      {code ? (
        <Heading>join game {code}</Heading>
      ) : (
        <Heading>join a game</Heading>
      )}

      <InputGroup my="2">
        <InputLeftAddon children="Game Code" />
        <Input
          type="text"
          value={code}
          onChange={handleCodeChange}
          disabled={!!inputCode}
        />
      </InputGroup>

      <Button
        colorScheme="green"
        onClick={handleSubmit}
        disabled={name?.length === 0}
      >
        Join Game
      </Button>
    </Box>
  );
}
