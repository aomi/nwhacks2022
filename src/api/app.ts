import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { GameManager } from "./GameManager";
import {
  ChangeGameStateEvent,
  CreateEvent,
  JoinEvent,
} from "../events/LobbyEvents";
import {
  AddDeckEvent,
  MoveCardEvent,
  RemoveDeckEvent,
  ShuffleEvent,
} from "../events/GameEvents";

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "*",
  })
);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const manager = new GameManager();

app.use(express.static("build"));

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("message", (e) => {
    console.log("message", e);
    socket.rooms.forEach((room) => {
      socket.to(room).emit("message", e);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Create event
  socket.on("create", (event: CreateEvent) => {
    console.log("creating a new game");
    const newGame = manager.addGame(
      event.gameName,
      event.maxPlayuers,
      event.playerName
    );
    console.log(newGame);
    socket.join(newGame.code);
    socket.to(newGame.code).emit("clientUpdate", newGame);
  });

  // Join event
  socket.on("join", (event: JoinEvent) => {
    console.log("Joining a game: " + event.code);
    const game = manager.joinGame(event.code, event.playerName);
    if (game === null) {
      console.log("No game with found with code: " + event.code);
    } else {
      console.log(game);
      socket.to(game.code).emit("clientUpdate", game);
    }
  });

  // Change game state Event
  socket.on("updateState", (event: ChangeGameStateEvent) => {
    console.log("Changing game: " + event.code + " to " + event.newState);
    const game = manager.setGameState(event.code, event.newState);
    socket.to(game.code).emit("clientUpdate", game);
  });

  // Adding a new deck
  socket.on("addDeck", (event: AddDeckEvent) => {
    console.log("Adding deck to game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.addDeck(event.deckType, event.isFaceUp);
    socket.to(game.code).emit("clientUpdate", game);
  });

  // Removing a new deck
  socket.on("removeDeck", (event: RemoveDeckEvent) => {
    console.log("Removing deck " + event.pileId + " from game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.removeDeck(event.pileId);
    socket.to(game.code).emit("clientUpdate", game);
  });

  // Shuffle a pile
  socket.on("shuffle", (event: ShuffleEvent) => {
    console.log("Shuffling deck " + event.pileId + " from game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.piles[event.pileId].shuffle();
    socket.to(game.code).emit("clientUpdate", game);
  });

  // Removing a new deck
  socket.on("moveCard", (event: MoveCardEvent) => {
    console.log("Moving card" + event.card + " from game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.moveCard(event.card, event.srcPileId, event.destPileId);
    socket.to(game.code).emit("clientUpdate", game);
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on ${port}`);
});
