import { createContext } from "react";
import { io } from "socket.io-client";

// set your ngrok here
const ngrok = "https://ab02-2604-3d08-2d80-a700-00-6bf2.ngrok.io/";

export const socket = io(process.env.NODE_ENV === "production" ? "/" : ngrok);

export const SocketContext = createContext(socket);
