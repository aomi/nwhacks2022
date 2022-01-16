import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { socket, SocketContext } from "./contexts/socket";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketContext.Provider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
