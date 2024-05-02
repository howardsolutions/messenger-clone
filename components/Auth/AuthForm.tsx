'use client';

import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Input from '../Input';
import Button from '../Button';

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

  function socialAction(action: string) {
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
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
              <div className='relative flex justify-center text-sm'>
                <span className='bg-white px-2 text-gray-500'>
                  Or Continue With
                </span>
              </div>
            </div>

            <div className='flex mt-6 gap-2'></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
