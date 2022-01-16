import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const port = process.env.PORT || 3001;

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  //   transports: ["websocket"],
});

app.use(express.static("build"));

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
  });

  setInterval(() => {
    socket.emit("chat message", "hello world");
  }, 1000);
});

httpServer.listen(port, () => {
  console.log(`Listening on ${port}`);
});
