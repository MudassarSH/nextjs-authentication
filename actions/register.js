"use server"

import * as z from 'zod';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const register = async (values) => {

    const validateValues = RegisterSchema.safeParse(values);
    console.log(validateValues)
    if(!validateValues.success){
        return {error: "Invalid Fields!"}
    }
    const {email, password, name} = validateValues.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);
    if(existingUser){
        return {error: "Email already exists"}
    }
    await db.user.create({
        data:{
            name,
            email,
            password: hashedPassword,
        }
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    );
    return {success: "Verification email sent"}

}
