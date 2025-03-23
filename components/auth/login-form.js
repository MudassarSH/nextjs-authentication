"use client"
import * as z from 'zod';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
// import { AuthError } from 'next-auth';
import { LoginSchema } from '@/schemas';

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
import { login } from '@/actions/login';
import Link from 'next/link';
// import { useRouter } from 'next/navigation';

export const LoginForm = () => {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email already in Use with different provider!"
    : "";
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const[isPending, startTrnsition] = useTransition();
  const form = useForm ({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })
const onSubmit = (values)=>{
  setError('')
  setSuccess('')

  startTrnsition(()=>{
    login(values, callbackUrl)
      .then((data)=>{
        if(data?.error){
          form.reset();
          setError(data.error);
        }
        if(data?.success){
          form.reset();
          setSuccess(data.success);
        }
        if(data?.twoFactor){
          setShowTwoFactor(true)
        }
        // if (data?.redirect) {
        //   // Handle redirect here
        //   router.push(data.redirect);
        // }
      })
      .catch(()=>{setError("Something went wrong. Please try again later!")})

  })
  }

  return (
    <CardWrapper
      headerLabel='Welcome Back'
      backButtonLabel="Don't have an account?"
      backButtonHref='/auth/register'
      showSocial
    >
      <Form {...form}>
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-6'
        >
          <div className='space-y-4'>
            {showTwoFactor && (
              <FormField
              control={form.control}
              name="code"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <Input
                    {...field}
                    disabled={isPending}
                    placeholder = "123456"
                    type="number"
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}
              />
            )}
            {!showTwoFactor &&(
              <>
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
                <Button
                variant= "link"
                size="sm"
                asChild
                className="px-0 w-full text-center font-normal text-normal"
                >
                  <Link href="/auth/reset">
                  Reset Password?
                  </Link>
                </Button>
                <FormMessage/>
              </FormItem>
            )}
            />
            </>
            )}
          </div>
          <FormError message={error || urlError}/>
          <FormSuccess message={success}/>
          <Button
          disabled={isPending}
          type="submit"
          className="text-center w-full font-semibold"
          >
            {showTwoFactor ? "Confirm Code" : "Login"}
            </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
