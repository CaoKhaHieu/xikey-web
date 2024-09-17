import { ReactElement, createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';

import { BASE_URL } from '@/shared/constants';
import { Message } from '@/shared/models/Message';
import { saveNewMessage, saveNewMessageWithVirtualId, triggerAlertNewMessage, triggerScrollToEndListMessage, updateMessage, triggerGetPinedMessage } from '@/stores/message/action';
import { clearCurrentConversation, removeConversation, selectConversation, updateInfoConversation, updateLastMessageConversation } from '@/stores/conversation/action';
import { Conversation } from '@/shared/models/Conversation';
import { User } from '@/shared/models/User';
import { getToken } from '@/shared/utils/utils';

interface SocketProps {
  children: ReactElement;
}

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const useSocket = () => {
  const socketContext = useContext(SocketContext);
  return socketContext;
};

const SocketProvider = (props: SocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);

  const { isLastMessageLoaded }: { isLastMessageLoaded: boolean } = messageManagement;
  const { currentConversation }: { currentConversation: Conversation } = conversation;

  const currentConversationRef = useRef<Conversation>(currentConversation);
  const userRef = useRef<User>(user);
  const isLastMessageLoadedRef = useRef<boolean>(isLastMessageLoaded);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.id) {
      const newSocket = io(BASE_URL, {
        auth: {
          token: getToken(),
        },
      });
      setSocket(newSocket);

      userRef.current = user;

      newSocket.emit('join', user.id);
    }
  }, [user.id]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('new_message', (message: Message) => {
      const newMessage: Message = {
        ...message,
        // isNew to know message is receive by socket
        isNew: true,
      };
      dispatch(updateLastMessageConversation(newMessage));
      
      if (currentConversationRef.current.id !== newMessage.conversationId) {
        return;
      }

      if (newMessage.sender.id === userRef.current.id) {
        // update message
        dispatch(saveNewMessageWithVirtualId(newMessage));
      } else {
        // save new message in case last message loaded
        // Ex: Click reply message scroll to top, khi có tin nhắn tới mà chưa có last message thì không cần thêm vào list
        if (isLastMessageLoadedRef.current) {
          dispatch(saveNewMessage(newMessage));
        }
        //handle show alert new message
        dispatch(triggerAlertNewMessage({ type: 'INCREASE' }));
      }
    });

    socket.on('edit_message', (message: Message) => {
      if (currentConversationRef.current.id === message.conversationId) {
        dispatch(updateMessage(message));
      }
      if (currentConversationRef.current.lastMessage.id === message.id) {
        dispatch(updateLastMessageConversation(message));
      }
    });

    socket.on('delete_message', (message: Message) => {
      if (currentConversationRef.current.id === message.conversationId) {
        dispatch(updateMessage(message));
      }
      if (currentConversationRef.current.lastMessage.id === message.id) {
        dispatch(updateLastMessageConversation(message));
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

    socket.on('user_online', (data: { userId: string, online: boolean }) => {
    });
  }, [socket]);

  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [conversation.currentConversation]);

  useEffect(() => {
    isLastMessageLoadedRef.current = isLastMessageLoaded;
  }, [isLastMessageLoaded]);

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
