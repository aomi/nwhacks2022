import { createServer } from "http";
import { Server } from "socket.io";
import express from 'express';
import http from 'http';

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  /* options */
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // res.send('<h1>I am the server. What are you doing here?</h1>');
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on ${process.env.PORT || 3000}`);

});
