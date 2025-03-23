import NextAuth from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import authConfig from "@/auth.config"
import { getUserById } from "./data/user" //You can also use the getuserby email but searching that email will be more expensive then by id
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation"
import { getAccountByUserId } from "./data/account"

export const { auth, handlers, signIn, signOut } = NextAuth({
  // This pages function will be used to show custom page instead of half ass and wierd error page when we use the two acounts two sign in which have same email. The example page is "http://localhost:3000/api/auth/signin?error=OAuthAccountNotLinked"
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // This event will add date in verifiedEmail section of user's who sign through outh apps like google or github
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  //user callback in JWT will only show data for signIn only after that It shows Undefined
  //account callback in JWT will only show data for signIn only after that It shows Undefined
  //trigger callback in JWT will only show data for signIn only after that It shows Undefined
  //So out of most {token} callback in JWT is more reliable for fetching user info
  callbacks: {
    //Attempt to Block The User to SignIn if email Is not verified
    async signIn({ user, account }) {
      console.log({ user, account })
      if (account?.provider !== "credentials") return true; //Allow the user to sign in

      const existingUser = await getUserById(user.id)
      if (!existingUser?.emailVerified) {
        return false; //Block the user to sign in
      }
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

        console.log({ twoFactorConfirmation })

        if (!twoFactorConfirmation) {
          return false; //Block the user to sign in
        }
        //Delete the two factor confirmation for next sign in attempt
        await db.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          }
        })
      }

      return true; //Allow the user to sign in
    },

    async session({ token, session }) {
      console.log(
        "SessionToken: ", { token },
      ) //sub is the unique identifier for the user in your database
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }
      if (session.user) {
        session.user.emailVerified = token.emailVerified;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth;
      }
      return session;
    },
    async jwt({ token }) {
      // console.log("I am being Called kAgain")
      // console.log("JWT token: ", {token}) //sub is the unique identifier for the user in your database
      // token.customField = "test"
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id,
      )

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.emailVerified = existingUser.emailVerified

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  //Todo: cllbacks
  ...authConfig,
})