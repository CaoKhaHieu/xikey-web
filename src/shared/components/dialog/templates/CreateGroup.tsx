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
import { createConversation, saveAllConversations, updateConversation, updateInfoConversation } from '@/stores/conversation/action';

import CameraIcon from "@/assets/icons/camera2.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";
import { showToast } from '@/shared/utils/utils';
import { useChat } from '@/shared/contexts/chat-context';

interface CreateGroupOptions {
  type?: 'CREATE' | 'ADD_USER';
  conversationEdit?: Conversation;
  close?: () => void;
  afterClose?: () => void;
  handleAfterUpdateConversation?: (conversation: Conversation) => void;
}

const CreateGroup = (props: CreateGroupOptions) => {
  const { type = 'CREATE', conversationEdit, close, afterClose, handleAfterUpdateConversation, ...otherProps } = props;
  const isCreateGroup = type === 'CREATE';

  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarLocal, setAvatarLocal] = useState<string>(conversationEdit?.avatar || '');
  const [avatarGroup, setAvatarGroup] = useState<string>(conversationEdit?.avatar || '');
  const [isDisabled, setIsDisabled] = useState<boolean>(!!isCreateGroup);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const { userManagement, user } = useSelector((state: any) => state.userReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listConversations: Conversation[] = Object.values(conversation?.allConversations);
  const listMemberIdConversationEdit = JSON.stringify(conversationEdit?.members.map((member: User) => member.id));

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
      const members: any[] = Object.values(value.groupMembers).filter((item: any) => !!item);
      if (isCreateGroup) {
        const isDisabledBtn = !value.groupName || members.length < 2;
        setIsDisabled(isDisabledBtn);
      }
      if (!isCreateGroup) {
        const isDisabledBtn = !value.groupName;
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
    }, () => {
    }));
  };

  const handleAvatarClick = () => {
    inputRef.current?.click();
  };

  const onSubmit = (data: any) => {
    setLoading(true);
    const members: User[] = userManagement?.allUsers.filter((item: any, index: number) => Object.values(data.groupMembers)[index] && !!item);
    const membersIds = members.map((user: User) => user.id);

    const body: any = {
      avatar: avatarGroup,
      name: data.groupName,
      members: [...membersIds, user.id],
    };
    if (isCreateGroup) {
      dispatch(createConversation(body, (newConversation: Conversation) => {
        dispatch(saveAllConversations([newConversation, ...listConversations]));
        history.push(`/chat/${newConversation.id}`);
      }, () => {
      }));
    } else {
      body.conversationId = conversationEdit?.id;
      dispatch(updateConversation(body, (newConversation: Conversation) => {
        dispatch(updateInfoConversation(newConversation));
        handleSelectChat(newConversation);
        showToast(t('group_updated'));
        handleClose();
        handleAfterUpdateConversation && handleAfterUpdateConversation(newConversation);
      }, () => {}));
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
          {t(isCreateGroup ? 'create_group' : 'edit_group')}
        </Dialog.Header>
        <Dialog.Body className='text-3.25 text-white pt-2 whitespace-break mt-4 flex flex-col space-y-4'>
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
