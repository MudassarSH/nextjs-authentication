"use client"

//Two methods you can use logout from mile you created or using next-auth signout
import { logout } from "@/actions/logout"
// import { signOut } from "next-auth/react"

export const LogoutButton = ({children})=>{
    const onClick = ()=>{
        // signOut();
        logout();
    }
    return(
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}