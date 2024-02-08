import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Avatar from "@/shared/components/avatar";
import { User } from "@/shared/models/User";
import { Conversation } from "@/shared/models/Conversation";
import { useChat } from "@/shared/contexts/chat-context";
import { timeSince } from "@/shared/utils/utils";
import { TYPE_MESSAGE } from "@/shared/enums";
import classNames from "classnames";

interface IUserSidebar {
  conversation: Conversation;
}

const ChatItem = (props: IUserSidebar) => {
  const { conversation } = props;

  const { selectedChat, handleSelectChat } = useChat();
  const { t } = useTranslation();
  
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const userChat = conversation.members.find((member: User) => member.id !== user.id);

  if (!userChat) {
    return null;
  }

  const handleClick = () => {
    handleSelectChat({ ...userChat, conversationId: conversation.id });
  };
  
  return (
    <Link onClick={handleClick} to={`/chat/${conversation.id}`} className={classNames("w-full flex p-2 cursor-pointer hover:bg-pink2 duration-300", {
      "bg-pink2": selectedChat.conversationId === conversation.id
    })}>
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
              conversation?.lastMessage?.sender === user.id && t('you')
            }
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
