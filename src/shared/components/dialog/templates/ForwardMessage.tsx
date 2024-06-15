import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [allGroups, setAllGroups] = useState<Conversation[]>([]);
  const { userManagement, user } = useSelector((state: any) => state.userReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listConversations: Conversation[] = Object.values(conversation?.allConversations);
  const groupConversations: Conversation[] = listConversations.filter((conversation: Conversation) => conversation.isGroup);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (userManagement?.allUsers) {
      setAllUsers(userManagement?.allUsers);
    }
  }, [userManagement]);

  useEffect(() => {
    setAllGroups(groupConversations);
  }, []);

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

  const handleSearchConversation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase();
    if (!searchValue) {
      setAllUsers(userManagement?.allUsers);
      return;
    }
    const users = userManagement?.allUsers?.filter((user: User) => user.name.toLowerCase().includes(searchValue));
    const groups = groupConversations.filter((conversation: Conversation) => conversation.name.toLowerCase().includes(searchValue));
    setAllUsers(users);
    setAllGroups(groups);
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg overflow-scroll relative' closeRight close={handleClose}>
      <Dialog.Header className='text-lg text-center font-semibold'>
        {t('forward')}
      </Dialog.Header>
      <Dialog.Body className='text-3.25 pt-2 whitespace-break'>
        <div className='my-4 border border-gray2 rounded-full flex items-center space-x-2 px-4'>
          <SearchIcon />
          <Input
            className='bg-transparent py-1.5'
            placeholder={t('search_user_or_group')}
            onChange={handleSearchConversation}
          />
        </div>
        <div className='min-h-88 max-h-88 overflow-y-scroll'>
          <div className='flex flex-col space-y-4'>
            {
              allUsers.length > 0 &&
              <span className='font-semibold'>{t('all_user')}</span>
            }
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
                    {t('send')}
                  </Button>
                </div>
              ))
            }
          </div>
          <div className='flex flex-col space-y-4 mt-4'>
            {
              allGroups.length > 0 &&
              <span className='font-semibold'>{t('all_group')}</span>
            }
            {
              allGroups.map((conversation: Conversation) => (
                <div className='flex items-center' key={conversation.id}>
                  <div className='flex items-center space-x-4 grow'>
                    <Avatar className='' url={conversation.avatar} />
                    <p className='line-clamp-1'>{conversation.name}</p>
                  </div>
                  <Button
                    className='bg-primaryHover px-3 py-1.5 cursor-pointer rounded-md text-sm text-white font-medium duration-300 hover:bg-primary'
                    onClick={() => handleCreateMessage(conversation.id)}
                  >
                    {t('send')}
                  </Button>
                </div>
              ))
            }
          </div>
        </div>
      </Dialog.Body>
    </Dialog>
  );
};

export default ForwardMessage;

