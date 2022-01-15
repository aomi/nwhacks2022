import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 3001;

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  //   transports: ["websocket"],
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
  // res.send('<h1>I am the server. What are you doing here?</h1>');
});

io.on("connection", (socket) => {
  console.log("user connected");
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
