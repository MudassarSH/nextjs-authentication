"use client"
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';

import { RegisterSchema } from '@/schemas';

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
import { register } from '@/actions/register';

export const RegisterForm = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const[isPending, startTrnsition] = useTransition();
  const form = useForm ({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    }
  })
const onSubmit = (values)=>{
  setError('')
  setSuccess('')

  startTrnsition(()=>{
    register(values)
      .then((data)=>{
        setError(data.error)
        setSuccess(data.success)
      })
  })
  }

  return (
    <CardWrapper
      headerLabel='Create an Account'
      backButtonLabel="Already have an account?"
      backButtonHref='/auth/login'
      showSocial
    >
      <Form {...form}>
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
        >
          <div className='space-y-4'>
            <FormField
            control={form.control}
            name="name"
            render={({field})=>(
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                  {...field}
                  disabled={isPending}
                  placeholder = "Jhon Doe"
                  type="name"
                  />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
            />
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
            <FormField
            control={form.control}
            name="password"
            render={({field})=>(
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                  {...field}
                  disabled={isPending}
                  placeholder = "*****"
                  type="password"
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
            Register
            </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
