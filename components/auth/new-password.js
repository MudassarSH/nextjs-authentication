"use client"
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { NewPasswordSchema } from '@/schemas';
import { useSearchParams } from 'next/navigation'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import React from 'react'
import CardWrapper from './card-wrapper'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
import { newPassword } from '@/actions/new-password';

export const PasswordForm = () => {

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  console.log('Token:', token);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    }
  })
  const onSubmit = (values) => {
    setError('')
    setSuccess('')

    // console.log(values)
    startTransition(() => {
      newPassword(token, values)
        .then((data) => {
          setError(data?.error)
          //Todo when we add 2FA
          setSuccess(data?.success)
        });

    })
  }

  return (
    <CardWrapper
      headerLabel='Reset the Password'
      backButtonLabel="Back To Login"
      backButtonHref='/auth/login'
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="text-center w-full font-semibold"
          >
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
