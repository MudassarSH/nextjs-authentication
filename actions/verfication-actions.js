"use server"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"
export const newVerfication = async (token = '') => {
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {
        return { error: "Token Does not exist" }
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { error: "Token has expired! Please request a new one." }
    }

    const exisitingUser = await getUserByEmail(existingToken.email)
    if (!exisitingUser) {
        return { error: "User does not exist" }
    }

    await db.user.update({
        where: { id: exisitingUser.id},
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
        }
    });
    await db.verificationToken.delete({
        where: {id: existingToken.id}
    });

    return { success: "Email verified successfully!" }
}