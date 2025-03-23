"use server"

import * as z from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { LoginSchema } from '@/schemas';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken, generateTwoFactorAuthToken } from '@/lib/tokens';
import { db } from '@/lib/db';
import { getTwoFactorAuthTokenByEmail } from '@/data/two-factor-token';
import {
    sendVerificationEmail,
    sendTwoFactorTokenEmail,
} from '@/lib/mail';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

export const login = async (values, callbackUrl='') => {
    // Validate the input using Schema
    const validateValues = LoginSchema.safeParse(values);
    if (!validateValues.success) {
        // return {error: validateValues.error.message}
        return { error: "Invalid Fields!" }
    }

    // Checks the entered email, password, and code and validate from connected database
    const { email, password, code } = validateValues.data;
    try {
        const isExisting = await getUserByEmail(email); // Replace with your actual check

        // Check whether the user exist or not
        if (!isExisting || !isExisting.email || !isExisting.password) {
            return { error: 'User does not exist' };
        }

        // Checks If users verifies its email. If not, send a verification email
        if (!isExisting.emailVerified) {
            const verificationToken = await generateVerificationToken(isExisting.email);
            await sendVerificationEmail(
                verificationToken.email,
                verificationToken.token,
            )

            return { success: "Verification Email Sent Again!" }
        }

        console.log("isExisting:", isExisting);

        // Check if user is enabled for two factor authentication
        if (isExisting.isTwoFactorEnabled && isExisting.email) {
            if (code) {
                // Checks the two factor code in database
                const twoFactorToken = await getTwoFactorAuthTokenByEmail(isExisting.email)
                if (!twoFactorToken) {
                    return { error: "Two Factor Code Not Found" }
                }
                // Compare the entered token with the stored token for TwoFactor Token
                if (twoFactorToken.token !== code) {
                    return { error: "Invalid Two Factor Code" }
                }
                // Checks if the two factor token has expired or not
                const hasExpired = new Date(twoFactorToken.expires) < new Date();
                if (hasExpired) {
                    return { error: "Codes Expired! Please Request a New Code" }
                }
                // After successful verification, delete the two factor token
                await db.twoFactorToken.delete({
                    where: { id: twoFactorToken.id }
                })
                // if previous confirmation exists, delete it
                const existingConfirmation = await getTwoFactorConfirmationByUserId(isExisting.id)
                if (existingConfirmation) {
                    await db.twoFactorConfirmation.delete({
                        where: { id: existingConfirmation.id }
                    })
                }
                // Confirm the two factor authentication
                await db.twoFactorConfirmation.create({
                    data: {
                        userId: isExisting.id,
                    }
                })
            } else {

                // Generate a new two factor token for the user and send it to the user's email
                const twoFactorToken = await generateTwoFactorAuthToken(isExisting.email)
                console.log("twoFactorToken:", twoFactorToken);
                await sendTwoFactorTokenEmail(
                    twoFactorToken.email,
                    twoFactorToken.token,
                )
                // Return the Response. If response true then It will show new window to enter the two factor code and verify it. If it shows false then it will return error message.
                return { twoFactor: true }
            }
        }

        // Checks the credentials from the database and verify the login
        const result = await signIn('credentials', {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT, // Disable automatic redirect
        });

        if (result.error) {
            return { error: result.error };
        }

        // Handle redirect manually
        // return { redirect: DEFAULT_LOGIN_REDIRECT };
    }
    catch (error) {
        console.error("Caught Error:", error);

        // Check if the error is a CallbackRouteError with a cause of CredentialsSignin
        if (error instanceof AuthError) {
            if (error.type === 'CallbackRouteError' && error.cause?.type === 'CredentialsSignin') {
                return { error: "Invalid credentials" };
            }

            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                default:
                    return { error: "An unexpected error occurred" };
            }
        }

        // Handle other errors
        if (error.cause instanceof AuthError && error.cause.type === 'CredentialsSignin') {
            return { error: "Invalid credentials" };
        }

        throw error;
    }
}
