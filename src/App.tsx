import React, { useEffect, useState } from "react";
import { Lobby } from "./pages/Lobby";
import { CreateEvent } from "./events/MenuEvent";
import { Game } from "./api/Game";
import { useSocket, useSocketSend } from "./contexts/provider";

export function App() {
  const [game, setGame] = useState<Game | null>(null);
  const { send, data } = useSocket<string>("message");
  const { send: createGame } = useSocket<CreateEvent>("create");
  const { data: gameData } = useSocket<Game>("lobby:update");

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    setGame(gameData);
  }, [game]);

  return (
    // <h1>
    //   Hello world!
    //   {/* {messages.map((msg) => (
    //     <pre>{msg}</pre>
    //   ))} */}
    // </h1>

    <>
      <button
        onClick={() =>
          createGame({
            gameName: "my cool game",
            maxPlayuers: 2,
            playerName: "dingus",
          })
        }
      >
        Send Message
      </button>
      <Lobby
        gameName="Keith's Game"
        players={["player 1", "player 2", "player 3"]}
      />
    </>
  );
}
