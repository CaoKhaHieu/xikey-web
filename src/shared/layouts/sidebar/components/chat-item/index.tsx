import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import Avatar from "@/shared/components/avatar";
import { User } from "@/shared/models/User";
import { Conversation } from "@/shared/models/Conversation";
import { getFileNameFromUrl, getFilesMessage, getImgsMessage, getTextMessage, timeSince } from "@/shared/utils/utils";
import { TYPE_MESSAGE } from "@/shared/enums";
import { joinGroupConversation, selectConversation } from "@/stores/conversation/action";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface IUserSidebar {
  conversation: Conversation;
}

const ChatItem = (props: IUserSidebar) => {
  const { conversation } = props;
  
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const { conversation: conversationRedux } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversationRedux;
  const isCloudChat = conversation.isCloud;

  const { t } = useTranslation();
  const dispatch = useDispatch();

  // use ? because user model in BE does not have field userChat, when use updateInfoConversation() -> bug systax error
  const { online } = useOnlineStatus(conversation?.userChat?.online, conversation?.userChat?.id, true);

  const handleClick = () => {
    if (conversation.members.includes(user.id)) {
      dispatch(selectConversation(conversation));
    } else {
      // handle join conversation
      const data = {
        conversationId: conversation.id,
        userId: user.id
      };
      dispatch(joinGroupConversation(data, (conversationRes: Conversation) => {
        dispatch(selectConversation(conversationRes));
      }, () => {
      }));
    }
  };

  const renderLastMessage = () => {
    let textMessage: string = '';
    let imgsMessage: string[] = [];
    let filesMessage: string[] = [];

    if (conversation.lastMessage && conversation.lastMessage.type === TYPE_MESSAGE.HTML) {
      textMessage = getTextMessage(conversation.lastMessage.content);
      imgsMessage = getImgsMessage(conversation.lastMessage.content);
      filesMessage = getFilesMessage(conversation.lastMessage.content);
    }

    if (conversation.lastMessage?.isDeleted) {
      return (
        <>
          {
            conversation?.lastMessage?.sender?.id === user.id && t('you_last_message')
          }
          <i>{t('deleted_message')}</i>
        </>
      );
    }
    return (
      <div className="w-full flex line-clamp-1 text-ellipsis break-all">
        {
          conversation?.lastMessage?.sender?.id === user.id &&
          <span className="whitespace-nowrap mr-1">{t('you_last_message')}</span>
        }
        {
          conversation.lastMessage?.type === TYPE_MESSAGE.TEXT &&
          <span className="line-clamp-1 text-ellipsis break-all">{conversation.lastMessage?.content}</span>
        }
        {
          conversation.lastMessage?.type === TYPE_MESSAGE.IMAGE &&
          t('image')
        }
        {
          conversation.lastMessage?.type === TYPE_MESSAGE.HTML &&
          <div className="flex space-x-1">
            {
              imgsMessage.length > 0 ? imgsMessage.map((image, index) => (
                <div
                  key={index}
                >
                  <img className="h-4 w-4 min-h-4 min-w-4 rounded" src={image} />
                </div>
            )) :
            <p className="line-clamp-1 text-ellipsis break-all">
              {getFileNameFromUrl(filesMessage[0])}
            </p>
            }
            {
              textMessage &&
              <span className="line-clamp-1 text-ellipsis break-all">{textMessage}</span>
            }
          </div>
        }
      </div>
    );
  };
  
  return (
    <div onClick={handleClick} className={classNames("w-full flex items-center p-2 cursor-pointer rounded-lg duration-300", {
      "bg-gray2 hover:bg-gray2": currentConversation.id === conversation.id,
      "hover:bg-gray8": currentConversation.id !== conversation.id,
    })}>
      <div>
        <Avatar
          className=""
          url={conversation.avatar}
          online={online}
         />
      </div>
      <div className="flex-1 ml-2">
        {/* top */}
        <div className="flex justify-between items-center">
          <div className="text-black1 text-base line-clamp-1">
            {
              isCloudChat && t('my_cloud')
            }
            {conversation.name}
          </div>
          <span className="whitespace-nowrap text-sm text-gray3">
            {timeSince(conversation.updatedAt)}
          </span>
        </div>

        {/* bottom */}
        <div className="flex justify-between">
          <div className="text-sm text-gray3 line-clamp-1 text-ellipsis break-all w-full">
            { renderLastMessage() }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
