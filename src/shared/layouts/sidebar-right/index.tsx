import { useEffect, useState } from 'react'
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/shared/components/avatar';
import ImageDetail from '@/shared/components/image-detail';
import { User } from '@/shared/models/User';
import { Message } from '@/shared/models/Message';
import { useDialog } from '@/shared/components/dialog';
import { useDevice } from '@/shared/contexts/device-context';
import { TYPE_MESSAGE } from '@/shared/enums';
import { toggleSidebarRight } from '@/stores/common/actions';
import { getPinedMessages, unpinMessage } from '@/stores/message/action';
import ConfirmDialog from '@/shared/components/dialog/templates/ConfirmDialog';
import { getImgsMessage, getTextMessage } from '@/shared/utils/utils';

import CloseIcon from "../../../assets/icons/close.svg?react";

const MessageContent = ({ message }: { message: Message}) => {
  const { t } = useTranslation();
  const imgs = message.type === TYPE_MESSAGE.IMAGE_LIST ? message.content.split(',') : [];
  const totalImgs = imgs.length;
  let textMessage: string = '';
  let imgsMessage: string[] = [];

  if (message.type === TYPE_MESSAGE.HTML) {
    textMessage = getTextMessage(message.content);
    imgsMessage = getImgsMessage(message.content);
  }

  if (message.isDeleted) {
    return (
      <p className="text-black">
        <i>{t('deleted_message')}</i>
      </p>
    );
  }
  
  return (
    <>
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
      {
        message.type === TYPE_MESSAGE.IMAGE &&
        <ImageDetail
          className="rounded-2xl object-cover min-h-96 max-h-96 max-w-xl cursor-pointer"
          src={message.content}
        ></ImageDetail>
      }
      {
        message.type === TYPE_MESSAGE.TEXT && message.content
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
                  '!col-span-6': index === 2 && imgs.length === 3,
                })}
              >
                <ImageDetail
                  className={classNames("max-h-64 rounded-t-lg object-cover md-max-h-96", {
                    '!rounded-lg': !textMessage
                  })}
                  src={image}
                ></ImageDetail>
              </div>
            ))}
          </div>
          {
            textMessage &&
            <div
              className={classNames('bg-gray8 text-black rounded-b-lg py-1 px-2')}
              dangerouslySetInnerHTML={{ __html: textMessage }}
            >
            </div>
          }
        </>
      }
    </>
  );
};

const SidebarRight = () => {
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversation;

  const [pinedMessages, setPinedMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = currentConversation;
  const { t } = useTranslation();
  const { appendDialog } = useDialog();
  const { isMobile } = useDevice();
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
    setIsLoading(true);
    dispatch(getPinedMessages(params, (data: Message[]) => {
      setPinedMessages(data);
      setIsLoading(false);
    }, () => {
    }));
  };

  const handleRemovePinedMessage = (message: Message) => {
    const body = {
      conversationId: id,
      messageId: message.id,
    };
    appendDialog(
      <ConfirmDialog
        title={t('are_you_sure')}
        content={t('Do you really want to unpin this message?')}
        onClick={() => {
          dispatch(unpinMessage(body, () => {
          }, () => {
          }));
        }}
      />
    );
  };

  const closeSidebarRight = () => {
    dispatch(toggleSidebarRight(false));
  };

  return (
    <div className={classNames('relative w-96 min-w-96 h-full overflow-scroll border-l border-gray2', {
      '!fixed right-0 bg-white': isMobile,
    })}>
      <div className='absolute right-1.5 top-1.5 cursor-pointer rounded-full p-2.5 hover:bg-gray2' onClick={closeSidebarRight}>
        <CloseIcon />
      </div>

      <h3 className='font-semibold text-center py-3'>{t('conversation_info')}</h3>

      <div className='px-2'>
        <h4 className='font-medium'>{t('pin_messages')}</h4>

        <div className='mt-2 flex flex-col space-y-4 overflow-auto'>
          {
            pinedMessages.length > 0 ? pinedMessages.map((message) => (
              <div className='flex space-x-3' key={message.id}>
                <Avatar className="cursor-pointer" url={message.sender.avatar} />
                <div className='flex flex-col mt-1.5 flex-1'>
                  <p className='flex justify-between w-full'>
                    <span className='font-semibold'>{message.sender.name}</span>
                    <span className='text-red cursor-pointer' onClick={() => handleRemovePinedMessage(message)}>{t('unpin')}</span>
                  </p>
                  <div className='mt-2'>
                    <MessageContent message={message} />
                  </div>
                </div>
              </div>
            )) : 
            <p className='text-center'>
              { !isLoading && t("no_pined_message") }
            </p>
          }
        </div>
      </div>
    </div>
  )
}

export default SidebarRight;
