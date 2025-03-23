import { UserRole } from "@prisma/client";
import NextAuth, {type DefaultSession} from "next-auth";

export type ExtendUser = DefaultSession["user"]&{
    // customField: string;
    role: UserRole;
    emailVerified: String;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
}

declare module "next-auth"{
    interface Session {
        user: ExtendUser;
    }
}