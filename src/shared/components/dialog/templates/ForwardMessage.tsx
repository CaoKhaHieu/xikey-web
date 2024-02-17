import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dialog } from '..';
import Input from '../../input';
import Avatar from '../../avatar';
import Button from '../../button';
import { User } from '@/shared/models/User';
import { Message } from '@/shared/models/Message';

import SearchIcon from "@/assets/icons/search.svg?react";
import { createMessage } from '@/stores/message/action';
import { createConversation, saveAllConversations } from '@/stores/conversation/action';
import { Conversation } from '@/shared/models/Conversation';

interface ForwardMessageOptions {
  message: Message,
  close?: () => void;
  afterClose?: () => void;
}

const ForwardMessage = (props: ForwardMessageOptions) => {
  const { message, close, ...otherProps } = props;

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { userManagement, user } = useSelector((state: any) => state.userReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listConversations: Conversation[] = Object.values(conversation?.allConversations);
  const groupConversations: Conversation[] = listConversations.filter((conversation: Conversation) => conversation.isGroup);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userManagement?.allUsers) {
      setAllUsers(userManagement?.allUsers);
    }
  }, [userManagement]);

  const handleClose = () => {
    close && close();
  };

  const handleForwardMessage = (receiver: User) => {
    if (!receiver.conversationId) {
      const body = {
        members: [receiver.id, user.id],
      };
      dispatch(createConversation(body, (newConversation: Conversation) => {
        dispatch(saveAllConversations([newConversation, ...listConversations]));
        handleCreateMessage(newConversation.id);
      }, () => {
      }));
      return;
    }
    handleCreateMessage(receiver.conversationId);
  };

  const handleCreateMessage = (conversationId: string) => {
    const body = {
      conversationId: conversationId,
      sender: user.id,
      content: message.content,
      type: message.type,
    };
    dispatch(createMessage(body, () => {
    }, () => {}));
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg overflow-scroll relative' closeRight close={handleClose}>
      <Dialog.Header className='text-lg text-center text-white font-semibold'>
        Forward
      </Dialog.Header>
      <Dialog.Body className='text-3.25 text-white pt-2 whitespace-break'>
        <div className='mt-4 border border-white rounded-full flex items-center space-x-2 px-4'>
          <SearchIcon />
          <Input
            className='bg-transparent py-1.5'
            placeholder='Search user'
          />
        </div>
        <div className='min-h-88 max-h-88 overflow-y-scroll'>
          <div className='flex flex-col space-y-4 mt-4'>
            <span className='font-semibold'>All users</span>
            {
              allUsers.map((user: User) => (
                <div className='flex items-center' key={user.id}>
                  <div className='flex items-center space-x-4 grow'>
                    <Avatar className='' url={user.avatar} />
                    <p className='line-clamp-1'>{user.name}</p>
                  </div>
                  <Button
                    className='bg-primaryHover px-3 py-1.5 cursor-pointer rounded-md text-sm text-white font-medium duration-300 hover:bg-primary'
                    onClick={() => handleForwardMessage(user)}
                  >
                    Send
                  </Button>
                </div>
              ))
            }
          </div>
          <div className='flex flex-col space-y-4 mt-4'>
            <span className='font-semibold'>All Groups</span>
            {
              groupConversations.map((conversation: Conversation) => (
                <div className='flex items-center' key={conversation.id}>
                  <div className='flex items-center space-x-4 grow'>
                    <Avatar className='' url={conversation.avatar} />
                    <p className='line-clamp-1'>{conversation.name}</p>
                  </div>
                  <Button
                    className='bg-primaryHover px-3 py-1.5 cursor-pointer rounded-md text-sm text-white font-medium duration-300 hover:bg-primary'
                    onClick={() => handleCreateMessage(conversation.id)}
                  >
                    Send
                  </Button>
                </div>
              ))
            }
          </div>
        </div>
      </Dialog.Body>
      <Dialog.Footer className='pt-5 flex justify-end w-full bg-black1 px-4 py-2'>
      </Dialog.Footer>
    </Dialog>
  );
};

export default ForwardMessage;

