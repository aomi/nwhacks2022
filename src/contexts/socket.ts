import React, { createContext } from "react";
import { io } from "socket.io-client";

// set your ngrok here
const ngrok = "";

export const socket = io(process.env.NODE_ENV === "production" ? "/" : ngrok);

export const SocketContext = createContext(socket);
