import { useEffect } from "react";
import { useSelector } from "react-redux";
import ChatItem from "../chat-item";
import { Conversation } from "@/shared/models/Conversation";
import { useSocket } from "@/shared/contexts/socket-context";

const ListChat = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listConversations: Conversation[] = Object.values(conversation?.allConversations);
  listConversations.sort((a: Conversation, b: Conversation) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const { socket } = useSocket();

  useEffect(() => {
    if (listConversations.length) {
      const listIdConversations = listConversations?.map((conversation: Conversation) => conversation.id);
      socket.emit('join_conversations', listIdConversations);
    }
  }, [listConversations]);

  return (
    <div className="flex flex-col overflow-y-scroll h-[calc(100vh-103px)]">
      {
        listConversations?.length > 0 && listConversations.map(conversation => (
          <ChatItem key={conversation.id} conversation={conversation} />
        ))
      }
    </div>
  );
};

export default ListChat;
