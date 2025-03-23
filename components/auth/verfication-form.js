"use client"

import { RingLoader } from 'react-spinners'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { newVerfication } from '@/actions/verfication-actions'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
export const NewVerficationForm = () => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const onSubmit = useCallback(()=>{
        if(success || error) return;
        if(!token) {
            setError('Missing Token');
            return;
        };
        newVerfication(token)
         .then((data)=>{
            setError(data.error);
            setSuccess(data.success);
         }).catch(()=>{
            setError('Something went wrong. Please try again later. If the problem persists, contact support team.');
         })
    },[token, success, error])

    useEffect(()=>{
        onSubmit();
    },[onSubmit])
    return (
        <CardWrapper
            headerLabel="Confirming Your Verfication of Email"
            backButtonLabel='Back to Login to Get new Verification Email'
            backButtonHref='/auth/login'
        >
            <div className='flex items-center justify-center w-full'>
                {!success && !error && (
                    <RingLoader color="#b434db"  />
                    )}
                <FormSuccess message={success}/>
                {!success &&(
                <FormError message={error}/>
                )}
            </div>

        </CardWrapper>
    )
}