import { ReactElement, createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';

import { BASE_URL } from '@/shared/constants';
import { Message } from '@/shared/models/Message';
import { saveNewMessage, saveNewMessageWithVirtualId, triggerAlertNewMessage, triggerScrollToEndListMessage, updateMessage, triggerGetPinedMessage } from '@/stores/message/action';
import { clearCurrentConversation, removeConversation, selectConversation, updateInfoConversation, updateLastMessageConversation } from '@/stores/conversation/action';
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
  const userRef = useRef<User>(user);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id) {
      userRef.current = user;

      socket.emit('join', user.id);
    }
  }, [user.id]);

  useEffect(() => {
    socket.on('new_message', (message: Message) => {
      const newMessage: Message = {
        ...message,
        // isNew to know message is receive by socket
        isNew: true,
      };

      if (currentConversationRef.current.id === newMessage.conversationId) {
        if (newMessage.sender.id === userRef.current.id) {
          // update message
          dispatch(saveNewMessageWithVirtualId(newMessage));
        } else {
          // save new message
          dispatch(saveNewMessage(newMessage));
          //handle show alert new message
          dispatch(triggerAlertNewMessage({ type: 'INCREASE' }));
        }
      }
      dispatch(updateLastMessageConversation(newMessage));
    });

    socket.on('delete_message', (message: Message) => {
      if (currentConversationRef.current.id === message.conversationId) {
        dispatch(updateMessage(message));
      }
    });

    socket.on('reaction', (message: Message) => {
      if (currentConversationRef.current.id === message.conversationId) {
        dispatch(updateMessage(message));
      }
    });

    socket.on('update_conversation', (conversation: Conversation) => {
      if (currentConversationRef.current.id === conversation.id) {
        dispatch(selectConversation(conversation));
      }
      dispatch(updateInfoConversation(conversation));
    });

    socket.on('remove_group', (conversation: Conversation) => {
      if (currentConversationRef.current.id === conversation.id) {
        dispatch(clearCurrentConversation());
      }
      dispatch(removeConversation(conversation));
    });

    socket.on('add_user', (conversation: Conversation) => {
      // create the new conversation when user has not been added in the conversation
      dispatch(updateInfoConversation(conversation));
    });

    socket.on('kick_user', (conversation: Conversation) => {
      // remove the conversation when user has been kick by admin
      if (currentConversationRef.current.id === conversation.id) {
        dispatch(clearCurrentConversation());
      }
      dispatch(removeConversation(conversation));
    });

    socket.on('pin_message', (conversationId: string) => {
      if (currentConversationRef.current.id === conversationId) {
        dispatch(triggerGetPinedMessage());
      }
    });
    
    socket.on('unpin_message', (conversationId: string) => {
      if (currentConversationRef.current.id === conversationId) {
        dispatch(triggerGetPinedMessage());
      }
    });

    socket.on('link_update', (conversation: Conversation) => {
      if (currentConversationRef.current.id === conversation.id && !userRef.current.isAdmin) {
        dispatch(selectConversation({ ...currentConversationRef.current, links: conversation.links }));
      }
      dispatch(updateInfoConversation(conversation));
    });

    socket.on('ban_user', (conversation: Conversation) => {
      if (currentConversationRef.current.id === conversation.id) {
        dispatch(selectConversation({ ...currentConversationRef.current, bannedMembers: conversation.bannedMembers }));
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
