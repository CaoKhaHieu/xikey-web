import { useState, useEffect } from 'react';
import { useSocket } from '@/shared/contexts/socket-context';

export const useOnlineStatus = (isOnline: boolean, conversationId: string, currentConversationOnly = false) => {
  const [online, setOnline] = useState<boolean>(isOnline);
  const { socket } = useSocket();

  useEffect(() => {
    setOnline(isOnline);
  }, [isOnline]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    const handleUserOnline = (data: { userId: string, online: boolean }) => {
      // incase userChat reload: just update status only 1 user in sidebar
      if (currentConversationOnly && data.userId !== conversationId) {
        return;
      }
      const onlineStatus = data.online && data.userId === conversationId;
      setOnline(onlineStatus);
    };

    socket.on('user_online', handleUserOnline);

    return () => {
      socket.off('user_online', handleUserOnline);
    };
  }, []);

  return {
    online,
  };
};
