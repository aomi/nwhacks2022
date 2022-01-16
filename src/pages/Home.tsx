import React, { useState } from "react";
import { Box, Heading, Input, Text } from "@chakra-ui/react";
import { useSocket } from "../contexts/provider";
import { CreateLobby } from "../components/CreateLobby";
import { JoinLobby } from "../components/JoinLobby";
import { useParams } from "react-router-dom";
import { CreateEvent, JoinEvent } from "../events/LobbyEvents";

export function Home() {
  const { code } = useParams<{
    code?: string;
  }>();

  const [name, setName] = useState<string>("");

  const { send: createGame } = useSocket<CreateEvent>("create");
  const { send: joinGame } = useSocket<JoinEvent>("join");

  return (
    <Box p="5">
      <Heading size="4xl">cool card games</Heading>
      <Text my="5">do you like card games? then you should join us!</Text>
      <Heading size="lg">your name</Heading>
      <Input maxW="md" onChange={(e) => setName(e.target.value)} value={name} />
      <JoinLobby code={code} onSubmit={joinGame} name={name} />
      {!code && <CreateLobby onSubmit={createGame} name={name} />}
    </Box>
  );
}
