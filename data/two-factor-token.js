import { db } from "@/lib/db";

export const getTwoFactorAuthTokenByEmail = async (email='')=>{
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: {
                email
            }
        })
        return twoFactorToken;
    } catch  {
        return null;
    }
}
export const getTwoFactorAuthTokenByToken = async (token='')=>{
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: {
                token
            }
        })
        return twoFactorToken;
    } catch  {
        return null;
    }
}