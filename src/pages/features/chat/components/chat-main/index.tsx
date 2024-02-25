import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/shared/components/message";
import { getListMessage} from "@/stores/message/action";
import { Message as MessageModel } from "@/shared/models/Message";
import { getInfoConversation, selectConversation } from "@/stores/conversation/action";
import Avatar from "@/shared/components/avatar";
import { Loading } from "@/shared/components/loading";
import { useTranslation } from "react-i18next";
import { Conversation } from "@/shared/models/Conversation";
import { TYPE_MESSAGE } from "@/shared/enums";


const ChatMain = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listMessage: MessageModel[] = Object.values(messageManagement.messages);
  const { currentConversation } = conversation;

  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  const endSectionRef = useRef<HTMLDivElement>(null);
  const idConversationRef = useRef<string>(id);

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
    handleScrollToEnd();
  }, [listMessage]);

  const handleGetUserChat = () => {
    dispatch(getInfoConversation(id, (conversation: Conversation) => {
      dispatch(selectConversation(conversation));
    }, () => {
      history.push('/');
    }));
  };
  
  const handleGetMessage = () => {
    const body = {
      conversationId: id,
    };
    dispatch(getListMessage(body, () => {
      setIsLoading(false);
    }, () => {
      setIsLoading(false);
    }));
  };

  const handleScrollToEnd = () => {
    endSectionRef.current?.scrollIntoView();
  };

  if (isLoading) {
    return (
      <div className="h-full p-4 bg-black1 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-full p-4 bg-black1 overflow-y-scroll">
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

        {
          listMessage.length === 0 &&
          <div className="flex flex-col justify-center items-center mt-40">
            <Avatar className="w-20 h-20" url={currentConversation.avatar} />
            <p className="text-white text-lg font-semibold mt-4">{currentConversation.name}</p>
            <p className="text-base text-primary italic mt-2">{t('quotes')}</p>
          </div>
        }
      </div>
      <div ref={endSectionRef}></div>
    </div>
  );
};

export default ChatMain;
