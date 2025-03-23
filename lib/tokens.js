import crypto from 'crypto';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorAuthTokenByEmail } from '@/data/two-factor-token';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

export const generatePasswordResetToken = async (email = '') => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        }
    })
    return passwordResetToken;
}

export const generateVerificationToken = async (email = '') => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour
    const existingToken = await getVerificationTokenByEmail(email);
    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
    };

    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    });
    return verificationToken;
};

export const generateTwoFactorAuthToken = async (email = '') => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour
    const existingToken = await getTwoFactorAuthTokenByEmail(email);
    if (existingToken) {
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id
            }
        });
    }
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires,
        }
    });
    return twoFactorToken;
}

// import { getVerificationTokenByEmail } from '@/data/verification-token';
// import { v4 as uuidv4 } from 'uuid';
// import { db } from './db';

// export const generateVerificationToken = async (email = '') => {
//     try {
//         const token = uuidv4();
//         const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

//         // Check for existing token
//         const existingToken = await getVerificationTokenByEmail(email);
//         if (existingToken) {
//             console.log(`Found existing token with id: ${existingToken.id}`);
//             try {
//                 await db.verificationToken.delete({
//                     where: {
//                         id: existingToken.id,
//                     },
//                 });
//                 console.log(`Deleted existing token with id: ${existingToken.id}`);
//             } catch (deleteError) {
//                 console.error(`Error deleting existing token with id: ${existingToken.id}`, deleteError);
//             }
//         } else {
//             console.log(`No existing token found for email: ${email}`);
//         }

//         // Create new token
//         const verificationToken = await db.verificationToken.create({
//             data: {
//                 email,
//                 token,
//                 expires,
//             },
//         });
//         console.log(`Generated new token with id: ${verificationToken.id}`);
//         return verificationToken;
//     } catch (error) {
//         console.error("Error in generating verification token:", error);
//         throw new Error("Unable to generate verification token");
//     }
// };
