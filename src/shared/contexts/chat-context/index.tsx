import React, { createContext, useContext, useState } from 'react';
import { User } from '@/shared/models/User';

interface IChatContext {
  selectedChat: User;
  handleSelectChat: (_user: User) => void;
}

const ChatContext = createContext<IChatContext>({
  selectedChat: new User({}),
  handleSelectChat: (_user: User) => {}
});

export const useChat = () => {
  return useContext(ChatContext);
};

const ChatProvider = (props: React.HTMLProps<HTMLButtonElement>) => {
  const [ selectedChat, setSelectedChat ] = useState<User>(new User({}));

  const handleSelectChat = (user: User) => {
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
