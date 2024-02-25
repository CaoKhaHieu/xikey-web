import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Dialog, useDialog } from '..';
import ConfirmDialog from './ConfirmDialog';
import Avatar from '../../avatar';
import Button from '../../button';
import Tooltip from '../../tooltip';
import CreateGroup from './CreateGroup';
import { User } from '@/shared/models/User';

import LeaveIcon from "@/assets/icons/leave.svg?react";
import AddIcon from "@/assets/icons/add.svg?react";
import EditIcon from "@/assets/icons/edit.svg?react";
import DeleteIcon from "@/assets/icons/delete.svg?react";
import { Conversation } from '@/shared/models/Conversation';
import { kickUser, leaveGroup, removeConversation, removeGroup, selectConversation } from '@/stores/conversation/action';
import { showToast } from '@/shared/utils/utils';

interface ConversationInfoOptions {
  conversation: Conversation,
  close?: () => void;
  afterClose?: () => void;
}

const ConversationInfo = (props: ConversationInfoOptions) => {
  const { conversation, close, ...otherProps } = props;

  const [ conversationInfo, setConversationInfo ] = useState<Conversation>(conversation);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const userChat = conversationInfo.members.find((member: User) => member.id !== user.id);
  const isGroupChat = conversationInfo.isGroup;
  const isCloudChat = conversationInfo.isCloud;
  const isOwner = conversationInfo.ownerId === user.id;

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { appendDialog } = useDialog();

  const handleClose = () => {
    close && close();
  };

  const handleAfterUpdateConversation = (conversation: Conversation) => {
    setConversationInfo(conversation);
  };

  const handleOpenAddUserDialog = (type: 'CREATE' | 'ADD_USER' | 'EDIT') => {
    appendDialog(
      <CreateGroup
        type={type}
        conversationEdit={conversationInfo}
        handleAfterUpdateConversation={handleAfterUpdateConversation}
      />
    );
  };

  const handleKickUser = (user: User) => {
    appendDialog(
      <ConfirmDialog
        title={t('are_you_sure')}
        content={t('kick_content')}
        onClick={() => {
          const data = {
            conversationId: conversationInfo.id,
            userId: user.id,
          };
          dispatch(kickUser(data, (conversation: Conversation) => {
            dispatch(selectConversation(conversation));
            setConversationInfo(conversation);
            showToast(t('deleted_user'));
          }, () => {
          }));
        }}
      />
    );
  };

  const handleLeaveGroup = () => {
    appendDialog(
      <ConfirmDialog
        title={t('are_you_sure')}
        content={t('leave_group_content')}
        onClick={() => {
          const data = {
            conversationId: conversationInfo.id,
            userId: user.id,
          };
          dispatch(leaveGroup(data, (conversation: Conversation) => {
            dispatch(removeConversation(conversation));
            history.push('/');
          }, () => {
          }));
        }}
      />
    );
  };

  const handleRemoveGroup = () => {
    appendDialog(
      <ConfirmDialog
        title={t('are_you_sure')}
        content={t('remove_group_content')}
        onClick={() => {
          const data = {
            conversationId: conversationInfo.id,
          };
          dispatch(removeGroup(data, () => {
            dispatch(removeConversation(conversationInfo));
            history.push('/');
            showToast(t('remove_group_success'));
          }, () => {
          }));
        }}
      />
    );
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg overflow-scroll relative' closeRight close={handleClose}>
      <Dialog.Header className='text-lg text-center text-white font-semibold'>
        {t('conversation_info')}
      </Dialog.Header>
      <Dialog.Body className='text-3.25 text-white mt-6 whitespace-break'>
        <div className='flex items-center space-x-4'>
          <Avatar className='!w-20 !h-20' url={conversationInfo.avatar} />
          <p className='font-semibold text-xl line-clamp-1 flex items-center space-x-2'>
            <span>{conversationInfo.name}</span>
            {
              isOwner &&
              <span className='cursor-pointer' onClick={() => handleOpenAddUserDialog('EDIT')}>
                <EditIcon />
              </span>
            }
          </p>
        </div>
        <Button
          className='w-full bg-pink1 text-lg text-primaryHover font-semibold py-2.5 mt-4 rounded-lg hover:bg-pink2'
          onClick={handleClose}
        >
          {t('text_message')}
        </Button>
        {
          !isGroupChat && !isCloudChat &&
          <div className='mt-6 mb-2 flex flex-col space-y-2'>
            <p className='w-full'>
              <span>{t('email')} {userChat?.email}</span>
            </p>
            <p className='w-full'>
              <span>{t('phone')} ********</span>
            </p>
            <p className='w-full'>
              <span>{t('dob')} ********</span>
            </p>
          </div>
        }
        {
          isGroupChat &&
          <div className='mt-4 mb-2 flex flex-col space-y-2'>
            <div className='flex items-center justify-between'>
              <p>{t('members')} ({conversationInfo.members.length})</p>
              {
                isOwner &&
                <Tooltip
                  className=''
                  id='add_user'
                  content={t('add_user')}
                >
                  <p
                    className='text-2xl cursor-pointer duration-300 rounded hover:bg-pink1 hover:text-primaryHover'
                    onClick={() => handleOpenAddUserDialog('ADD_USER')}
                  >
                    <AddIcon />
                  </p>
                </Tooltip>
              }
            </div>
            <div className='flex flex-col space-y-4 max-h-72 overflow-y-scroll'>
              {
                conversationInfo.members.map((member: User) => (
                  <div className='flex items-center space-x-4 justify-between cursor-pointer group' key={member.id}>
                    <div className='flex items-center space-x-4'>
                      <Avatar className='' url={member.avatar} />
                      <p className='line-clamp-1'>{member.name}</p>
                    </div>
                    {
                      isOwner && member.id !== conversationInfo.ownerId &&
                      <Button className='text-red hidden group-hover:flex px-2' onClick={() => handleKickUser(member)}>{t('kick')}</Button>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        }
        {
          isGroupChat &&
          <div className='flex items-center space-x-4 cursor-pointer text-red mt-4 hover:text-gray1 duration-300' onClick={handleLeaveGroup}>
            <span className='text-xl'>
              <LeaveIcon />
            </span>
            <p>{t('leave_group')}</p>
          </div>
        }
        {
          isGroupChat && isOwner &&
          <div className='flex items-center space-x-4 cursor-pointer text-red mt-4 hover:text-gray1 duration-300' onClick={handleRemoveGroup}>
            <span className='text-xl'>
              <DeleteIcon />
            </span>
            <p>{t('remove_group')}</p>
          </div>
        }
      </Dialog.Body>
    </Dialog>
  );
};

export default ConversationInfo;

