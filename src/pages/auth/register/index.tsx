import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@/shared/components/button';
import Input from '@/shared/components/input';
import { registerAction } from '@/stores/auth/actions';
import { useLoading } from '@/shared/components/loading';
import { formValidateResolver, showToast } from '@/shared/utils/utils';

import LogoIcon from "@/assets/icons/logo.svg?react";

export type Inputs = {
  email: string,
  password: string,
  name: string;
  confirmPassword: string;
};
const schema = formValidateResolver(['name', 'email', 'password', 'confirmPassword']);

const Register = () => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: 'onBlur',
    resolver: yupResolver(schema) as any,
  });
  const { setLoading } = useLoading();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    dispatch(registerAction(data, () => {
      showToast(t('account_created'));
      reset();
      setLoading(false);
      history.push('/auth/login');
    }, () => {
      setLoading(false);
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='h-screen bg-black1 flex items-center justify-center'>
      <div className='max-w-sm flex flex-col space-y-8 w-full'>
        <div className='flex items-center justify-center text-8xl text-white mb-4'>
          <LogoIcon />
        </div>
        <Input variant='auth' type='name' label='Name' {...register('name')} error={errors.name?.message} />
        <Input variant='auth' type='email' label='Email' {...register('email')} error={errors.email?.message} />
        <Input variant='auth' type='password' label='Password' {...register('password')} error={errors.password?.message} />
        <Input variant='auth' type='password' label='Repeat Password' {...register('confirmPassword')} error={errors.confirmPassword?.message} />
        <Button variant='contained'>
          {t('register')}
        </Button>
      </div>
    </form>
  );
};

export default Register;
