import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@/shared/components/button';
import Input from '@/shared/components/input';

import LogoIcon from "@/assets/icons/logo.svg?react";
import { formValidateResolver } from '@/shared/utils/utils';
import { useLoading } from '@/shared/components/loading';
import { login } from '@/stores/auth/actions';

export type Inputs = {
  email: string,
  passwordLogin: string,
};

const schema = formValidateResolver(['email', 'passwordLogin',]);
const Login = () => {
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
    const query = {
      email: data.email,
      password: data.passwordLogin,
    };
    setLoading(true);
    dispatch(login(query, () => {
      reset();
      setLoading(false);
      history.push('/');
    }, () => {
      setLoading(false);
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='h-screen flex items-center justify-center'>
      <div className='max-w-sm flex flex-col space-y-8 w-full'>
        <div className='flex items-center justify-center text-8xl text-black1 mb-4'>
          <LogoIcon />
        </div>
        <Input variant='auth' type='email' label='Email' {...register('email')} error={errors.email?.message} />
        <Input variant='auth' type='password' label='Password' {...register('passwordLogin')} error={errors.passwordLogin?.message} />
        <Button variant='contained'>
          {t('login')}
        </Button>
        <p className='text-base text-black1 flex items-center mx-auto'>
          {t('no_account')}
          <Link className='text-primary ml-1' to='/auth/register'>{t('register')}</Link>
        </p>
      </div>
    </form>
  );
};

export default Login;
