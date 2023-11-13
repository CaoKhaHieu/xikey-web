import React from 'react';

import Button from '@/shared/components/button';
import Input from '@/shared/components/input';

import LogoIcon from "@/assets/icons/logo.svg?react";

const Login = () => {
  return (
    <div className='h-screen bg-black1 flex items-center justify-center'>
      <div className='max-w-sm flex flex-col space-y-8 w-full'>
        <div className='flex items-center justify-center text-8xl text-white mb-4'>
          <LogoIcon />
        </div>
        <Input variant='auth' type='email' label='Email' />
        <Input variant='auth' type='password' label='Password' />
        <Button variant='contained'>
          Login
        </Button>
      </div>
    </div>
  );
};

export default Login;
