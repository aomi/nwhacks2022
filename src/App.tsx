import React, { useEffect, useState } from "react";
import { Lobby } from "./pages/Lobby";
import { Game } from "./api/Game";
import { useSocket } from "./contexts/provider";
import { Box, Spinner } from "@chakra-ui/react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./pages/Home";

export function App() {
  const [game, setGame] = useState<Game | null>(null);
  const { data: gameData } = useSocket<Game>("clientUpdate");

  const navigate = useNavigate();

  useEffect(() => {
    if (gameData) {
      console.log(gameData);
      setGame(gameData);
      navigate(`/lobby/${gameData.code}`);
    }
  }, [gameData]);

  return (
    <Box>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join/:code" element={<Home />} />
        <Route
          path="/lobby/:code"
          element={game ? <Lobby game={game} /> : <Spinner />}
        />
      </Routes>
    </Box>
  );
}
