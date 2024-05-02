'use client';

import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../Input';
import Button from '../Button';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';

type Variant = 'LOGIN' | 'REGISTER';

function AuthForm() {
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  function toggleVariant() {
    if (variant === 'LOGIN') setVariant('REGISTER');
    else setVariant('LOGIN');
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit() {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      // Call Axios Register
    }

    if (variant === 'LOGIN') {
      // Next Auth Signin
    }
  }

  function signInWith(action: string) {
    setIsLoading(true);

    // NextAuth Social Signin
  }

  return (
    <div
      className='mt-8
    sm:mx-auto
    sm:w-full
    sm:max-w-md'
    >
      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              id='name'
              label='Name'
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id='email'
            label='Email address'
            type='email'
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id='password'
            label='Password'
            type='password'
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Button type='submit' disabled={isLoading} fullWidth>
            {variant === 'LOGIN' ? 'Sign In' : 'Register'}
          </Button>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div
              className='
                absolute
                inset-0
                flex
                items-center
              '
            >
              <div
                className='
                  w-full 
                  border-t 
                  border-gray-300'
              />
            </div>
            <div
              className='
              relative 
              flex 
              justify-center 
              text-sm
            '
            >
              <span
                className='
                bg-white 
                px-2 
                text-gray-500'
              >
                Or continue with
              </span>
            </div>

            <div className='mt-6 flex gap-2'>
              <AuthSocialButton
                Icon={BsGithub}
                onClick={() => signInWith('github')}
              />
              <AuthSocialButton
                Icon={BsGoogle}
                onClick={() => signInWith('google')}
              />
            </div>
          </div>
        </div>

        <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>

          <div onClick={toggleVariant} className='underline cursor-pointer'>
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
