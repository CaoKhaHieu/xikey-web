import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/shared/components/message";
import { getListMessage} from "@/stores/message/action";
import { Message as MessageModel } from "@/shared/models/Message";
import { getInfoConversation, selectConversation } from "@/stores/conversation/action";
import { Loading } from "@/shared/components/loading";
import { Conversation } from "@/shared/models/Conversation";
import { TYPE_MESSAGE } from "@/shared/enums";

const ChatMain = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listMessage: MessageModel[] = Object.values(messageManagement.messages);
  const { currentConversation } = conversation;

  const { id }: { id: string } = useParams();
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

  const handleGetUserChat = () => {
    dispatch(getInfoConversation(id, (conversation: Conversation) => {
      dispatch(selectConversation(conversation));
    }, () => {
      history.push('/');
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
    setTimeout(() => {
      endSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  };

  const handleScrollListMessage = (e: any) => {
    const { scrollTop } = e.target;
    // handle check scroll end list message
    if (listMessageRef.current) {
      const isScrollEndList = listMessageRef.current.scrollTop + listMessageRef.current.clientHeight >= listMessageRef.current.scrollHeight;
      isScrollEndRef.current = isScrollEndList;
    }
    // handle load more message
    if (scrollTop === 0) {
      const currentScrollHeight = listMessageRef.current ? listMessageRef.current.scrollHeight : 0;
      previousScrollHeightRef.current = currentScrollHeight;

      handleGetMessage(listMessage[0].id);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full p-4 bg-black1 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div ref={listMessageRef} className="h-full p-4 bg-black1 overflow-y-scroll" onScroll={handleScrollListMessage}>
      <div className="flex flex-col space-y-4">
        {listMessage.length > 0 &&
          listMessage.map((message: MessageModel, index: number) => (
            <Message
              key={message.id}
              message={message}
              showAvatar={listMessage[index - 1]?.sender?.id !== listMessage[index].sender.id || listMessage[index - 1]?.type === TYPE_MESSAGE.NOTIFY}
              onScrollEnd={handleScrollToEnd}
              isShowName={currentConversation.isGroup && listMessage[index - 1]?.sender?.id !== listMessage[index].sender.id}
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
      </div>
      <div ref={endSectionRef}></div>
    </div>
  );
};

export default ChatMain;
