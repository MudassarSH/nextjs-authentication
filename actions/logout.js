// Note: This method is useful only if you want to do some server stuff before want user to logout.
"use server"

import { signOut } from "@/auth"

export const logout = async ()=>{
    // Some server side logic here.
    //It can be anything. Like cleaning some user related information, deleting the user from server , anything.
    await signOut(); // For Server Component
}