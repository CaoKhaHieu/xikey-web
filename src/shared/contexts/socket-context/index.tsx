import { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { BASE_URL } from '@/shared/constants';

interface SocketProps {
  children: ReactElement;
}

const ioData = io(BASE_URL);

const SocketContext = createContext({
  socket: ioData,
});

export const useSocket = () => {
  const socketContext = useContext(SocketContext);
  return socketContext;
};

const SocketProvider = (props: SocketProps) => {
  const data = {
    socket: ioData,
  };

  return (
    <SocketContext.Provider value={data}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketProvider;
