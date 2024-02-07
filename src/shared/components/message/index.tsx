import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";

import Avatar from "../avatar";
import { User } from "@/shared/models/User";
import { useChat } from "@/shared/contexts/chat-context";
import { formatTimeToHHMM, isOnlyEmoji, urlify } from "@/shared/utils/utils";
import { Message as MessageModel } from "@/shared/models/Message";
import { TYPE_MESSAGE } from "@/shared/enums";

import ReplyIcon from "../../../assets/icons/reply.svg?react";
import SmilePlusIcon from "../../../assets/icons/smile-plus.svg?react";
import { saveReplyMessage } from "@/stores/message/action";
import { useTranslation } from "react-i18next";

interface MessageOptions {
  message: MessageModel;
  showAvatar: boolean;
  onScrollEnd: () => void;
}

const Message = (props: MessageOptions) => {
  const { message, showAvatar, onScrollEnd } = props;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  
  const { t } = useTranslation();
  const { selectedChat } = useChat();
  const dispatch = useDispatch();

  const isCurrentUser = user.id === message.sender;
  const isOnlyEmojiMessage = isOnlyEmoji(message.content);

  const handleSaveReplyMessage = () => {
    const data = {
      conversationId: message.conversationId,
      message,
    };
    dispatch(saveReplyMessage(data));
  };

  return (
    <div className={classNames("flex space-x-2 h-full group", {
      "flex-row-reverse": isCurrentUser,
    })}>
      {
        !isCurrentUser && showAvatar &&
        <Avatar className="w-10 h-10" url={selectedChat.avatar} />
      }
      <div
        className={classNames("p-2.5 min-w-20 rounded-lg max-w-7/10 h-full relative", {
          "ml-auto bg-gray4": isCurrentUser,
          "bg-white mr-auto": !isCurrentUser,
          "ml-14": !isCurrentUser,
          "!p-0 !bg-transparent": message.type === TYPE_MESSAGE.IMAGE
        })}
      >
        {
          message.replyMessage?.id &&
          <div className="bg-pink1 p-2 mb-2 rounded-lg">
            <div className={classNames("border-l-4 border-primary pl-2", {
              "flex items-center space-x-2": message.replyMessage?.type === TYPE_MESSAGE.IMAGE
            })}>
              {
                message.replyMessage?.type === TYPE_MESSAGE.IMAGE &&
                <div>
                  <img className="min-w-12 w-12 h-12 object-cover" src={message.replyMessage.content}></img>
                </div>
              }
              <div>
                <p className="text-sm font-semibold">{message.replyMessage.sender === user.id ? user.name : selectedChat.name}</p>
                <p className="line-clamp-1 text-ellipsis pr-2 text-sm text-gray3">
                  {message.replyMessage.type === TYPE_MESSAGE.IMAGE ? t('image') : message.replyMessage.content}
                </p>
              </div>
            </div>
          </div>
        }
        {
          message.type === TYPE_MESSAGE.TEXT &&
          <span className={classNames({
            "text-2xl": isOnlyEmojiMessage
          })} dangerouslySetInnerHTML={{ __html: urlify(message.content) }}>
          </span>
        }
        {
          message.type === TYPE_MESSAGE.IMAGE &&
          <a href={message.content} className="cursor-pointer" target="_blank">
            <img
              className="rounded-lg bg-white"
              src={message.content}
              onLoad={onScrollEnd}
            ></img>
          </a>
        }
        <p className={classNames("text-xs mt-2", {
          "text-gray7": message.type === TYPE_MESSAGE.TEXT,
          "text-white": message.type === TYPE_MESSAGE.IMAGE
        })}>
          {
            formatTimeToHHMM(message.createdAt)
          }
        </p>
        <div className={classNames("absolute top-1/2 -translate-y-1/2 space-x-4 hidden items-center justify-center group-hover:flex bg-gray7 rounded-lg p-1.5 text-white text-lg", {
          "right-full -translate-x-4": isCurrentUser,
          "left-full translate-x-4": !isCurrentUser
        })}>
          <div className="cursor-pointer">
            <SmilePlusIcon />
          </div>
          <div className="cursor-pointer" onClick={handleSaveReplyMessage}>
            <ReplyIcon />
          </div>
          <div className="cursor-pointer">
            <SmilePlusIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
