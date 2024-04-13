import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import './style.module.scss';

import Avatar from "../avatar";
import Reaction from "../reaction";
import Tooltip from "../tooltip";
import { User } from "@/shared/models/User";

import { useDialog } from "../dialog";
import DynamicPopover from "../popover";
import ImageDetail from "../image-detail";
import ForwardMessage from "../dialog/templates/ForwardMessage";
import { deleteMessage, reactMessage, saveReplyMessage } from "@/stores/message/action";

import { TYPE_MESSAGE } from "@/shared/enums";
import { REACTIONS } from "@/shared/constants";
import { Message as MessageModel } from "@/shared/models/Message";
import { formatDate, formatTimeToHHMM, isOnlyEmoji, showToast, urlify } from "@/shared/utils/utils";

import ReplyIcon from "../../../assets/icons/reply.svg?react";
import SmilePlusIcon from "../../../assets/icons/smile-plus.svg?react";
import ShareIcon from "../../../assets/icons/share.svg?react";
import ThreedotIcon from "../../../assets/icons/dot-three.svg?react";
import PinIcon from "../../../assets/icons/pin.svg?react";
import CopyIcon from "../../../assets/icons/copy.svg?react";
import DeleteIcon from "../../../assets/icons/delete.svg?react";
import CircleCheckIcon from "../../../assets/icons/circle-check.svg?react";

interface MessageOptions {
  message: MessageModel;
  showAvatar: boolean;
  isShowName: boolean;
  isLastOfSection: boolean;
  isLast: boolean;
  isShowDayName: boolean;
  isShowStartTime: boolean;
}

const heightChatHeader = 60;
const heightOfPopover = 100;

const Message = (props: MessageOptions) => {
  const { message, showAvatar, isShowName, isLastOfSection, isLast, isShowDayName, isShowStartTime } = props;
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
      <Tooltip
        className="!bg-black2 z-10"
        id={message.id}
        content={formatTimeToHHMM(message.createdAt)}
        place={'top-start'}
      >
        <>
          {
            message.type === TYPE_MESSAGE.TEXT &&
            <span className={classNames({
              "text-2xl": isOnlyEmojiMessage
            })} dangerouslySetInnerHTML={{ __html: urlify(message.content, isCurrentUser) }}>
            </span>
          }
          {
            message.type === TYPE_MESSAGE.IMAGE &&
            <ImageDetail
              className="rounded-2xl object-cover min-h-96 max-h-96 max-w-xl cursor-pointer"
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
                    className="rounded-lg min-h-96 object-cover max-h-96 max-w-xl"
                    src={image}
                  ></ImageDetail>
                </div>
              ))}
            </div>
          }
        </>
      </Tooltip>
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

  const handleCopyMessage = () => {
    const value = message.content;
    navigator.clipboard.writeText(value);
    showToast('copied');
    handleClosePopover();
  };

  const menusAction = [
    {
      title: 'pin',
      isShow: true,
      icon: <PinIcon />,
    },
    {
      title: 'copy_message',
      isShow: !isDeleted && message.type !== TYPE_MESSAGE.IMAGE_LIST,
      icon: <CopyIcon />,
      onClick: handleCopyMessage,
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
        <p className="flex items-center space-x-1 text-gray3">
          <span>{message.sender.name}</span>
          <span>{t(message.content)}</span>
        </p>
      </div>
    );
  }

  return (
    <div
      className={classNames("flex flex-col w-full relative", {
        "me": isCurrentUser,
        "him": !isCurrentUser,
        'last': isLastOfSection,
      })}
    >
      {
        isShowDayName &&
        <p className="text-center my-3 text-gray3 text-xs">
          {formatDate(message.createdAt)}
        </p>
      }
      {
        isShowStartTime && !isShowDayName &&
        <p className="text-center my-3 text-gray3 text-xs">
          {formatTimeToHHMM(message.createdAt)}
        </p>
      }
      <div className={classNames("flex w-full relative", {
        "me": isCurrentUser,
        "him": !isCurrentUser,
        'last': isLastOfSection,
      })}>
        {
          !isCurrentUser &&
          <div className={classNames({
            'opacity-0': !showAvatar
          })}>
            <Avatar className="w-7 h-7" url={message.sender.avatar} />
          </div>
        }
        <div
          className={classNames("flex flex-col items-start h-full w-full group", {
            "items-end": isCurrentUser,
          })}
          onMouseLeave={handleClosePopover}
        >
          {/* Name  */}
          {
            isShowName && !isCurrentUser && !message.replyMessage?.id &&
            <p className="text-gray5 text-xs mb-1 ml-2">{message.sender.name}</p>
          }
          {/* Reply */}
          {
            message.replyMessage?.id &&
            <>
              <div className="flex items-center space-x-1 text-xs text-gray5 mt-2 mb-1 ml-2">
                <div className="text-sm">
                  <ShareIcon />
                </div>
                <span>{message.sender.id === user.id ? t('you') : message.sender.name} {t('replied')} </span>
              </div>

              <div className="bg-gray9 p-2 mb-0.5 rounded-lg max-w-7/10 ml-2">
                <div className={classNames("border-l-4 border-primary pl-2", {
                  "flex items-center space-x-2": message.replyMessage?.type === TYPE_MESSAGE.IMAGE
                })}>
                  {
                    handleRenderReplyMessage(message)
                  }
                </div>
              </div>
            </>
          }

          <div
            className={classNames("message-content min-w-9 min-h-9 max-w-7/10 relative px-3 py-1.5 flex items-center justify-center", {
              "bg-gray8 ml-2": !isCurrentUser,
              "bg-primaryHover text-white": isCurrentUser,
              "!p-0 !bg-transparent": message.type === TYPE_MESSAGE.IMAGE || message.type === TYPE_MESSAGE.IMAGE_LIST,
              'bg-transparent !p-0 !ml-0': isOnlyEmojiMessage,
            })}
          >
            {
              handleRenderMessage(message)
            }
            {/* Action */}
            {
              !isDeleted &&
              <div
                ref={actionRef}
                className={classNames("absolute top-1/2 -translate-y-1/2 space-x-4 opacity-0 flex items-center justify-center group-hover:opacity-100 rounded-lg p-1.5 text-gray3 text-lg", {
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
                {/* <DynamicPopover
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
                /> */}
              </div>
            }
          </div>

          {/* Reactions  */}
          { isHaveReactions && !isDeleted &&
            <div className={classNames('group/reaction flex items-center space-x-2 ml-2 mb-3  mt-1', {
              'justify-end': isCurrentUser,
            })}>
              <div className={classNames("text-base rounded-full cursor-pointer duration-300 flex items-center space-x-2")}>
                {
                  Object.entries(REACTIONS).map(([reactValue, reaction]) => {
                    if (!message.reactions[reaction.value].length) {
                      return null;
                    }
                    const tooltipContent = message.reactions[reaction.value].map(react => react.name).join(', ');
                    // const isReacted = message.reactions[reaction.value].findIndex(react => react.id === user.id) > -1;
                    return (
                      <div key={reactValue}>
                        <Tooltip
                          className="max-w-80 z-10 !bg-black2"
                          id={reaction.text}
                          content={tooltipContent}
                          place={'top-start'}
                        >
                          <span
                            className={classNames("text-base bg-white px-1 rounded-md cursor-pointer border flex items-center justify-center space-x-1", {
                              // "!bg-gray2 !text-black1": isReacted,
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
            </div>
          }

          {
            isLast && isCurrentUser && !message.isSending &&
            <div className={classNames("text-gray1 absolute -bottom-0 -right-4", {
              '!bottom-12': isHaveReactions,
            })}>
              <CircleCheckIcon />
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Message;
