import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./socket";

export function useSocket<T>(eventName: string): {
  data: T | null;
  send: (data: T) => void;
} {
  const socket = useContext(SocketContext);
  const [data, setData] = useState<T | null>();

  useEffect(() => {
    const handler = (data: T) => {
      setData(data);
    };

    socket.on(eventName, handler);

    return () => {
      socket.off(eventName, handler);
    };
  }, [eventName, socket]);

  const send = (data: T) => {
    socket.emit(eventName, data);
  };

  return { data, send };
}

export const useSocketSend = () => {
  return useSocket<string>("message");
};
