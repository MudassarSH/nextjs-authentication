
/**
 * An array of routes that accessible to the public
 * These routes do not required authentication.
 * @type {string[]}
 */

export const publicRoutes = [
    "/",
    "/auth/new-verification",
    "/auth/new-password"
    // "/auth/register",
]

/**
 * An array of routes that are used for authentication.
 * THese routes will redirect logged in users to the setting page.
 * @type {string[]}
 */

export const authRoutes = [
    // "/dashboard",
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
]

/**
 * The prefix for API route of authentication
 * Routes that start with '/api/auth' are used for API authentication purposes.
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth"
/**
 * The default redirect path after successful login.
 * Routes that start with '/api/auth' are used for API authentication purposes.
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/settings"