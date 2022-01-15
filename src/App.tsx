import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function App() {
  const [messages, setMessages] = useState<string[]>([]);

  const socket = io({
    // transports: ["websocket"],
    // hostname: "localhost",
    // port: 3001,
    // path: "/socket.io",
    // upgrade: true,
  });

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("event", (data) => {
      console.log(data);
    });

    socket.on("error", () => {
      console.log("error");
    });

    socket.on("chat message", (msg) => {
      // console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });
  }, []);

  return (
    <h1>
      Hello world!
      {messages.map((msg) => (
        <pre>{msg}</pre>
      ))}
    </h1>
  );
}
