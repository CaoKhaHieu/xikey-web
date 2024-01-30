import { useSelector } from "react-redux";
import ChatItem from "../chat-item";
import { Conversation } from "@/shared/models/Conversation";

const ListChat = () => {
  const { conversation } = useSelector((state: any) => state.conversationReducer);

  return (
    <div className="flex flex-col overflow-y-scroll h-[calc(100vh-103px)]">
      {conversation?.allConversations?.map((conversation: Conversation) => (
        <ChatItem key={conversation.id} conversation={conversation} />
      ))}
    </div>
  );
};

export default ListChat;
