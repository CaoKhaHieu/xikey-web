import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import classNames from "classnames";

import { TYPE_MESSAGE } from "@/shared/enums";
import { Message } from "@/shared/models/Message";
import { getPinedMessages, unpinMessage } from "@/stores/message/action";

import ChatIcon from "@/assets/icons/chat.svg?react";

const MessageContent = ({ message }: { message: Message}) => {
  const { t } = useTranslation();
  return (
    <>
      {
        message.sender.name + ': '
      }
      {
        message.type === TYPE_MESSAGE.IMAGE && t('image')
      }
      {
        message.type === TYPE_MESSAGE.TEXT && message.content
      }
    </>
  );
};

const PinMessages = () => {
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversation;

  const [pinedMessages, setPinedMessages] = useState<Message[]>([]);
  const [isShowMore, setIsShowMore] = useState<boolean>(false);

  const { id } = currentConversation;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    handleGetListPinedMessages();

    return () => {
      setPinedMessages([]);
    }
  }, [id]);

  useEffect(() => {
    if (messageManagement.triggerGetPinedMessage) {
      handleGetListPinedMessages();
    }
  }, [messageManagement.triggerGetPinedMessage]);

  const handleGetListPinedMessages = () => {
    const params = {
      conversationId: id,
    };
    dispatch(getPinedMessages(params, (data: Message[]) => {
      setPinedMessages(data);
    }, () => {
    }));
  };

  const handleShowMore = (value: boolean) => {
    setIsShowMore(value);
  };

  const handleRemovePinedMessage = (message: Message) => {
    const body = {
      conversationId: id,
      messageId: message.id,
    };
    dispatch(unpinMessage(body, () => {
    }, () => {
    }))
  };

  if (!pinedMessages.length) {
    return null;
  }

  return (
    <div className={classNames('block bg-white')}>
      <div className={classNames('transition-all duration-100 overflow-hidden', {
        'h-14': !isShowMore,
        'h-full': isShowMore
      })}>
        {
          pinedMessages.map((message: Message) => (
            <div
              key={message.id}
              className={
                classNames('py-2 px-4 flex items-center justify-between overflow-hidden cursor-pointer hover:bg-gray2')
              }
            >
              <div className='flex justify-center space-x-3'>
                <div>
                  <ChatIcon />
                </div>
                <div className='flex flex-col justify-center'>
                  <p className="text-sm">{t('message')}</p>
                  <p className='line-clamp-1 text-xs'>
                    <MessageContent message={message} />
                  </p>
                </div>
              </div>
              <div
                className='text-red text-sm whitespace-nowrap cursor-pointer hover:underline'
                onClick={!isShowMore ? () => handleShowMore(true) : () => handleRemovePinedMessage(message)}
              >
                {
                  !isShowMore ? 'Show more' : t('delete')
                }
              </div>
            </div>
          ))
        }
        <div
          className='flex items-center justify-center py-2 text-red text-sm whitespace-nowrap cursor-pointer duration-300 hover:underline'
          onClick={() => handleShowMore(false)}
        >
          Show less
        </div>
      </div>
    </div>
  );
};

export default PinMessages;
