import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

import { Dialog } from '..';
import Button from '../../button';
import Input from '../../input';
import { User } from '@/shared/models/User';

import { updateInfoAccount } from '@/stores/user/action';
import { formValidateResolver } from '@/shared/utils/utils';

interface AccountInfoOptions {
  close?: () => void;
}

export type Inputs = {
  name: string;
  email: string
};

const schema = formValidateResolver(['name', 'email']);

const AccountInfo = (props: AccountInfoOptions) => {
  const { close, ...otherProps } = props;
  const { user }: { user: User } = useSelector((state: any) => state.userReducer);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onBlur',
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    if (user.id) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  const handleClose = () => {
    close && close();
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(updateInfoAccount(data, () => {
      handleClose();
    }, () => {
    }));
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg' closeRight close={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Dialog.Header className='text-4.25 text-white font-semibold'>
          {t('update_personal_info')}
        </Dialog.Header>
        <Dialog.Body className='text-3.25 text-white pt-4 whitespace-break flex flex-col space-y-4'>
          <Input variant='auth' type='email' label='Email' {...register('email')} error={errors.email?.message} />
          <Input variant='auth' type='name' label='Name' {...register('name')} error={errors.name?.message} />
        </Dialog.Body>
        <Dialog.Footer className='pt-5 flex justify-end'>
          <Button
            type='submit'
            className='border border-gray2 rounded-md text-white px-10 py-1.5'
          >
            {t('save')}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog>
  );
};

export default AccountInfo;
