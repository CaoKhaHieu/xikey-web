import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

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
import { banUser, clearCurrentConversation, getMembers, kickUser, leaveGroup, removeConversation, removeGroup, selectConversation, unbanUser } from '@/stores/conversation/action';
import { isShowOnlineStatus, showToast } from '@/shared/utils/utils';

interface ConversationInfoOptions {
  conversation: Conversation,
  close?: () => void;
  afterClose?: () => void;
}

const ConversationInfo = (props: ConversationInfoOptions) => {
  const { conversation, close, ...otherProps } = props;

  const [members, setMembers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [ conversationInfo, setConversationInfo ] = useState<Conversation>(conversation);
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);
  const userChat = members.find((member: User) => member.id !== user.id);
  const isGroupChat = conversationInfo.isGroup;
  const isCloudChat = conversationInfo.isCloud;
  const isOwner = conversationInfo.ownerId === user.id;

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const { appendDialog } = useDialog();

  useEffect(() => {
    handleGetMembers();
  }, []);

  const handleClose = () => {
    close && close();
  };

  const handleAfterUpdateConversation = (conversation: Conversation) => {
    setConversationInfo(conversation);
    handleClose();
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

            const newMembers = members.filter(member => member.id !== user.id);
            setMembers(newMembers);
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
            dispatch(clearCurrentConversation());
            handleClose();
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
            showToast(t('remove_group_success'));
            dispatch(clearCurrentConversation());
            handleClose();
          }, () => {
          }));
        }}
      />
    );
  };

  const handleBanUser = (member: User) => {
    appendDialog(
      <ConfirmDialog
        title={t('are_you_sure')}
        content={t('sure_ban_user')}
        onClick={() => {
          const data = {
            conversationId: conversationInfo.id,
            userId: member.id,
          };
          dispatch(banUser(data, (conversation: Conversation) => {
            showToast(t('ban_success'));
            dispatch(selectConversation({ ...conversationInfo, bannedMembers: conversation.bannedMembers }));
            setConversationInfo({ ...conversationInfo, bannedMembers: conversation.bannedMembers });
          }, () => {
          }));
        }}
      />
    );
  };

  const handleUnbanUser = (member: User) => {
    appendDialog(
      <ConfirmDialog
        title={t('are_you_sure')}
        content={t('sure_unban_user')}
        onClick={() => {
          const data = {
            conversationId: conversationInfo.id,
            userId: member.id,
          };
          dispatch(unbanUser(data, (conversation: Conversation) => {
            showToast(t('unban_success'));
            dispatch(selectConversation({ ...conversationInfo, bannedMembers: conversation.bannedMembers }));
            setConversationInfo({ ...conversationInfo, bannedMembers: conversation.bannedMembers });
          }, () => {
          }));
        }}
      />
    );
  };

  const handleGetMembers = () => {
    dispatch(getMembers({
      conversationId: conversationInfo.id,
      page,
    }, (membersResponse: User[], hasMore: boolean, total: number) => {
      setPage(page + 1);
      setMembers([...members, ...membersResponse]);
      setHasMore(hasMore);
    }, () => {
    }));
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg overflow-scroll relative' closeRight close={handleClose}>
      <Dialog.Header className='text-lg text-center font-semibold'>
        {t('conversation_info')}
      </Dialog.Header>
      <Dialog.Body className='text-3.25 mt-6 whitespace-break'>
        <div className='flex items-center space-x-4'>
          <Avatar
            className='!w-20 !h-20'
            url={conversationInfo.avatar}
            online={isShowOnlineStatus(conversationInfo)}
          />
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
            <div className='flex flex-col space-y-4 max-h-72 overflow-y-scroll' id="scrollableDiv">
              <InfiniteScroll
                className='flex flex-col space-y-4'
                dataLength={members.length}
                next={handleGetMembers}
                hasMore={hasMore}
                loader={<></>}
                scrollableTarget="scrollableDiv"
              >
                {
                  members.map((member: User) => (
                    <div className='flex items-center space-x-4 justify-between cursor-pointer group' key={member.id}>
                      <div className='flex items-center space-x-4'>
                        <Avatar className='' url={member.avatar} />
                        <p className='line-clamp-1'>{member.name} {member.id === conversationInfo.ownerId && '(' + t('admin') + ')'}</p>
                      </div>
                      <div className='flex space-x-2'>
                        {
                          isOwner && member.id !== conversationInfo.ownerId &&
                          <Button className='text-red hidden group-hover:flex px-2' onClick={() => handleKickUser(member)}>{t('kick')}</Button>
                        }
                        {
                          isOwner && conversationInfo.bannedMembers.includes(member.id) && member.id !== conversationInfo.ownerId &&
                          <Button className='text-red hidden group-hover:flex px-2' onClick={() => handleUnbanUser(member)}>{t('unban')}</Button>
                        }
                        {
                          isOwner && !conversationInfo.bannedMembers.includes(member.id) && member.id !== conversationInfo.ownerId &&
                          <Button className='text-red hidden group-hover:flex px-2' onClick={() => handleBanUser(member)}>{t('ban')}</Button>
                        }
                      </div>
                    </div>
                  ))
                }
              </InfiniteScroll>
            </div>
          </div>
        }
        {
          isGroupChat && !isOwner &&
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

