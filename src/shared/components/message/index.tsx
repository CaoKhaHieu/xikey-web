import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import Avatar from "../avatar";
import Reaction from "../reaction";
import Tooltip from "../tooltip";
import { User } from "@/shared/models/User";
import { useDialog } from "../dialog";

import ImageDetail from "../image-detail";
import ForwardMessage from "../dialog/templates/ForwardMessage";

import { TYPE_MESSAGE } from "@/shared/enums";
import { Message as MessageModel } from "@/shared/models/Message";
import { reactMessage, saveReplyMessage } from "@/stores/message/action";
import { formatTimeToHHMM, isOnlyEmoji, urlify } from "@/shared/utils/utils";
import { REACTIONS } from "@/shared/constants";

import ReplyIcon from "../../../assets/icons/reply.svg?react";
import SmilePlusIcon from "../../../assets/icons/smile-plus.svg?react";
import ShareIcon from "../../../assets/icons/share.svg?react";

interface MessageOptions {
  message: MessageModel;
  showAvatar: boolean;
  isShowName: boolean;
  isScrollEnd: boolean;
  onScrollEnd: () => void;
}

const Message = (props: MessageOptions) => {
  const { message, showAvatar, isShowName, isScrollEnd, onScrollEnd } = props;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  
  const { t } = useTranslation();
  const { appendDialog } = useDialog();
  const dispatch = useDispatch();

  const imgs = message.type === TYPE_MESSAGE.IMAGE_LIST ? message.content.split(',') : [];
  const totalImgs = imgs.length;
  const isCurrentUser = user.id === message.sender.id;
  const isOnlyEmojiMessage = isOnlyEmoji(message.content);
  let isHaveReactions = false;
  for (const key in message.reactions) {
    if (message.reactions.hasOwnProperty(key) && message.reactions[key].length > 0) {
      isHaveReactions = true;
      break;
    }
  }

  const handleSaveReplyMessage = () => {
    const data = {
      conversationId: message.conversationId,
      message,
    };
    dispatch(saveReplyMessage(data));
  };

  const handleReactMessage = (value: number) => {
    const data = {
      messageId: message.id,
      sender: user.id,
      reactValue: value,
    };
    dispatch(reactMessage(data, () => {
    }, () => {
    }));
  };

  const handleFowardMessage = () => {
    appendDialog(
      <ForwardMessage message={message} />
    );
  };

  if (message.type === TYPE_MESSAGE.NOTIFY) {
    return (
      <div className="flex justify-center items-center space-x-2">
        <Avatar className="w-6 h-6" url={message.sender.avatar} />
        <p className="text-white flex items-center space-x-1">
          <span>{message.sender.name}</span>
          <span className="text-gray1">{t(message.content)}</span>
        </p>
      </div>
    );
  }

  return (
    <div className={classNames("flex space-x-2 h-full group", {
      "flex-row-reverse": isCurrentUser,
    })}>
      {
        !isCurrentUser && showAvatar &&
        <Avatar className="w-10 h-10" url={message.sender.avatar} />
      }
      <div
        className={classNames("p-2.5 min-w-20 rounded-lg max-w-7/10 h-full relative", {
          "ml-auto bg-gray4": isCurrentUser,
          "bg-white mr-auto": !isCurrentUser,
          "ml-14": !isCurrentUser,
          "!p-0 !bg-transparent": message.type === TYPE_MESSAGE.IMAGE || message.type === TYPE_MESSAGE.IMAGE_LIST
        })}
      >
        {
          isShowName && !isCurrentUser &&
          <p className="text-gray5 text-xs mb-1.5">{message.sender.name}</p>
        }
        {/* Reply Message */}
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
                <p className="text-sm font-semibold">{message.replyMessage.sender.name}</p>
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
          <ImageDetail
            className="rounded-lg object-cover min-h-96 max-h-96 cursor-pointer"
            src={message.content}
          ></ImageDetail>
        }
        {
          message.type === TYPE_MESSAGE.IMAGE_LIST &&
          <div className='grid grid-cols-6 gap-2'>
            {imgs.map((image, index) => (
              <div
                key={index}
                className={classNames("cursor-pointer col-span-6", {
                  '!col-span-3': totalImgs > 1,
                })}
              >
                <ImageDetail
                  className="rounded-lg min-h-96 object-cover max-h-96"
                  src={image}
                ></ImageDetail>
              </div>
            ))}
          </div>
        }
        {/* Reactions  */}
        <div className="group/reaction my-2 flex space-x-2">
          { isHaveReactions &&
            <>
              <div className={classNames("text-base rounded-full cursor-pointer duration-300 flex items-center space-x-2")}>
                {
                  Object.entries(REACTIONS).map(([reactValue, reaction]) => {
                    if (!message.reactions[reaction.value].length) {
                      return null;
                    }
                    const tooltipContent = message.reactions[reaction.value].map(react => react.name).join(', ');
                    const isReacted = message.reactions[reaction.value].findIndex(react => react.id === user.id) > -1;
                    return (
                      <div key={reactValue}>
                        <Tooltip
                          className="max-w-80 z-10 !bg-black2"
                          id={reaction.text}
                          content={tooltipContent}
                          place={'top-start'}
                        >
                          <span
                            className={classNames("text-base bg-gray2 px-1 rounded-md cursor-pointer flex items-center justify-center space-x-1", {
                              "!bg-black2 text-white": message.type === TYPE_MESSAGE.IMAGE,
                              "!bg-pink2 !text-black1 border border-primaryHover": isReacted,
                            })}
                            onClick={() => handleReactMessage(reaction.value)}
                          >
                            <span>{reaction.text}</span>
                            <span className="text-xs">{message.reactions[reaction.value].length}</span>
                          </span>
                        </Tooltip>
                      </div>
                    )
                  })
                }
              </div>
              <div className={classNames("bg-pink1 text-base p-1 rounded-full cursor-pointer duration-300 relative group/react")}>
                <SmilePlusIcon />
                <Reaction
                  className={classNames("absolute bottom-4 left-1/2 -translate-x-1/2 hidden group-hover/react:flex", {
                    "right-0 !left-auto !translate-x-0": isCurrentUser
                  })}
                  onClick={handleReactMessage}
                />
              </div>
            </>
          }
        </div>
        {/* Time */}
        <p className={classNames("text-xs mt-2", {
          "text-gray7": message.type === TYPE_MESSAGE.TEXT,
          "text-white": message.type === TYPE_MESSAGE.IMAGE || message.type === TYPE_MESSAGE.IMAGE_LIST
        })}>
          {
            formatTimeToHHMM(message.createdAt)
          }
        </p>
        {/* Action */}
        <div className={classNames("absolute top-1/2 -translate-y-1/2 space-x-4 hidden items-center justify-center group-hover:flex bg-gray7 rounded-lg p-1.5 text-white text-lg", {
          "right-full -translate-x-4": isCurrentUser,
          "left-full translate-x-4": !isCurrentUser
        })}>
          <div className="cursor-pointer relative group/react">
            <SmilePlusIcon />
            <Reaction
              className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden group-hover/react:flex"
              onClick={handleReactMessage}
            />
          </div>
          {
            message.type !== TYPE_MESSAGE.IMAGE_LIST &&
            <div className="cursor-pointer" onClick={handleSaveReplyMessage}>
              <ReplyIcon />
            </div>
          }
          <div className="cursor-pointer" onClick={handleFowardMessage}>
            <ShareIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
