import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { GameManager } from "./GameManager";
import { CreateEvent, JoinEvent } from "../events/MenuEvent";

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

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });


  // setInterval(() => {
  //   socket.emit("test", "hello world");
  // }, 1000);

  // Test socket
  socket.on('test', (msg) => {
    console.log('message: ' + msg);
  });

  // Create event
  socket.on('create', (event: CreateEvent) => {
    console.log('creating a new game');
    const newGame = manager.addGame(event.gameName, event.maxPlayuers, event.playerName);
    console.log(newGame);
  });

  // Join event
  socket.on('join', (event: JoinEvent) => {
    console.log('Joining a game: ' + event.code);
    const game = manager.joinGame(event.code, event.playerName);
    if (game === null) {
      console.log("No game with found with code: " + event.code);
    }
    else {
      console.log(game);
    }
  });
});

httpServer.listen(port, () => {
  console.log(`Listening on ${port}`);
});
