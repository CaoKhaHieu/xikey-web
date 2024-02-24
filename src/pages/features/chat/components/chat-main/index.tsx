import { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/shared/components/message";
import { getListMessage, saveNewMessage, updateMessage } from "@/stores/message/action";
import { Message as MessageModel } from "@/shared/models/Message";
import { useSocket } from "@/shared/contexts/socket-context";
import { getInfoConversation, updateLastMessageConversation } from "@/stores/conversation/action";
import { useChat } from "@/shared/contexts/chat-context";
import Avatar from "@/shared/components/avatar";
import { Loading } from "@/shared/components/loading";
import { useTranslation } from "react-i18next";
import { Conversation } from "@/shared/models/Conversation";


const ChatMain = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const listMessage: MessageModel[] = Object.values(messageManagement.messages);

  const { t } = useTranslation();
  const { id }: { id: string } = useParams();
  const { selectedChat, handleSelectChat } = useChat();
  const { socket } = useSocket();
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
    if (id) {
      socket.on('new_message', (newMessage: MessageModel) => {
        if (idConversationRef.current === newMessage.conversationId) {
          dispatch(saveNewMessage(newMessage));
        }
        dispatch(updateLastMessageConversation(newMessage));
      });

      socket.on('reaction', (message: MessageModel) => {
        if (idConversationRef.current === message.conversationId) {
          dispatch(updateMessage(message));
        }
      });
    }
  }, [id]);

  useEffect(() => {
    handleScrollToEnd();
  }, [listMessage]);

  const handleGetUserChat = () => {
    dispatch(getInfoConversation(id, (conversation: Conversation) => {
      handleSelectChat(conversation);
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
              showAvatar={listMessage[index - 1]?.sender?.id !== listMessage[index].sender.id}
              onScrollEnd={handleScrollToEnd}
              isShowName={selectedChat.isGroup && listMessage[index - 1]?.sender?.id !== listMessage[index].sender.id}
            />
          ))}

        {
          listMessage.length === 0 &&
          <div className="flex flex-col justify-center items-center mt-40">
            <Avatar className="w-20 h-20" url={selectedChat.avatar} />
            <p className="text-white text-lg font-semibold mt-4">{selectedChat.name}</p>
            <p className="text-base text-primary italic mt-2">{t('quotes')}</p>
          </div>
        }
      </div>
      <div ref={endSectionRef}></div>
    </div>
  );
};

export default ChatMain;
