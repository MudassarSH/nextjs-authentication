"use server"

import * as z from 'zod';

import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import bcrypt from 'bcryptjs';
import { getUserByEmail, getUserById } from '@/data/user';
import { currentUser } from '@/lib/auth';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const settings = async (values)=>{
    const user = await currentUser();
    if(!user){
        return {error: "Unauthorized"}
    }

    const dbUser = await getUserById(user.id)
    if(!dbUser){
        return {error: "Unauthorized"}
    }

    if(user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email)

        if(existingUser && existingUser.id !== user.id){
            return {error: "Email already in use"}
        }

        const newVerficationToken = await generateVerificationToken(
            values.email,
        );

        await sendVerificationEmail(
            newVerficationToken.email,
            newVerficationToken.token,
        );
        // return {success: "Verification email sent to new Email"}
    }
    if(values.password && values.newPassword && dbUser.password){
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        )

        if(!passwordMatch){
            return {error: "Incorrect Old Password!! Please Enter Correct One"}
        }

        const hashedPassword = await bcrypt.hash(
            values.newPassword,
            10
        );

        values.password = hashedPassword;
        values.newPassword = undefined;
        // return {success: "Password updated successfully"}
    }

    await db.user.update({
        where: {id: user.id},
        data: {
            ...values,
        },
    });

    return {success: "Settings updated successfully"}
};
