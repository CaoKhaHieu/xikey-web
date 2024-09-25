import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Dialog } from '..';
import Button from '../../button';
import Input from '../../input';
import Checkbox from '../../checkbox';
import Avatar from '../../avatar';
import Radio from '../../radio';
import { useLoading } from '../../loading';
import { Conversation } from '@/shared/models/Conversation';
import { upload } from '@/stores/common/actions';
import { User } from '@/shared/models/User';
import { getAllUsers, searchUser } from '@/stores/user/action';
import { addUser, createConversation, saveAllConversations, selectConversation, updateConversation, updateInfoConversation } from '@/stores/conversation/action';

import CameraIcon from "@/assets/icons/camera2.svg?react";
import SearchIcon from "@/assets/icons/search.svg?react";
import { showToast } from '@/shared/utils/utils';
import { CONVERSATION_STATUS } from '@/shared/enums';

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

const conversatioStatus = [
  {
    value: CONVERSATION_STATUS.PUBLIC,
    text: CONVERSATION_STATUS.PUBLIC,
  },
  {
    value: CONVERSATION_STATUS.PRIVATE,
    text: CONVERSATION_STATUS.PRIVATE,
  },
];

const CreateGroup = (props: CreateGroupOptions) => {
  const { type = 'CREATE', conversationEdit, close, afterClose, handleAfterUpdateConversation, ...otherProps } = props;
  const isCreateGroup = type === 'CREATE';
  const isEdit = type === 'EDIT';
  const isAddUser = type === 'ADD_USER';

  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<any>(0);

  const [avatarLocal, setAvatarLocal] = useState<string>(conversationEdit?.avatar || '');
  const [avatarGroup, setAvatarGroup] = useState<string>(conversationEdit?.avatar || '');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [valueInput, setValueInput] = useState<string>("");
  const pageRef = useRef<number>(page);

  const { user } = useSelector((state: any) => state.userReducer);
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
    getAllUser();
  }, []);

  useEffect(() => {
    const subscription = watch((value) => {
      if (isCreateGroup) {
        const isDisabledBtn = !value.groupName;
        setIsDisabled(isDisabledBtn);
      }
      if (isEdit) {
        const isDisabledBtn = value.groupName === conversationEdit?.name && value.status === conversationEdit?.status;
        setIsDisabled(isDisabledBtn);
      }
      if (isAddUser) {
        setIsDisabled(false);
      }
    });
    return () => subscription.unsubscribe()
  }, [watch]);

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
    const membersIds = (isEdit && conversationEdit) ? conversationEdit.members : Object.keys(data.groupMembers).filter(key => data.groupMembers[key] === true);

    const body: any = {
      avatar: avatarGroup,
      name: data.groupName,
      status: data.status,
      isGroup: true,
    };
    if (isCreateGroup) {
      body.members = [...membersIds, user.id];
      body.ownerId = user.id;
      dispatch(createConversation(body, (newConversation: Conversation) => {
        dispatch(saveAllConversations([newConversation, ...listConversations]));
        dispatch(selectConversation(newConversation));
        handleClose();
      }, () => {
      }));
    } else if (isEdit) {
      body.conversationId = conversationEdit?.id;
      dispatch(updateConversation(body, (newConversation: Conversation) => {
        dispatch(updateInfoConversation(newConversation));
        dispatch(selectConversation(newConversation));
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
        dispatch(selectConversation(newConversation));
        showToast(t('add_user_success'));
        handleClose();
        handleAfterUpdateConversation && handleAfterUpdateConversation(newConversation);
      }, () => {
      }));
    }
  };

  const handleChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValueInput(value);
    setPage(1);
    pageRef.current = 1;
    setAllUsers([]);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (!value) {
        getAllUser();
        return;
      }
      handleSearchUser(value);
    }, 300);
  };

  const handleSearchUser = (name?: string) => {
    const body = {
      name: name || valueInput,
      page: pageRef.current || page,
    };
    dispatch(searchUser(body, (usersResponse: User[], page: number, hasMore: boolean) => {
      if (page === 1) {
        setAllUsers(usersResponse);
      } else {
        setAllUsers([...allUsers, ...usersResponse]);
      }
      setPage(page + 1);
      setHasMore(hasMore);

      pageRef.current = page + 1;
    }, () => {
    }));
  };

  const getAllUser = () => {
    dispatch(getAllUsers({ page }, (usersResponse: User[], hasMore: boolean) => {
      setAllUsers([...allUsers, ...usersResponse]);
      setPage(page + 1);
      setHasMore(hasMore);

      pageRef.current = page + 1;
    }, () => {
    }));
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg overflow-scroll relative' closeRight close={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Dialog.Header className='text-4.25 font-semibold'>
          {t(titles[type])}
        </Dialog.Header>
        <Dialog.Body className='text-3.25 pt-2 whitespace-break mt-4 flex flex-col space-y-4'>
          {
            (isCreateGroup || isEdit) &&
            <div className='flex space-x-4 items-center'>
              <div className='min-w-16 w-16 h-16 rounded-full border border-gray2 flex items-center justify-center text-3xl overflow-hidden cursor-pointer' onClick={handleAvatarClick}>
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
              <div className='border rounded-full flex items-center space-x-2 px-4'>
                <SearchIcon />
                <Input
                  className='bg-transparent py-1.5'
                  placeholder={t('search_user')}
                  onChange={handleChangeInput}
                />
              </div>
              <div className='flex flex-col space-y-4 min-h-88 max-h-88 overflow-y-scroll' id="scrollDiv">
                <span className='font-semibold'>{t('all_user')}</span>
                <InfiniteScroll
                  className='flex flex-col space-y-4'
                  dataLength={allUsers.length}
                  next={valueInput ? handleSearchUser : getAllUser}
                  hasMore={hasMore}
                  loader={<></>}
                  scrollableTarget="scrollDiv"
                >
                  {
                    allUsers.map((user: User) => {
                      const isInGroup = !isCreateGroup && conversationEdit?.members.includes(user.id)
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
                                onChange={onChange}
                                render={() => (
                                  <div className='flex items-center space-x-2'>
                                    <Avatar
                                      className=''
                                      url={user.avatar}
                                      online={user.online}
                                    />
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
                </InfiniteScroll>
              </div>
            </>
          }
        </Dialog.Body>
        <Dialog.Footer className='pt-5 flex justify-end w-full px-4 py-2'>
          <Button
            type='submit'
            className={classNames('rounded-md px-10 py-1.5 bg-primaryHover border-primaryHover text-white', {
              "!bg-gray8 pointer-events-none !text-black1": isDisabled
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
