import React, { useState } from "react";
import { Box, Center, Heading, Input, Text, VStack } from "@chakra-ui/react";
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
    <Center p="5" bgColor="green.300" h="100vh">
      <VStack bgColor="white" p="10" borderRadius={9}>
        <Heading size="4xl">Cards with Friends</Heading>
        <Text my="5">do you like card games? then you should join us!</Text>
        <Heading size="lg">your name</Heading>
        <Input
          maxW="md"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <JoinLobby code={code} onSubmit={joinGame} name={name} />
        {!code && <CreateLobby onSubmit={createGame} name={name} />}
      </VStack>
    </Center>
  );
}
