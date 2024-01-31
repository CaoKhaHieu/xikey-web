import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "@/shared/components/message";
import { TYPE_MESSAGE } from "@/shared/enums";
import { getListMessage } from "@/stores/message/action";
import { Message as MessageModel } from "@/shared/models/Message";


const ChatMain = () => {
  const endSectionRef = useRef<HTMLDivElement>(null);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const listMessage: MessageModel[] = Object.values(messageManagement.messages);

  const { id }: { id: string } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      handleGetMessage();
    }
  }, [id]);

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
          listMessage.map((message: MessageModel) => (
            <Message key={message.id} message={message} />
          ))}
      </div>
      <div ref={endSectionRef}></div>
    </div>
  );
};

export default ChatMain;
