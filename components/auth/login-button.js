"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog"
import { LoginForm } from './login-form';

// function LoginButtonProps({children, mode, asChild}){
//     children = children;
//     mode = mode || "redirect";
//     asChild = asChild || false;
// }


// const LoginButton = () => {
//   children,
//   mode = 'redirect'
//   asChild


//   return (
//     <span onClick={onClick} className='cursor-pointer'>{children}</span>
//   );
// };

// export default LoginButton
const LoginButton = ({ children, mode = 'redirect', asChild = false }) => {
  const router = useRouter();

  const onClick = ()=>{
    router.push('/auth/login')
  }
  if(mode ==='modal'){
    return(
      <Dialog>
        <DialogTrigger asChild={asChild}>
          {children}
        </DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm/>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <div onClick={onClick} className='cursor-pointer'>
      {children}
    </div>
  );
};

export default LoginButton;


