"use server"

import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export const admin = async () => {
    const role = await currentRole();

    if (role !== UserRole.ADMIN){
        return {error: "FORBIDDEN Server Action! NOT ALLOWED!!!" }
    }

    return {success: "Allowed Server Action! 😉"}
};