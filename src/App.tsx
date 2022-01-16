import React, { useEffect, useState } from "react";
import { Lobby } from "./pages/Lobby";
import { Game } from "./api/Game";
import { useSocket } from "./contexts/provider";
import { Box, Spinner } from "@chakra-ui/react";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Home } from "./pages/Home";

function PreLobby({ game }: { game: Game }) {
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (game === null && code) {
      navigate(`/join/${code}`);
    } else if (code === undefined) {
      navigate("/");
    }
  }, [game, code, navigate]);

  if (game === null) {
    return <Spinner />;
  }

  return <Lobby game={game} />;
}

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
        <Route path="/lobby/" element={<PreLobby game={game} />} />
        <Route path="/lobby/:code" element={<PreLobby game={game} />} />
      </Routes>
    </Box>
  );
}
