"use client"
import { logout } from '@/actions/logout';
import { useCurrentUser } from '@/hooks/use-current-user';
// For working of signOut in client component you have two methods. First method is to import signOut from next-auth/react and creacte onClick event which will only trigger signOut and connect with submit button. The second method is to add logout file in action and connect here. Also the second method will be useful only if you want to do some server stuff before want user to logout. Also make sure to import singOut from @auth not from next-auth/react.
import { signOut, useSession } from 'next-auth/react';
// "use server"
// import { auth, signOut } from '@/auth' // Also remove that import if you are using client component
import React from 'react'

// const SettingPage = async () => { // For Server
const SettingPage =  () => {
  const user = useCurrentUser(); // To fetch user data directly instead of enclosed in user brackets during session.x
    // const session = useSession(); // For Sevre Component. For client component remove async and give session empty brackets {} and later use useSession()
    const onClick = ()=>{
      // signOut(); // For use Client scenario
      logout(); // Add this function if you created logout action in another file. Read above.
    }
    // session.user
  return (
    <div className='bg-white text-black'>
      {JSON.stringify(user)}
      {/* <form action={async ()=>{ // Also for sever we have to keep that async action here. but for client component remove async action.
        "use server"
        await signOut();
      }}> */}

        <button onClick={onClick} className='bg-black text-white p-2 rounded-xl m-5 hover:scale-[1.12]' type='submit'>Log Out</button>
    </div>
  )
}

export default SettingPage