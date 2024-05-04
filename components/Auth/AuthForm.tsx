'use client';

import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../Input';
import Button from '../Button';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Variant = 'LOGIN' | 'REGISTER';

function AuthForm() {
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  function toggleVariant() {
    if (variant === 'LOGIN') setVariant('REGISTER');
    else setVariant('LOGIN');
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  function onSubmit(data: any) {
    setIsLoading(true);

    if (variant === 'REGISTER') handleRegister(data);

    if (variant === 'LOGIN') {
      // Next Auth Signin
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials');
          }

          if (callback?.ok || !callback?.error) {
            toast.success('Logged in!');
            router.push('/users');
          }
        })
        .finally(() => setIsLoading(false));
    }
  }

  function handleRegister(data: any) {
    axios
      .post(`/api/register`, data)
      .then(() => {
        toast.success('User created successfully');
        router.push('/users');
      })
      .catch((err) => toast.error(err.response?.data || 'Something went wrong'))
      .finally(() => setIsLoading(false));
  }

  function signInWith(action: string) {
    setIsLoading(true);

    // NextAuth Social Signin
    signIn(action, {
      redirect: false,
    }).then((callback) => {
      if (callback?.error) {
        toast.error('Invalid credentials');
      }

      if (callback?.ok || !callback?.error) {
        toast.success('Logged in!');
        router.push('/users');
      }
    });
  }

  const areInputsEmpty =
    watch('email').length === 0 ||
    watch('password').length === 0 ||
    (variant === 'REGISTER' && watch('name').length === 0);

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
          <Button
            type='submit'
            disabled={isLoading || areInputsEmpty}
            fullWidth
          >
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
