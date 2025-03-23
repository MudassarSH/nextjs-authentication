import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='h-full flex justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-700 to-black text-white'>{children}</div>
  )
}

export default AuthLayout