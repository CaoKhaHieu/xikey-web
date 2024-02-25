import { ReactElement, createContext, useContext, useEffect } from 'react';
import { io } from "socket.io-client";
import { BASE_URL } from '@/shared/constants';
import { Message } from '@/shared/models/Message';
import { useDispatch, useSelector } from 'react-redux';
import { saveNewMessage, updateMessage } from '@/stores/message/action';
import { addConversation, updateLastMessageConversation } from '@/stores/conversation/action';
import { Conversation } from '@/shared/models/Conversation';
import { User } from '@/shared/models/User';

interface SocketProps {
  children: ReactElement;
}

const socket = io(BASE_URL);

const SocketContext = createContext({
  socket,
});

export const useSocket = () => {
  const socketContext = useContext(SocketContext);
  return socketContext;
};

const SocketProvider = (props: SocketProps) => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const { currentConversation }: { currentConversation: Conversation } = conversation;

  const dispatch = useDispatch();

  useEffect(() => {
    // case: not have current conversation
    socket.on('new_message', (newMessage: Message) => {
      dispatch(updateLastMessageConversation(newMessage));
    });
  }, []);

  useEffect(() => {
    if (user.id) {
      socket.emit('join', user.id);

      socket.on('invite_to_group', (newConversation: Conversation) => {
        dispatch(addConversation(newConversation));
      });
    }
  }, [user]);

  useEffect(() => {
    if (!currentConversation.id) {
      return;
    }
    // handle incase have current conversation
    socket.on('new_message', (newMessage: Message) => {
      if (currentConversation.id === newMessage.conversationId) {
        dispatch(saveNewMessage(newMessage));
      }
    });

    socket.on('reaction', (message: Message) => {
      if (currentConversation.id === message.conversationId) {
        dispatch(updateMessage(message));
      }
    });
  }, [currentConversation]);

  const data = {
    socket,
  };

  return (
    <SocketContext.Provider value={data}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketProvider;
