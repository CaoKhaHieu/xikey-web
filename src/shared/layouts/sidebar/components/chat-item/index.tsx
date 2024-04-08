import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { Link } from "react-router-dom";

import Avatar from "@/shared/components/avatar";
import { User } from "@/shared/models/User";
import { Conversation } from "@/shared/models/Conversation";
import { timeSince } from "@/shared/utils/utils";
import { TYPE_MESSAGE } from "@/shared/enums";
import { selectConversation } from "@/stores/conversation/action";

interface IUserSidebar {
  conversation: Conversation;
}

const ChatItem = (props: IUserSidebar) => {
  const { conversation } = props;
  
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const { conversation: conversationRedux } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversationRedux;
  const isGroupChat = conversation.isGroup;
  const isCloudChat = conversation.isCloud;
  const userChat = conversation.members.find((member: User) => member.id !== user.id);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  if (!userChat && !isGroupChat && !isCloudChat) {
    return null;
  }

  const handleClick = () => {
    const userChat = conversation.members.find((member: User) => member.id !== user.id);
    const conversationSelected: Conversation = {
      ...conversation,
      name: (isGroupChat || isCloudChat) ? conversation.name : userChat?.name || '',
      avatar: (isGroupChat || isCloudChat) ? conversation.avatar : userChat?.avatar || '',
    };
    dispatch(selectConversation(conversationSelected));
  };

  const renderLastMessage = () => {
    if (conversation.lastMessage?.isDeleted) {
      return (
        <>
          {
            conversation?.lastMessage?.sender?.id === user.id && t('you_last_message')
          }
          {t('deleted_message')}
        </>
      );
    }
    return (
      <>
        {
          conversation?.lastMessage?.sender?.id === user.id && t('you_last_message')
        }
        {
          conversation.lastMessage?.type === TYPE_MESSAGE.TEXT &&
          conversation.lastMessage?.content
        }
        {
          conversation.lastMessage?.type === TYPE_MESSAGE.IMAGE &&
          t('image')
        }
      </>
    );
  };
  
  return (
    <Link onClick={handleClick} to={`/chat/${conversation.id}`} className={classNames("w-full flex items-center p-2 cursor-pointer rounded-lg duration-300", {
      "bg-gray2 hover:bg-gray2": currentConversation.id === conversation.id,
      "hover:bg-gray8": currentConversation.id !== conversation.id,
    })}>
      <div>
        <Avatar className="" url={(isGroupChat || isCloudChat) ? conversation.avatar : userChat?.avatar || ''} />
      </div>
      <div className="flex-1 ml-2">
        {/* top */}
        <div className="flex justify-between items-center">
          <div className="text-black1 text-base line-clamp-1">
            {
              isCloudChat && t('my_cloud')
            }
            {isGroupChat ? conversation.name : userChat?.name}
          </div>
          <span className="whitespace-nowrap text-sm text-gray3">
            {timeSince(conversation.updatedAt)}
          </span>
        </div>

        {/* bottom */}
        <div className="flex justify-between">
          <p className="text-sm text-gray3 line-clamp-1 text-ellipsis break-all">
            { renderLastMessage() }
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ChatItem;
