import React from "react";
import { Box, Heading, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSocket } from "../contexts/provider";

export type ChatProps = {
  playerName: string;
};

export function Chat({ playerName }: ChatProps) {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const { send: sendMessage, data: messageData } = useSocket<string>("message");

  useEffect(() => {
    if (messageData) {
      setMessages((messages) => [...messages, messageData]);
    }
  }, [messageData]);

  const handleSend = () => {
    if (message.trim().length > 0) {
      setMessages((messages) => [...messages, `${playerName}: ${message}`]);
      sendMessage(`${playerName}: ${message}`);
      setMessage("");
    }
  };

  return (
    <Box>
      <Heading size="lg">Chat</Heading>
      {messages.map((message, index) => (
        <Box key={index}>{message}</Box>
      ))}
      <Input
        name="message"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleSend();
          }
        }}
      />
    </Box>
  );
}
