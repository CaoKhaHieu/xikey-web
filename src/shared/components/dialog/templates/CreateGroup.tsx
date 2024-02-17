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
import { createConversation, saveAllConversations } from '@/stores/conversation/action';

import CameraIcon from "@/assets/icons/camera2.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";

interface CreateGroupOptions {
  close?: () => void;
  afterClose?: () => void;
}

const CreateGroup = (props: CreateGroupOptions) => {
  const { close, afterClose, ...otherProps } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarLocal, setAvatarLocal] = useState<string>('');
  const [avatarGroup, setAvatarGroup] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const { userManagement, user } = useSelector((state: any) => state.userReducer);
  const { conversation } = useSelector((state: any) => state.conversationReducer);
  const listConversations: Conversation[] = Object.values(conversation?.allConversations);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { setLoading } = useLoading();
  const {
    register,
    control,
    watch,
    handleSubmit,
  } = useForm({
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = watch((value) =>{
      const members: any[] = Object.values(value.groupMembers).filter((item: any) => !!item);
      const isDisabledBtn = !value.groupName || members.length < 2;
      setIsDisabled(isDisabledBtn);
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

    const body = {
      avatar: avatarGroup,
      name: data.groupName,
      members: [...membersIds, user.id],
    };
    dispatch(createConversation(body, (newConversation: Conversation) => {
      dispatch(saveAllConversations([newConversation, ...listConversations]));
      history.push(`/chat/${newConversation.id}`);
    }, () => {
    }));
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
          Create Group
        </Dialog.Header>
        <Dialog.Body className='text-3.25 text-white pt-2 whitespace-break mt-4'>
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
            <Input variant='auth' placeholder='Enter the group name' {...register('groupName')} />
          </div>
          <div className='mt-4 border border-white rounded-full flex items-center space-x-2 px-4'>
            <SearchIcon />
            <Input
              className='bg-transparent py-1.5'
              placeholder='Search user'
              onChange={handleSearchUser}
            />
          </div>
          <div className='flex flex-col space-y-4 mt-4 min-h-88 max-h-88 overflow-y-scroll'>
            <span className='font-semibold'>All users</span>
            {
              allUsers.map((user: User) => (
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
                        isChecked={value}
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
              ))
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
            {t('Create')}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog>
  );
};

export default CreateGroup;
