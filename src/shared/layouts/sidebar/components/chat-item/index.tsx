import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "@/shared/components/avatar";
import { User } from "@/shared/models/User";
import { Conversation } from "@/shared/models/Conversation";
import { useChat } from "@/shared/contexts/chat-context";
import { timeSince } from "@/shared/utils/utils";
import { TYPE_MESSAGE } from "@/shared/enums";

interface IUserSidebar {
  conversation: Conversation;
}

const ChatItem = (props: IUserSidebar) => {
  const { conversation } = props;
  const { handleSelectChat } = useChat();
  const { t } = useTranslation();
  
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const userChat = conversation.members.find((member: User) => member.id !== user.id);

  if (!userChat) {
    return null;
  }

  const handleClick = () => {
    handleSelectChat(userChat);
  };
  
  return (
    <Link onClick={handleClick} to={`/chat/${conversation.id}`} className="w-full flex p-2 cursor-pointer hover:bg-gray2 duration-300">
      <div>
        <Avatar className="" url={userChat.avatar} />
      </div>
      <div className="flex-1 ml-2">
        {/* top */}
        <div className="flex justify-between items-center">
          <div className="text-black1 text-base line-clamp-1">
            {userChat.name}
          </div>
          <span className="whitespace-nowrap text-sm text-gray3">
            {timeSince(conversation.updatedAt)}
          </span>
        </div>

        {/* bottom */}
        <div className="flex justify-between">
          <p className="text-sm text-gray3 line-clamp-1 text-ellipsis">
            {
              conversation.lastMessage?.type === TYPE_MESSAGE.TEXT &&
              conversation.lastMessage?.content
            }
            {
              conversation.lastMessage?.type === TYPE_MESSAGE.IMAGE &&
              t('image')
            }
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChatItem;
