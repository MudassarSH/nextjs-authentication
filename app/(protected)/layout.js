import React from 'react'
import { Navbar } from './_components/navbar'

const ProtectedLayout = ({ children }) => {
    return (
        <div className='h-full w-full flex flex-col text-center justify-center gap-y-10 text-black items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c11919] to-[#f75b00] '>
            <Navbar />
            {children}
        </div>
    )
}

export default ProtectedLayout