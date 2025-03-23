import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig);
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes"

export default auth((req) => {

  // console.log("ROUTE: ", req.nextUrl.pathname)
  const {nextUrl} = req;
  const isLogedIn = !!req.auth
  // console.log("Is Logged In: ", isLogedIn)
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)

  if(isApiAuthRoute){
    return null;
  };

  if(isAuthRoute){
    if(isLogedIn){
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }
  if(!isLogedIn && !isPublicRoute){
    let callbackUrl = nextUrl.pathname;
    if(nextUrl.search){
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    console.log("Redirecting to Login: ", `/auth/login?${encodedCallbackUrl}`)
    return Response.redirect(new URL(
      `/auth/login?callbackUrl=${encodedCallbackUrl}`,
       nextUrl
    ));
  }

  return null; //Means:  Allow It!! Don't do anything if the user is logged in and trying to access a public route.

})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}