import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/shared/components/message";
import { getListMessage, saveNewMessage } from "@/stores/message/action";
import { Message as MessageModel } from "@/shared/models/Message";
import { useSocket } from "@/shared/contexts/socket-context";
import { updateLastMessageConversation } from "@/stores/conversation/action";


const ChatMain = () => {
  const endSectionRef = useRef<HTMLDivElement>(null);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const listMessage: MessageModel[] = Object.values(messageManagement.messages);

  const { id }: { id: string } = useParams();
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      handleGetMessage();
    }
  }, [id]);

  useEffect(() => {
    if (socket && id) {
      socket.on('new_message', (newMessage: MessageModel) => {
        dispatch(saveNewMessage(newMessage));
        dispatch(updateLastMessageConversation(newMessage));
      });
    }
  }, [socket, id]);

  useEffect(() => {
    endSectionRef.current?.scrollIntoView();
  }, [listMessage]);
  
  const handleGetMessage = () => {
    const body = {
      conversationId: id,
    };
    dispatch(getListMessage(body, () => {
    }, () => {
    }));
  };

  return (
    <div className="h-full p-4 bg-black1 overflow-y-scroll">
      <div className="flex flex-col space-y-4">
        {listMessage.length > 0 &&
          listMessage.map((message: MessageModel, index: number) => (
            <Message
              key={message.id}
              message={message}
              showAvatar={listMessage[index - 1]?.sender !== listMessage[index].sender}
            />
          ))}
      </div>
      <div ref={endSectionRef}></div>
    </div>
  );
};

export default ChatMain;
