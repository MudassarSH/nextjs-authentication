"use server"

import { db } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { NewPasswordSchema } from "@/schemas"
import bcrypt from 'bcryptjs'
import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
export const newPassword = async (token = '', values) => {
    if(!token){
        return { error: "Token is Missing" }
    }
    const validateField = NewPasswordSchema.safeParse(values);
    if(!validateField.success){
        return {error: "Invalid Field" }
    }
    const {password} = validateField.data;


    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
        return { error: "Token Does not exist" }
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { error: "Token has expired! Please request a new one." }
    }

    const exisitingUser = await getUserByEmail(existingToken.email)
    if (!exisitingUser) {
        return { error: "Email does not exist! Please register first" }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
        where: { id: exisitingUser.id},
        data: {
            password: hashedPassword,
            // email: existingToken.email,
        }
    });
    await db.passwordResetToken.delete({
        where: {id: existingToken.id}
    });

    return { success: "Password Updated Successfully! Please Login🙂🙂" }
}