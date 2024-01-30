import React, { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";

interface SocketProps {
  children: ReactElement;
}

const SocketContext = createContext({
  socket: {},
});

const ENDPOINT = 'http://localhost:4000';

export const useSocket = () => {
  const socketContext = useContext(SocketContext);
  return socketContext;
};

const SocketProvider = (props: SocketProps) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    createSocket()
  }, []);

  const createSocket = () => {
    setSocket(io(ENDPOINT));
  };

  const data: any = {
    socket,
  };

  return (
    <SocketContext.Provider value={data}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketProvider;
