import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  console.log(socket.client, "connected");
});

httpServer.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on ${process.env.PORT || 3000}`);
});
