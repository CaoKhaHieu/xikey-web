import { ReactElement, createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { BASE_URL } from '@/shared/constants';

interface SocketProps {
  children: ReactElement;
}

const SocketContext = createContext({
  socket: io(BASE_URL),
});

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
    setSocket(io(BASE_URL));
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
