import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "@/shared/components/avatar";
import { User } from "@/shared/models/User";
import { Conversation } from "@/shared/models/Conversation";
import { useChat } from "@/shared/contexts/chat-context";

interface IUserSidebar {
  conversation: Conversation;
}

const ChatItem = (props: IUserSidebar) => {
  const { conversation } = props;
  const { handleSelectChat } = useChat();
  
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const userChat = conversation.members.find((member: User) => member.id !== user.id);

  if (!userChat) {
    return null;
  }

  const handleClick = () => {
    handleSelectChat(userChat);
  };
  
  return (
    <Link onClick={handleClick} to={`/chat/${conversation.id}`} className="flex p-2 cursor-pointer hover:bg-gray2 duration-300">
      <div>
        <Avatar className="" url={userChat.avatar} />
      </div>
      <div className="flex-1 ml-2">
        {/* top */}
        <div className="flex justify-between items-center">
          <div className="text-black1 text-base line-clamp-1">
            {userChat.name}
          </div>
          <p className="whitespace-nowrap text-sm text-gray3">1h ago</p>
        </div>

        {/* bottom */}
        <div className="flex justify-between">
          <p className="text-sm text-gray3 line-clamp-1">
            { conversation.lastMessage.content }
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChatItem;
