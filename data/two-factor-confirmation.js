import { db } from "@/lib/db";

export const getTwoFactorConfirmationByUserId = async (userId = '') => {
    try {
        const getTwoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: { userId }
        })
        return getTwoFactorConfirmation
    } catch {
        return null;
    }
}