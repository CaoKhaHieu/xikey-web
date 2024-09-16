import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import Message from "@/shared/components/message";
import { clearScrollMessage, getListMessage, saveLastMesssageLoaded, saveScrollMessage, triggerAlertNewMessage} from "@/stores/message/action";
import { Message as MessageModel } from "@/shared/models/Message";
import { clearCurrentConversation, getInfoConversation, selectConversation } from "@/stores/conversation/action";
import { Loading } from "@/shared/components/loading";
import { Conversation } from "@/shared/models/Conversation";
import { TYPE_MESSAGE } from "@/shared/enums";
import { areTimeMessageOnSameDay, isElementInViewport, isTimeDifferenceGreaterThan5Minutes } from "@/shared/utils/utils";

import DoubleArrowDownIcon from "@/assets/icons/double-arrow-down.svg?react";

const ChatMain = () => {
  const [isShowAlertNewMessage, setIsShowAlertNewMessage] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);

  const listMessage: MessageModel[] = Object.values(messageManagement.messages);
  const { currentConversation }: { currentConversation: Conversation } = conversation;
  const { isLastMessageLoaded, triggerScroll }: { isLastMessageLoaded: boolean, triggerScroll: boolean } = messageManagement;
  const { alert, scrollMessage }: { alert: number, scrollMessage: MessageModel } = messageManagement;

  const { t } = useTranslation();
  const { id }: { id: string } = currentConversation;
  const dispatch = useDispatch();
  const history = useHistory();
  
  const startSectionRef = useRef<HTMLDivElement>(null);
  const endSectionRef = useRef<HTMLDivElement>(null);
  const idConversationRef = useRef<string>(id);
  const listMessageRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const isScrollEndRef = useRef<boolean>(true);
  const isHasMoreRef = useRef<boolean>(true);
  const isHasMoreDownRef = useRef<boolean>(true);

  useEffect(() => {
    if (id) {
      handleGetUserChat();
      handleGetMessage();
      idConversationRef.current = id;
      isHasMoreRef.current = true;
      isHasMoreDownRef.current = true;
      dispatch(saveLastMesssageLoaded(true));
    }
    return () => {
      setIsLoading(true);
    };
  }, [id]);

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
    if (scrollMessage.id) {
      const messageElement = document.getElementById(scrollMessage.id);
      if (!messageElement) {
        handleGetMessage(scrollMessage.id, 'UP', 1);
        return;
      }
      
      // already have message
      handleScrollToMessageElement(messageElement)
    }
  }, [scrollMessage]);

  useEffect(() => {
    if (triggerScroll) {
      handleScrollToEnd();

      // handle load latest message incase user clicked reply message then send new message
      if (!isLastMessageLoaded) {
        handleGetLatestMessages();
      }
    }
  }, [triggerScroll]);

  const handleScrollToMessageElement = (messageElement: any) => {
    messageElement.scrollIntoView();
    document.getElementById(`message-background-${scrollMessage.id}`)?.classList.remove('fade-out');
    document.getElementById(`message-background-${scrollMessage.id}`)?.classList.add('fade-bg');
    setTimeout(() => {
      document.getElementById(`message-background-${scrollMessage.id}`)?.classList.add('fade-out');
      dispatch(clearScrollMessage());
    }, 500);
  };

  const handleGetUserChat = () => {
    dispatch(getInfoConversation(id, (conversation: Conversation) => {
      dispatch(selectConversation(conversation));
    }, () => {
      dispatch(clearCurrentConversation());
    }));
  };
  
  const handleGetMessage = (messageId?: string, direction: 'UP' | 'DOWN' = 'UP', search = 0) => {
    const body = {
      conversationId: id,
      messageId: messageId || null,
      direction,
      search,
    };
    dispatch(getListMessage(body, (messages: MessageModel[]) => {
      if (!messages.length) {
        if (direction === 'UP') {
          isHasMoreRef.current = false;
        } else {
          isHasMoreDownRef.current = false;
        }
        setIsLoading(false);
        return;
      }
      if (listMessageRef.current) {
        if (direction === 'UP') {
          listMessageRef.current.scrollTop = previousScrollHeightRef.current;
        } else {
          listMessageRef.current.scrollTop = (listMessageRef.current.scrollHeight - listMessageRef.current.clientHeight - previousScrollHeightRef.current) * -1;
        }
      }
      setIsLoading(false);
      if (search && messageId) {
        const index = messages.findIndex(message => message.id === messageId);
        dispatch(saveScrollMessage(messages[index]));
        saveScrollMessage(messages[index]);
      }
      if (search || direction === 'DOWN') {
        const isLastMessageLoaded = messages[messages.length - 1].id === currentConversation.lastMessage.id;
        dispatch(saveLastMesssageLoaded(isLastMessageLoaded));
      }
    }, () => {
      setIsLoading(false);
    }));
  };

  const handleScrollToEnd = () => {
    endSectionRef.current?.scrollIntoView();
    isScrollEndRef.current = true;
  };

  const handleScrollListMessage = (e: any) => {
    const { scrollTop } = e.target;
    // handle check scroll end list message
    if (listMessageRef.current) {
      const isScrollEndList = scrollTop === 0;
      isScrollEndRef.current = isScrollEndList;

      const lastMessageInList = listMessage[listMessage.length - 1];
      if (isScrollEndList && currentConversation.lastMessage.id !== lastMessageInList.id) {
        const distanceScrollTop = listMessageRef.current?.scrollHeight - listMessageRef.current?.clientHeight;
        previousScrollHeightRef.current = distanceScrollTop;
        // no call api when user scroll to top and send a message
        if (!lastMessageInList.isSending) {
          handleGetMessage(lastMessageInList.id, 'DOWN');
        }
      }
      // handle remove alert new message
      if (isScrollEndList && isLastMessageLoaded) {
        dispatch(triggerAlertNewMessage({ type: 'RESET' }));
      }
      // handle load more message
      const isScrollToTop = (scrollTop * -1) + listMessageRef.current?.clientHeight >= listMessageRef.current?.scrollHeight;
      if (isScrollToTop && isHasMoreRef.current) {
        previousScrollHeightRef.current = scrollTop

        handleGetMessage(listMessage[0].id);
      }
    }
  };

  const handleClickAlertNewMessage = () => {
    dispatch(triggerAlertNewMessage({ type: 'RESET' }));
    if (isLastMessageLoaded) {
      handleScrollToEnd();
    } else {
      // handle incase user click reply message and scroll to top, then any message comming
      handleGetLatestMessages();
    }
  };

  const handleGetLatestMessages = () => {
    // using search = 1 to replace current list message
    handleGetMessage('', 'UP', 1);
  };

  if (isLoading) {
    return (
      <div className="h-full p-4 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div key={id} ref={listMessageRef} className="chat-background bg-black h-full p-4 overflow-y-scroll flex flex-col-reverse" onScroll={handleScrollListMessage}>
      <div className="flex flex-col space-y-0.5">
        <div id="start-list-message" ref={startSectionRef}></div>
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
        <div id="end-list-message" ref={endSectionRef}></div>
      </div>
    </div>
  );
};

export default ChatMain;
