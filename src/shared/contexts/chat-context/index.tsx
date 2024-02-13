import React, { createContext, useContext, useState } from 'react';
import { Conversation } from '@/shared/models/Conversation';

interface IChatContext {
  selectedChat: Conversation;
  handleSelectChat: (_user: Conversation) => void;
}

const ChatContext = createContext<IChatContext>({
  selectedChat: new Conversation({}),
  handleSelectChat: (_user: Conversation) => {}
});

export const useChat = () => {
  return useContext(ChatContext);
};

const ChatProvider = (props: React.HTMLProps<HTMLButtonElement>) => {
  const [ selectedChat, setSelectedChat ] = useState<Conversation>(new Conversation({}));

  const handleSelectChat = (user: Conversation) => {
    setSelectedChat(user);
  };

  const data = {
    selectedChat,
    handleSelectChat,
  };

  return (
    <ChatContext.Provider value={data}>
      {
        props.children
      }
    </ChatContext.Provider>
  );
};

export default ChatProvider;
