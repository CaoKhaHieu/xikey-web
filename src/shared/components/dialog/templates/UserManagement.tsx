import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import Input from '../../input';
import Avatar from '../../avatar';
import Button from '../../button';
import { Dialog } from '..';
import { useLoading } from '../../loading';

import { User } from '@/shared/models/User';
import { getAllUsers, searchUser, verifyUser } from '@/stores/user/action';

interface ConfirmDialogProps {
  close?: () => void;
}

const UserManagement = (props: ConfirmDialogProps) => {
  const { close, ...otherProps } = props;

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [valueInput, setValueInput] = useState<string>("");
  const pageRef = useRef<number>(page);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setLoading } = useLoading();

  useEffect(() => {
    if (valueInput) {
      handleSearchUser(valueInput);
    } else {
      getAllUser();
    }
  }, [valueInput]);

  const getAllUser = () => {
    if (pageRef.current === 1) {
      setLoading(true);
    }
    dispatch(getAllUsers({ page }, (usersResponse: User[], hasMore: boolean) => {
      setAllUsers([...allUsers, ...usersResponse]);
      setPage(page + 1);
      setHasMore(hasMore);

      pageRef.current = page + 1;
      setLoading(false);
    }, () => {
      setLoading(false);
    }));
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
      setLoading(false);
    }, () => {
      setLoading(false);
    }));
  };

  const handleVerifyUser = (user: User, verify: boolean) => {
    const data = {
      userId: user.id,
      verify,
    };
    setLoading(true);
    dispatch(verifyUser(data, (response: User) => {
      setLoading(false);

      const indexUser = allUsers.findIndex(user => user.id === response.id);
      allUsers[indexUser] = response;
      setAllUsers([...allUsers]);
    }, () => {
      setLoading(false);
    }))
  };

  const handleChangeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setValueInput(value);
    setPage(1);
    pageRef.current = 1;
    setAllUsers([]);
  };

  const handleClose = () => {
    close && close();
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg' closeRight close={handleClose}>
      <Dialog.Header className='text-4.25 font-semibold'>
        User Management
      </Dialog.Header>
      <Dialog.Body className='text-3.2 pt-2 whitespace-break'>
        <div id="scrollDiv" className='flex flex-col space-y-4 min-h-88 max-h-8/10 overflow-y-scroll'>
          <Input
            className='bg-transparent px-4 py-1.5 border border-gray2 rounded-lg'
            placeholder={t('search_user')}
            onChange={handleChangeInput}
          />

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
                return (
                  <div className='flex items-center justify-between' key={user.id}>
                    <div className='flex items-center space-x-2'>
                      <Avatar className='' url={user.avatar} />
                      <p>{user.name}</p>
                    </div>
                    <div>
                      {
                        !user.hasVerified ?
                        <Button
                          className='border border-gray2 rounded-md px-10 py-1.5 hover:bg-primaryHover hover:text-white hover:border-primaryHover'
                          onClick={() => handleVerifyUser(user, true)}
                        >
                          Verify
                        </Button> : 
                        <Button
                          className='text-red1 border border-gray2 rounded-md px-10 py-1.5 hover:bg-red1 hover:text-white hover:border-red1'
                          onClick={() => handleVerifyUser(user, false)}
                        >
                          Delete Verify
                        </Button>
                      }
                    </div>
                  </div>
                );
              })
            }
          </InfiniteScroll>
        </div>
      </Dialog.Body>
    </Dialog>
  );
};

export default UserManagement;
