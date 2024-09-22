import { memo, useRef, useState } from "react";
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
import Button from "../button";
import ImageDetail from "../image-detail";
import ForwardMessage from "../dialog/templates/ForwardMessage";
import ReportMessageDialog from "../dialog/templates/ReportMessage";
import ConfirmDialog from "../dialog/templates/ConfirmDialog";
import { clearScrollMessage, deleteMessage, pinMessage, reactMessage, saveEditMessage, saveReplyMessage, saveScrollMessage } from "@/stores/message/action";

import { TYPE_MESSAGE } from "@/shared/enums";
import { REACTIONS } from "@/shared/constants";
import { Message as MessageModel } from "@/shared/models/Message";
import { formatDate, formatTimeToHHMM, getFileNameFromUrl, getFilesMessage, getFileType, getImgsMessage, getTextMessage, isOnlyEmoji, renderHTMLMessage, showToast, urlify } from "@/shared/utils/utils";
import { Conversation } from "@/shared/models/Conversation";
import { banUser, kickUser, updateInfoConversation } from "@/stores/conversation/action";

import ReplyIcon from "../../../assets/icons/reply.svg?react";
import SmilePlusIcon from "../../../assets/icons/smile-plus.svg?react";
import ShareIcon from "../../../assets/icons/share.svg?react";
import ThreedotIcon from "../../../assets/icons/dot-three.svg?react";
import PinIcon from "../../../assets/icons/pin.svg?react";
import CopyIcon from "../../../assets/icons/copy.svg?react";
import DeleteIcon from "../../../assets/icons/delete.svg?react";
import CircleCheckIcon from "../../../assets/icons/circle-check.svg?react";
import ReportIcon from "../../../assets/icons/report.svg?react";
import EditIcon from "../../../assets/icons/edit2.svg?react";
import FileIcon from "../../../assets/icons/file-common.svg?react";

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

  const [ isShowMenuAction, setIsShowMenuAction ] = useState<boolean>(false);
  
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
    let textMessage: string = '';
    let imgsMessage: string[] = [];
    let filesMessage: string[] = [];

    if (message.type === TYPE_MESSAGE.HTML) {
      textMessage = getTextMessage(message.content);
      imgsMessage = getImgsMessage(message.content);
      filesMessage = getFilesMessage(message.content);
    }
  
    if (isDeleted) {
      return (
        <p className="text-gray3 px-2.5 py-1">
          <i>{t('deleted_message')}</i>
        </p>
      );
    }
    let isBanned = false;
    let isKicked = false;
    if (message.report) {
      isBanned = message.report.conversation.bannedMembers.includes(message.report.sender.id);
      isKicked = message.report.conversation.kickedMembers.includes(message.report.sender.id);
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
            message.report &&
            <div className="min-w-4 md:min-w-96">
              <p className="font-semibold">Báo cáo tin nhắn xấu hoặc spam</p>
              <p>Người báo cáo: <span className="font-semibold">{message.sender.name}</span></p>
              <p>Lý do: <span className="font-semibold">{message.report.reason}</span> </p>
              <p>Nhóm: <span className="font-semibold">{message.report.conversation.name}</span> </p>
              <div className="mb-0">
                Nội dung tin nhắn của <span className="font-semibold">{message.report.sender.name}:</span>
              </div>
            </div>
          }
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
              className="min-h-64 max-h-64 rounded-2xl object-cover max-w-xl cursor-pointer md-min-h-96 md-max-h-96"
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
                    className="min-h-64 max-h-64 rounded-lg object-cover max-w-xl md-max-h-96 md-min-h-96"
                    src={image}
                  ></ImageDetail>
                </div>
              ))}
            </div>
          }
          {
            message.type === TYPE_MESSAGE.HTML &&
            <>
              <div className='grid grid-cols-6 gap-2'>
                {imgsMessage.map((image, index) => (
                  <div
                    key={index}
                    className={classNames("cursor-pointer col-span-6", {
                      '!col-span-3': imgsMessage.length > 1,
                      '!col-span-6': index === 2 && imgsMessage.length === 3,
                    })}
                  >
                    <ImageDetail
                      className={classNames("min-h-64 max-h-64 rounded-t-lg object-cover md-max-h-96 md-min-h-96", {
                        '!rounded-lg': !textMessage || filesMessage.length
                      })}
                      src={image}
                    ></ImageDetail>
                  </div>
                ))}
              </div>
              <div
                className={classNames('flex flex-col space-y-0.5', {
                  'items-end': isCurrentUser,
                  'mt-0.5': filesMessage.length
                })}
              >
                {filesMessage.map((file, index) => (
                  <a
                    key={index}
                    className={classNames("flex items-center w-fit bg-primaryHover rounded-lg pr-4 py-1.5", {
                      '!bg-gray8': !isCurrentUser,
                    })}
                    href={file}
                    download
                  >
                    <div className={classNames("w-12 h-12 min-w-12 min-h-12 rounded-full bg-primaryHover flex justify-center items-center text-4xl", {
                      '!bg-gray8': !isCurrentUser,
                    })}>
                      <FileIcon />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-semibold line-clamp-1 text-ellipsis">{getFileNameFromUrl(file)}</p>
                      <span className="text-sm">3.7MB</span>
                    </div>
                  </a>
                ))}
              </div>
              {
                textMessage &&
                <div
                  className={classNames('bg-gray8 text-black rounded-b-lg py-1 px-2', {
                    '!bg-primaryHover !text-white ': isCurrentUser,
                    'mt-0.5 w-fit rounded-lg': filesMessage.length,
                    'ml-auto': filesMessage.length > 0 && isCurrentUser,
                  })}
                  dangerouslySetInnerHTML={{ __html: urlify(textMessage, isCurrentUser) }}
                >
                </div>
              }
            </>
          }
          {
            message.report &&
            <div className="flex justify-end space-x-4 mt-2">
              {
                !isBanned && !isKicked &&
                <Button
                  className="border border-gray2 px-4 py-1.5 rounded-md font-medium cursor-pointer hover:border-red1 hover:bg-red1 hover:text-white"
                  onClick={() => handleBanUser(message.report.sender, message.report.conversation.id)}
                >
                  Ban
                </Button>
              }
              {
                !isKicked &&
                <Button
                  className="border border-gray2 px-4 py-1.5 rounded-md font-medium cursor-pointer hover:border-red1 hover:bg-red1 hover:text-white"
                  onClick={() => handleKickUser(message.report.sender, message.report.conversation.id)}
                >
                  Kick
                </Button>
              }
            </div>
          }
        </>
      </Tooltip>
    );
  };

  const handleRenderReplyMessage = (message: MessageModel) => {
    let imgsMessage: string[] = [];
    let filesMessage: string[] = [];

    if (message.replyMessage.type === TYPE_MESSAGE.HTML) {
      imgsMessage = getImgsMessage(message.replyMessage.content);
      filesMessage = getFilesMessage(message.replyMessage.content);
    }

    if (message.replyMessage.isDeleted) {
      return (
        <p className="text-gray3 py-1">
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
        {
          message.replyMessage?.type === TYPE_MESSAGE.HTML &&
          <div>
            {
              imgsMessage.length > 0 ?
              <img className="min-w-12 w-12 h-12 object-cover" src={imgsMessage[0]}></img> :
              <div className="text-4xl -mx-1">
                <FileIcon />
              </div>
            }
          </div>
        }
        <div>
          <p className="text-sm font-semibold">{message.replyMessage.sender.name}</p>
          <p className="line-clamp-1 text-ellipsis pr-2 text-sm text-gray3 break-all">
            {
              renderHTMLMessage(message.replyMessage)
            }
          </p>
        </div>
      </>
    );
  };

  const handleScrollToMessage = (message: MessageModel) => {
    dispatch(clearScrollMessage());
    dispatch(saveScrollMessage(message));
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
    setIsShowMenuAction(false);
  };

  const handleDeleteMessage = () => {
    dispatch(deleteMessage({ id: message.id }, () => {
    }, () => {}));
  };

  const handleEditMessage = () => {
    dispatch(saveEditMessage(message));
  };

  const handleCopyMessage = () => {
    const value = message.content;
    navigator.clipboard.writeText(value);
    showToast('copied');
    handleClosePopover();
  };

  const handlePinMessage = () => {
    const body = {
      messageId: message.id,
      conversationId: message.conversationId,
    };
    dispatch(pinMessage(body, (conversation: Conversation) => {
      dispatch(updateInfoConversation(conversation));
      handleClosePopover();
      showToast(t('pinned'));
    }, () => {
    }));
  };

  const handleReportMessage = () => {
    appendDialog(
      <ReportMessageDialog
        conversationId={message.conversationId}
        messageId={message.id}
        onClick={() => console.log('first')}
      />
    )
  };

  const handleBanUser = (member: User, conversationId: string) => {
    appendDialog(
      <ConfirmDialog
        title={t('are_you_sure')}
        content={t('sure_ban_user')}
        onClick={() => {
          const data = {
            conversationId,
            userId: member.id,
          };
          dispatch(banUser(data, () => {
            showToast(t('ban_success'));
          }, () => {
          }));
        }}
      />
    );
  };

  const handleKickUser = (user: User, conversationId: string) => {
    appendDialog(
      <ConfirmDialog
        title={t('are_you_sure')}
        content={t('kick_content')}
        onClick={() => {
          const data = {
            conversationId,
            userId: user.id,
          };
          dispatch(kickUser(data, (conversation: Conversation) => {
            showToast(t('deleted_user'));
          }, () => {
          }));
        }}
      />
    );
  };

  const menusAction = [
    {
      title: 'pin',
      isShow: user.isAdmin,
      icon: <PinIcon />,
      onClick: handlePinMessage,
    },
    // {
    //   title: 'copy_message',
    //   isShow: !isDeleted && message.type !== TYPE_MESSAGE.IMAGE_LIST,
    //   icon: <CopyIcon />,
    //   onClick: handleCopyMessage,
    // },
    {
      title: 'edit',
      isShow: !isDeleted && isCurrentUser,
      icon: <EditIcon />,
      onClick: handleEditMessage,
    },
    {
      title: 'report',
      icon: <ReportIcon />,
      isShow: !isCurrentUser,
      onClick: handleReportMessage,
    },
    {
      title: 'delete',
      icon: <DeleteIcon />,
      isShow: !isDeleted && isCurrentUser,
      onClick: handleDeleteMessage,
    }
  ];

  if (message.type === TYPE_MESSAGE.NOTIFY) {
    return (
      <div className="flex justify-center items-center space-x-2 py-2">
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
      id={message.id}
      className={classNames("flex flex-col w-full relative", {
        "me": isCurrentUser,
        "him": !isCurrentUser,
        'last': isLastOfSection,
      })}
    >
      <div id={`message-background-${message.id}`} className="absolute w-full h-full inset-0 rounded-lg overflow-hidden"></div>
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
            <div className="text-gray5 text-xs mb-1 ml-2 flex items-center space-x-2">
              <span>{message.sender.name}</span>
              {
                (message.sender.hasVerified || message.sender.isAdmin) &&
                <div className="text-2xl text-primaryHover">
                  <CircleCheckIcon />
                </div>
              }
            </div>
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

              <div
                className="bg-gray9 p-2 mb-0.5 rounded-lg max-w-7/10 ml-2 cursor-pointer"
                onClick={() => handleScrollToMessage(message.replyMessage)}
              >
                <div className={classNames("border-l-4 border-primary pl-2", {
                  "flex items-center space-x-2": message.replyMessage?.type === TYPE_MESSAGE.IMAGE || message.replyMessage?.type === TYPE_MESSAGE.HTML
                })}>
                  {
                    handleRenderReplyMessage(message)
                  }
                </div>
              </div>
            </>
          }

          <div
            className={classNames("message-content min-w-9 min-h-9 max-w-7/10 relative px-3 py-1.5 flex items-center justify-center break-all", {
              "bg-gray8 ml-2": !isCurrentUser,
              "bg-primaryHover text-white": isCurrentUser,
              "!p-0 !bg-transparent": message.type === TYPE_MESSAGE.IMAGE || message.type === TYPE_MESSAGE.IMAGE_LIST || message.type === TYPE_MESSAGE.HTML,
              'bg-transparent !p-0': isOnlyEmojiMessage,
              '!px-3 !py-1.5 !bg-white': message.report && !isCurrentUser,
              '!px-3 !py-1.5 !bg-gray5': message.report && isCurrentUser,
              '!bg-transparent !p-0 border border-gray3': message.isDeleted
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
                  "left-full translate-x-4": !isCurrentUser,
                  "opacity-100": isShowMenuAction
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
                {/* {
                  !message.sender.isAdmin && !isCurrentUser &&
                  <div className="cursor-pointer" onClick={handleReportMessage}>
                    <ReportIcon />
                  </div>
                } */}

                {/* <div className="cursor-pointer" onClick={handleFowardMessage}>
                  <ShareIcon />
                </div> */}

                {/* {
                  user.isAdmin &&
                  <div className="cursor-pointer" onClick={handlePinMessage}>
                    <PinIcon />
                  </div>
                } */}
                <DynamicPopover
                  key={message.id}
                  ref={ popoverRef }
                  positions={[`${getPositionPopover(actionRef.current)}`]}
                  align={isCurrentUser ? 'end' : 'start'}
                  parentElement={actionRef.current}
                  triggerElm={
                    <div className="cursor-pointer">
                      <ThreedotIcon />
                    </div>
                  }
                  content={
                    <div className="py-1 bg-white rounded-sm shadow-2xl overflow-hidden">
                      {
                        menusAction.map((menuItem) => menuItem.isShow && (
                          <p
                            key={menuItem.title}
                            className="flex items-center space-x-3 text-black1 text-base px-4 py-1 cursor-pointer hover:bg-gray2"
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
                  onClickTrigger={() => setIsShowMenuAction(true)}
                />
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

export default memo(Message);
