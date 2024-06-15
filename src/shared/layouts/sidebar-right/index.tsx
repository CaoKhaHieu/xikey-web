import { useEffect, useState } from 'react'
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/shared/components/avatar';
import { Message } from '@/shared/models/Message';
import { TYPE_MESSAGE } from '@/shared/enums';
import { toggleSidebarRight } from '@/stores/common/actions';
import { getPinedMessages, unpinMessage } from '@/stores/message/action';

import CloseIcon from "../../../assets/icons/close.svg?react";
import ImageDetail from '@/shared/components/image-detail';
import { useDialog } from '@/shared/components/dialog';
import ConfirmDialog from '@/shared/components/dialog/templates/ConfirmDialog';

const MessageContent = ({ message }: { message: Message}) => {
  const { t } = useTranslation();
  const imgs = message.type === TYPE_MESSAGE.IMAGE_LIST ? message.content.split(',') : [];
  const totalImgs = imgs.length;
  
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
    </>
  );
};

const SidebarRight = () => {
  const { apiController } = useSelector((state: any) => state.commonReducer);
  const { messageManagement } = useSelector((state: any) => state.messageReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const { currentConversation } = conversation;

  const [pinedMessages, setPinedMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = currentConversation;
  const { t } = useTranslation();
  const { appendDialog } = useDialog();
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
    <div className='relative w-96 min-w-96 h-full overflow-scroll border-l border-gray2'>
      <div className='absolute right-1.5 top-1.5 cursor-pointer rounded-full p-2.5 hover:bg-gray2' onClick={closeSidebarRight}>
        <CloseIcon />
      </div>

      <h3 className='font-semibold text-center py-3'>Conversation Information</h3>

      <div className='px-2'>
        <h4 className='font-medium'>Pin Messages</h4>

        <div className='mt-2 flex flex-col space-y-4 overflow-auto'>
          {
            pinedMessages.length > 0 ? pinedMessages.map((message) => (
              <div className='flex space-x-3'>
                <Avatar className="cursor-pointer" url={message.sender.avatar} />
                <div className='flex flex-col mt-1.5 flex-1'>
                  <p className='flex justify-between w-full'>
                    <span className='font-semibold'>{message.sender.name}</span>
                    <span className='text-red cursor-pointer' onClick={() => handleRemovePinedMessage(message)}>Unpin</span>
                  </p>

                  <div className='mt-2'>
                    <MessageContent message={message} />
                  </div>
                </div>
              </div>
            )) : 
            <p className='text-center'>
              { !isLoading && t("You don't have any pinned messages yet") }
            </p>
          }
        </div>
      </div>
    </div>
  )
}

export default SidebarRight;
