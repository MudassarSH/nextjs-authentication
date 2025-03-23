"use server"
import * as z from 'zod';

import { ResetSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';


export const reset = async (values) => {
    const validateField = ResetSchema.safeParse(values)

    if (!validateField.success) {
        return { error: "Invalid Email" }
    }

    const { email } = validateField.data;
    const existingUser = await getUserByEmail(email);

    console.log("Email:", email);
    console.log("Existing User:", existingUser);

    if (!existingUser) {
        return { error: "User does not exist" }
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token,
    )


    return { success: "Password reset link has been sent to your email" }
}