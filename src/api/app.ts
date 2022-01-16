import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { GameManager } from "./GameManager";
import {
  ChangeGameStateEvent,
  CreateEvent,
  JoinEvent,
  ResetGameEvent,
} from "../events/LobbyEvents";
import {
  AddDeckEvent,
  DealEvent,
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
    io.to(newGame.code).emit("clientUpdate", newGame);
  });

  // Join event
  socket.on("join", (event: JoinEvent) => {
    console.log("Joining a game: " + event.code);
    const game = manager.joinGame(event.code, event.playerName);
    if (game === null) {
      console.log("No game with found with code: " + event.code);
    } else {
      console.log(game);
      socket.join(game.code);
      io.to(game.code).emit("clientUpdate", game);
    }
  });

  // Change game state Event
  socket.on("updateState", (event: ChangeGameStateEvent) => {
    console.log("Changing game: " + event.code + " to " + event.newState);
    const game = manager.setGameState(event.code, event.newState);
    io.to(game.code).emit("clientUpdate", game);
  });

  // Adding a new deck
  socket.on("addDeck", (event: AddDeckEvent) => {
    console.log("Adding deck to game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.addDeck(event.deckType, event.isFaceUp, event.isFanned);
    io.to(game.code).emit("clientUpdate", game);
  });

  // Removing a new deck
  socket.on("removeDeck", (event: RemoveDeckEvent) => {
    console.log("Removing deck " + event.pileId + " from game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.removeDeck(event.pileId);
    io.to(game.code).emit("clientUpdate", game);
  });

  // Shuffle a pile
  socket.on("shuffle", (event: ShuffleEvent) => {
    console.log("Shuffling deck " + event.pileId + " from game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.piles[event.pileId].shuffle();
    io.to(game.code).emit("clientUpdate", game);
  });

  // Move card
  socket.on("moveCard", (event: MoveCardEvent) => {
    console.log("Moving card" + event.card + " from game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.moveCard(event.card, event.srcPileId, event.destPileId);
    io.to(game.code).emit("clientUpdate", game);
  });

  // Deal event
  socket.on("deal", (event: DealEvent) => {
    console.log("Dealing " + event.handSize + "cards in game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.deal(event.srcPileId, event.handSize);
    io.to(game.code).emit("clientUpdate", game);
  });

  // Reset game event
  socket.on("deal", (event: ResetGameEvent) => {
    console.log("Resetting game: " + event.code);
    const game = manager.activeGames.get(event.code);
    game.resetGame();
    io.to(game.code).emit("clientUpdate", game);
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on ${port}`);
});
