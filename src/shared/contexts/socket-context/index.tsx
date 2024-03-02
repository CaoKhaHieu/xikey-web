import { ReactElement, createContext, useContext, useEffect, useRef } from 'react';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';

import { BASE_URL } from '@/shared/constants';
import { Message } from '@/shared/models/Message';
import { saveNewMessage, triggerScrollToEndListMessage, updateMessage } from '@/stores/message/action';
import { addConversation, selectConversation, updateInfoConversation, updateLastMessageConversation } from '@/stores/conversation/action';
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
  const currentConversationRef = useRef<Conversation>(currentConversation);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id) {
      socket.emit('join', user.id);

      socket.on('invite_to_group', (newConversation: Conversation) => {
        dispatch(addConversation(newConversation));
      });
    }
  }, [user.id]);

  useEffect(() => {
    socket.on('new_message', (newMessage: Message) => {
      if (currentConversationRef.current.id === newMessage.conversationId) {
        dispatch(saveNewMessage(newMessage));
      }
      dispatch(updateLastMessageConversation(newMessage));
    });

    socket.on('reaction', (message: Message) => {
      if (currentConversationRef.current.id === message.conversationId) {
        dispatch(updateMessage(message));
        // handle scroll list message to end because height of list message can change
        dispatch(triggerScrollToEndListMessage());
      }
    });

    socket.on('update_conversation', (conversation: Conversation) => {
      if (currentConversationRef.current.id === conversation.id) {
        dispatch(selectConversation(conversation));
      }
      dispatch(updateInfoConversation(conversation));
    });

    socket.on('add_user', (conversation: Conversation) => {
      if (currentConversationRef.current.id === conversation.id) {
        dispatch(selectConversation(conversation));
      }
      dispatch(updateInfoConversation(conversation));
    });

    socket.on('kick_user', (conversation: Conversation) => {
      if (currentConversationRef.current.id === conversation.id) {
        dispatch(selectConversation(conversation));
      }
      dispatch(updateInfoConversation(conversation));
    });
  }, []);

  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [conversation.currentConversation]);

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
