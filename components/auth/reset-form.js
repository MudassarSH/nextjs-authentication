"use client"
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetSchema } from '@/schemas';

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
import { reset } from '@/actions/reset';

export const ResetForm = () => {

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const[isPending, startTransition] = useTransition();
  const form = useForm ({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    }
  })
const onSubmit = (values)=>{
  setError('')
  setSuccess('')

  // console.log(values)
  startTransition(()=>{
    reset(values)
      .then((data)=>{
        setError(data?.error)
        //Todo when we add 2FA
        setSuccess(data?.success)
      });

  })
  }

  return (
    <CardWrapper
      headerLabel='Forget Password'
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
            name="email"
            render={({field})=>(
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                  {...field}
                  disabled={isPending}
                  placeholder = "example@example.com"
                  type="email"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
            />

          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button
          disabled={isPending}
          type="submit"
          className="text-center w-full font-semibold"
          >
            Request the Password Reset Link
            </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
