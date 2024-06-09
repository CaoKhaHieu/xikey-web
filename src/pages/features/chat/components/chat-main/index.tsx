import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Message from "@/shared/components/message";
import { getListMessage, triggerAlertNewMessage} from "@/stores/message/action";
import { Message as MessageModel } from "@/shared/models/Message";
import { clearCurrentConversation, getInfoConversation, selectConversation } from "@/stores/conversation/action";
import { Loading } from "@/shared/components/loading";
import { Conversation } from "@/shared/models/Conversation";
import { TYPE_MESSAGE } from "@/shared/enums";
import { areTimeMessageOnSameDay, isTimeDifferenceGreaterThan5Minutes } from "@/shared/utils/utils";

import DoubleArrowDownIcon from "@/assets/icons/double-arrow-down.svg?react";

const ChatMain = () => {
  const [isShowAlertNewMessage, setIsShowAlertNewMessage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);

  const listMessage: MessageModel[] = Object.values(messageManagement.messages);
  const { currentConversation } = conversation;
  const { alert }: { alert: number} = messageManagement;

  const { t } = useTranslation();
  const { id }: { id: string } = currentConversation;
  const dispatch = useDispatch();
  const history = useHistory();
  
  const endSectionRef = useRef<HTMLDivElement>(null);
  const idConversationRef = useRef<string>(id);
  const listMessageRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const isScrollEndRef = useRef<boolean>(false);

  useEffect(() => {
    if (id) {
      handleGetUserChat();
      handleGetMessage();
      idConversationRef.current = id;
    }
    return () => {
      setIsLoading(true);
    };
  }, [id]);

  useEffect(() => {
    // scroll to end if have any reaction of message
    if (isScrollEndRef.current) {
      handleScrollToEnd();
    }
  }, [messageManagement.triggerScroll]);

  useEffect(() => {
    // handle show alert new message incase usesr not scroll to end list message
    if (alert === 0) {
      setIsShowAlertNewMessage(false);
      return;
    }
    const hasVerticalScrollbar = listMessageRef.current && listMessageRef.current.scrollHeight > listMessageRef.current.clientHeight;
    if (!isScrollEndRef.current && alert > 0 && hasVerticalScrollbar) {
      setIsShowAlertNewMessage(true);
    }
  }, [alert]);

  useEffect(() => {
    // scroll to end if have any reaction of message
    if (isScrollEndRef.current) {
      handleScrollToEnd();
    }
  }, [messageManagement.triggerScroll]);

  const handleGetUserChat = () => {
    dispatch(getInfoConversation(id, (conversation: Conversation) => {
      dispatch(selectConversation(conversation));
    }, () => {
      dispatch(clearCurrentConversation());
    }));
  };
  
  const handleGetMessage = (messageId?: string) => {
    const body = {
      conversationId: id,
      messageId: messageId || null,
    };
    dispatch(getListMessage(body, () => {
      if (listMessageRef.current) {
        listMessageRef.current.scrollTop = listMessageRef.current.scrollHeight - previousScrollHeightRef.current;
      }
      setIsLoading(false);
      if (!body.messageId) {
        handleScrollToEnd();
      }
    }, () => {
      setIsLoading(false);
    }));
  };

  const handleScrollToEnd = () => {
    endSectionRef.current?.scrollIntoView();
  };

  const handleScrollListMessage = (e: any) => {
    const { scrollTop } = e.target;
    // handle check scroll end list message
    if (listMessageRef.current) {
      const isScrollEndList = listMessageRef.current.scrollTop + listMessageRef.current.clientHeight >= listMessageRef.current.scrollHeight;
      isScrollEndRef.current = isScrollEndList;

      if (isScrollEndList) {
        dispatch(triggerAlertNewMessage({ type: 'RESET' }));
      }
    }
    // handle load more message
    if (scrollTop === 0) {
      const currentScrollHeight = listMessageRef.current ? listMessageRef.current.scrollHeight : 0;
      previousScrollHeightRef.current = currentScrollHeight;

      handleGetMessage(listMessage[0].id);
    }
  };

  const handleClickAlertNewMessage = () => {
    handleScrollToEnd();
    dispatch(triggerAlertNewMessage({ type: 'RESET' }));
  };

  if (isLoading) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div ref={listMessageRef} className="h-full p-4 overflow-y-scroll" onScroll={handleScrollListMessage}>
      <div className="flex flex-col space-y-0.5">
        {listMessage.length > 0 &&
          listMessage.map((message: MessageModel, index: number) => (
            <Message
              key={message.id}
              message={message}
              showAvatar={listMessage[index - 1]?.sender?.id !== listMessage[index].sender.id || listMessage[index - 1]?.type === TYPE_MESSAGE.NOTIFY}
              isShowName={currentConversation.isGroup && listMessage[index - 1]?.sender?.id !== listMessage[index].sender.id}
              isLastOfSection={listMessage[index].sender.id !== listMessage[index + 1]?.sender?.id}
              isLast={index === listMessage.length - 1}
              isShowDayName={!areTimeMessageOnSameDay(message.createdAt, listMessage[index - 1]?.createdAt)}
              isShowStartTime={isTimeDifferenceGreaterThan5Minutes(message.createdAt, listMessage[index - 1]?.createdAt)}
            />
          ))}
        {/* {
          listMessage.length === 0 &&
          <div className="flex flex-col justify-center items-center mt-40">
            <Avatar className="w-20 h-20" url={currentConversation.avatar} />
            <p className="text-white text-lg font-semibold mt-4">{currentConversation.name}</p>
            <p className="text-base text-primary italic mt-2">{t('quotes')}</p>
          </div>
        } */}
        {
          isShowAlertNewMessage &&
          <div
            className='sticky bottom-4 left-full right-0 flex items-center space-x-1 w-fit rounded px-3 py-1.5 bg-primaryHover text-white animate-bounce duration-200 cursor-pointer'
            onClick={handleClickAlertNewMessage}
          >
            <p className="text-xl"><DoubleArrowDownIcon /></p>
            <span>{t('alert_new_message')}</span>
          </div>
        }
      </div>
      <div ref={endSectionRef}></div>
    </div>
  );
};

export default ChatMain;
