import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { io } from "socket.io-client";

const socket = io();

const app = document.getElementById("app");
ReactDOM.render(<App />, app);
