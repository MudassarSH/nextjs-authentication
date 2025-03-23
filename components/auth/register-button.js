"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
const RegisterButton = ({ children, mode = 'redirect', asChild = false }) => {
  const router = useRouter();

  const onClick = ()=>{
    router.push('/auth/register')
  }
  if(mode ==='modal'){
    return(
      <span>
        Todo : Modal
      </span>
    )
  }
  return (
    <div onClick={onClick} className='cursor-pointer'>
      {children}
    </div>
  );
};

export default RegisterButton;


