import { auth } from "@/auth";

export const currentUser = async ()=>{
    const session = await auth();
    return session?.user;
}
// If you are using Admin Page and handle role setting from server side you can fetch user role from session.user.role here
export const currentRole = async ()=>{
    const session = await auth();
    return session?.user.role;
}