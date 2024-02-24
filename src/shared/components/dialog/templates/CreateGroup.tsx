import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { Dialog } from '..';
import Button from '../../button';
import Input from '../../input';
import Checkbox from '../../checkbox';
import Avatar from '../../avatar';
import { useLoading } from '../../loading';
import { Conversation } from '@/shared/models/Conversation';
import { upload } from '@/stores/common/actions';
import { User } from '@/shared/models/User';
import { addUser, createConversation, saveAllConversations, updateConversation, updateInfoConversation } from '@/stores/conversation/action';

import CameraIcon from "@/assets/icons/camera2.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";
import { showToast } from '@/shared/utils/utils';
import { useChat } from '@/shared/contexts/chat-context';

interface CreateGroupOptions {
  type?: 'CREATE' | 'ADD_USER' | 'EDIT';
  conversationEdit?: Conversation;
  close?: () => void;
  afterClose?: () => void;
  handleAfterUpdateConversation?: (conversation: Conversation) => void;
}

const titles = {
  CREATE: 'create_group',
  ADD_USER: 'add_user',
  EDIT: 'edit_group',
};

const CreateGroup = (props: CreateGroupOptions) => {
  const { type = 'CREATE', conversationEdit, close, afterClose, handleAfterUpdateConversation, ...otherProps } = props;
  const isCreateGroup = type === 'CREATE';
  const isEdit = type === 'EDIT';
  const isAddUser = type === 'ADD_USER';

  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarLocal, setAvatarLocal] = useState<string>(conversationEdit?.avatar || '');
  const [avatarGroup, setAvatarGroup] = useState<string>(conversationEdit?.avatar || '');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const { userManagement, user } = useSelector((state: any) => state.userReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listConversations: Conversation[] = Object.values(conversation?.allConversations);
  const listMemberIdConversationEdit = conversationEdit?.members.map((member: User) => member.id);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { setLoading } = useLoading();
  const { selectedChat, handleSelectChat } = useChat();
  const {
    register,
    control,
    watch,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const members: any[] = value.groupMembers && Object.values(value.groupMembers).filter((item: any) => !!item);
      if (isCreateGroup) {
        const isDisabledBtn = !value.groupName || members.length < 2;
        setIsDisabled(isDisabledBtn);
      }
      if (isEdit) {
        const isDisabledBtn = value.groupName === conversationEdit?.name;
        setIsDisabled(isDisabledBtn);
      }
      if (isAddUser) {
        const trueIds = [user.id];
        for (const key in value.groupMembers) {
          if (value.groupMembers[key] === true) {
            trueIds.push(key);
          }
        }
        const isDisabledBtn = trueIds.length === listMemberIdConversationEdit?.length;
        setIsDisabled(isDisabledBtn);
      }
    });
    return () => subscription.unsubscribe()
  }, [watch]);

  useEffect(() => {
    if (userManagement?.allUsers) {
      setAllUsers(userManagement?.allUsers);
    }
  }, [userManagement]);

  const handleClose = () => {
    close && close();
    afterClose && afterClose();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    };

    const file: File = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAvatarLocal(reader.result as string);
    };

    let formData = new FormData()
    formData.append("image", file);

    dispatch(upload(formData, (res: { url: string}) => {
      setAvatarGroup(res.url);
      if (isEdit) {
        setIsDisabled(false);
      }
    }, () => {
    }));
  };

  const handleAvatarClick = () => {
    inputRef.current?.click();
  };

  const onSubmit = (data: any) => {
    setLoading(true);
    const members: User[] = data.groupMembers ? userManagement?.allUsers.filter((item: any, index: number) => Object.values(data.groupMembers)[index] && !!item) : [];
    const membersIds = members.map((user: User) => user.id);

    const body: any = {
      avatar: avatarGroup,
      name: data.groupName,
    };
    if (isCreateGroup) {
      body.members = [...membersIds, user.id];
      body.ownerId = user.id;
      dispatch(createConversation(body, (newConversation: Conversation) => {
        dispatch(saveAllConversations([newConversation, ...listConversations]));
        history.push(`/chat/${newConversation.id}`);
      }, () => {
      }));
    } else if (isEdit) {
      body.conversationId = conversationEdit?.id;
      dispatch(updateConversation(body, (newConversation: Conversation) => {
        dispatch(updateInfoConversation(newConversation));
        handleSelectChat(newConversation);
        showToast(t('group_updated'));
        handleClose();
        handleAfterUpdateConversation && handleAfterUpdateConversation(newConversation);
      }, () => {}));
    } else {
      const body = {
        listUserId: [...membersIds, user.id],
        conversationId: conversationEdit?.id,
      };
      dispatch(addUser(body, (newConversation: Conversation) => {
        dispatch(updateInfoConversation(newConversation));
        handleSelectChat(newConversation);
        showToast(t('add_user_success'));
        handleClose();
        handleAfterUpdateConversation && handleAfterUpdateConversation(newConversation);
      }, () => {
      }));
    }
  };

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInput = e.target.value.toLowerCase();
    const usersFilter = userManagement?.allUsers?.filter((user: User) => user.name.toLowerCase().includes(valueInput));
    setAllUsers(usersFilter);
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg overflow-scroll relative' closeRight close={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Dialog.Header className='text-4.25 text-white font-semibold'>
          {t(titles[type])}
        </Dialog.Header>
        <Dialog.Body className='text-3.25 text-white pt-2 whitespace-break mt-4 flex flex-col space-y-4'>
          {
            (isCreateGroup || isEdit) &&
            <div className='flex space-x-4 items-center'>
              <div className='min-w-16 w-16 h-16 rounded-full border border-white flex items-center justify-center text-3xl overflow-hidden cursor-pointer' onClick={handleAvatarClick}>
                <div className="hidden">
                  <Input
                    ref={inputRef}
                    type="file"
                    id="input_file"
                    defaultValue=""
                    accept="image/*"
                    onChange={handleFileInputChange}
                  ></Input>
                </div>
                {
                  avatarLocal ?
                  <Avatar
                    className="!w-full !h-full !border-none min-w-16 min-h-16 flex items-center"
                    url={avatarLocal}
                  /> :
                  <CameraIcon />
                }
              </div>
              <Input variant='auth' placeholder={t('group_name_placeholder')} defaultValue={conversationEdit?.name || ''} {...register('groupName')} />
            </div>
          }
          {
            (isCreateGroup || isAddUser) &&
            <>
              <div className='border border-white rounded-full flex items-center space-x-2 px-4'>
                <SearchIcon />
                <Input
                  className='bg-transparent py-1.5'
                  placeholder={t('search_user')}
                  onChange={handleSearchUser}
                />
              </div>
              <div className='flex flex-col space-y-4 min-h-88 max-h-88 overflow-y-scroll'>
                <span className='font-semibold'>{t('all_user')}</span>
                {
                  allUsers.map((user: User) => {
                    const isInGroup = !isCreateGroup && conversationEdit?.members.findIndex((member: User) => member.id === user.id) !== -1;
                    return (
                      <div className='flex items-center' key={user.id}>
                        <Controller
                          control={control}
                          name={`groupMembers[${user.id}]`}
                          key={user.id}
                          render={({
                            field: { onChange, value },
                          }) => (
                            <Checkbox
                              key={user.id}
                              name={user.id}
                              readOnly={isInGroup}
                              isChecked={isCreateGroup ? value : isInGroup}
                              className='text-white'
                              onChange={onChange}
                              render={() => (
                                <div className='flex items-center space-x-2'>
                                  <Avatar className='' url={user.avatar} />
                                  <p>{user.name}</p>
                                </div>
                              )}
                            />
                          )}
                        />
                      </div>
                    );
                  })
                }
              </div>
            </>
          }
        </Dialog.Body>
        <Dialog.Footer className='pt-5 flex justify-end w-full bg-black1 px-4 py-2'>
          <Button
            type='submit'
            className={classNames('border rounded-md text-white px-10 py-1.5 bg-primaryHover border-primaryHover', {
              "!bg-gray1 !border-gray1 pointer-events-none": isDisabled
            })}
          >
            {t(isCreateGroup ? 'Create' : 'save')}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog>
  );
};

export default CreateGroup;
