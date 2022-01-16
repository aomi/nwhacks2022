import React, { createContext } from "react";
import { io } from "socket.io-client";

// set your ngrok here
const ngrok = "https://ea67-2604-3d08-2486-e400-7cca-7a7-8e42-7405.ngrok.io";

export const socket = io(process.env.NODE_ENV === "production" ? "/" : ngrok);

export const SocketContext = createContext(socket);
