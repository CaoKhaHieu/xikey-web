import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import Avatar from "../avatar";
import Reaction from "../reaction";
import Tooltip from "../tooltip";
import { User } from "@/shared/models/User";

import { useDialog } from "../dialog";
import DynamicPopover from "../popover";
import ForwardMessage from "../dialog/templates/ForwardMessage";
import { deleteMessage, reactMessage, saveReplyMessage } from "@/stores/message/action";
import { formatTimeToHHMM, isOnlyEmoji, urlify } from "@/shared/utils/utils";

import { TYPE_MESSAGE } from "@/shared/enums";
import { REACTIONS } from "@/shared/constants";
import { Message as MessageModel } from "@/shared/models/Message";

import ReplyIcon from "../../../assets/icons/reply.svg?react";
import SmilePlusIcon from "../../../assets/icons/smile-plus.svg?react";
import ShareIcon from "../../../assets/icons/share.svg?react";
import ThreedotIcon from "../../../assets/icons/dot-three.svg?react";
import PinIcon from "../../../assets/icons/pin.svg?react";
import CopyIcon from "../../../assets/icons/copy.svg?react";
import DeleteIcon from "../../../assets/icons/delete.svg?react";

interface MessageOptions {
  message: MessageModel;
  showAvatar: boolean;
  isShowName: boolean;
  isScrollEnd: boolean;
  onScrollEnd: () => void;
}

const heightChatHeader = 60;
const heightOfPopover = 100;

const Message = (props: MessageOptions) => {
  const { message, showAvatar, isShowName, isScrollEnd, onScrollEnd } = props;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  
  const { t } = useTranslation();
  const { appendDialog } = useDialog();
  const dispatch = useDispatch();

  const popoverRef: any = useRef();
  const actionRef: any = useRef();

  const isDeleted = message.isDeleted;
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

  const handleRenderMessage = (message: MessageModel) => {
    if (isDeleted) {
      return (
        <p className="text-gray3">
          <i>{t('deleted_message')}</i>
        </p>
      );
    }
    return (
      <>
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
              className="rounded-lg bg-white max-h-96"
              src={message.content}
              onLoad={(message.isNew && isScrollEnd) ? onScrollEnd : undefined}
              // check list end more
            ></img>
          </a>
        }
        {
          message.type === TYPE_MESSAGE.IMAGE_LIST &&
          <div className='grid grid-cols-6 gap-2'>
            {imgs.map((image, index) => (
              <a
                key={index}
                href={image}
                target="_blank"
                className={classNames("cursor-pointer col-span-6", {
                  '!col-span-3': totalImgs > 1,
                })}
              >
                <img
                  className="rounded-lg bg-white max-h-96"
                  src={image}
                  onLoad={(message.isNew && isScrollEnd) ? onScrollEnd : undefined}
                ></img>
              </a>
            ))}
          </div>
        }
      </>
    );
  };

  const handleRenderReplyMessage = (message: MessageModel) => {
    if (message.replyMessage.isDeleted) {
      return (
        <p className="text-gray3">
          <i>{t('deleted_message')}</i>
        </p>
      );
    }
    return (
      <>
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
      </>
    );
  };

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

  const getPositionPopover = (child: HTMLDivElement) => {
    if (!child) {
      return 'bottom';
    }
    const childRect = child.getBoundingClientRect();
    const distance = childRect.top - heightChatHeader;
    return distance > heightOfPopover ? 'top' : 'bottom';
  };

  const handleClosePopover = () => {
    popoverRef.current?.closePopover();
  };

  const handleDeleteMessage = () => {
    dispatch(deleteMessage({ id: message.id }, () => {
    }, () => {}));
  };

  const menusAction = [
    {
      title: 'pin',
      isShow: true,
      icon: <PinIcon />,
    },
    {
      title: 'copy_message',
      isShow: true,
      icon: <CopyIcon />
    },
    // {
    //   title: 'edit',
    //   isShow: true,
    //   icon: <EditIcon />
    // },
    {
      title: 'delete',
      icon: <DeleteIcon />,
      isShow: !isDeleted && isCurrentUser,
      onClick: handleDeleteMessage,
    }
  ];

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
    <div
      className={classNames("flex space-x-2 h-full group", {
      "flex-row-reverse": isCurrentUser,
      })}
      onMouseLeave={handleClosePopover}
    >
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
                handleRenderReplyMessage(message)
              }
            </div>
          </div>
        }
        {
          handleRenderMessage(message)
        }
        {/* Reactions  */}
        <div className="group/reaction my-2 flex space-x-2">
          { isHaveReactions && !isDeleted &&
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
        {
          !isDeleted &&
          <div
            ref={actionRef}
            className={classNames("absolute top-1/2 -translate-y-1/2 space-x-4 opacity-0 flex items-center justify-center group-hover:opacity-100 bg-gray7 rounded-lg p-1.5 text-white text-lg", {
              "right-full -translate-x-4": isCurrentUser,
              "left-full translate-x-4": !isCurrentUser
            })}
          >
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
            <DynamicPopover
              key={message.id}
              ref={ popoverRef }
              padding={20}
              positions={[`${getPositionPopover(actionRef.current)}`]}
              align={isCurrentUser ? 'end' : 'start'}
              parentElement={actionRef.current}
              triggerElm={
                <div className="cursor-pointer">
                  <ThreedotIcon />
                </div>
              }
              content={
                <div className="py-1 bg-white rounded-lg shadow-2xl overflow-hidden">
                  {
                    menusAction.map((menuItem) => menuItem.isShow && (
                      <p
                        key={menuItem.title}
                        className="flex items-center space-x-3 text-gray3 text-base px-4 py-1 cursor-pointer hover:bg-gray2"
                        onClick={menuItem.onClick}
                      >
                        <span className="text-xl">
                          {menuItem.icon}
                        </span>
                        <span className="whitespace-nowrap">{t(menuItem.title)}</span>
                      </p>
                    ))
                  }
                </div>
              }
            />
          </div>
        }
      </div>
    </div>
  );
};

export default Message;
