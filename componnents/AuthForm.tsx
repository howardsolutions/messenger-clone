'use client';

import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';

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

  function onSubmit(data) {
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
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}></form>
      </div>
    </div>
  );
}

export default AuthForm;
