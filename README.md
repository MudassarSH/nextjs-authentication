# NextAuth.js Implementation Documentation


## Overview


This repository contains a comprehensive authentication system built with Next.js 14 and NextAuth.js. It provides a complete solution for user authentication, authorization, and account management with server-side and client-side components.


## Features


- 🔒 **Authentication Methods**
  - Email/Password authentication
  - OAuth providers support
  - Email verification
  - Password reset functionality


- 🛡️ **Security Features**
  - CSRF protection
  - JWT session handling
  - Account verification
  - Role-based access control


- 👤 **User Management**
  - User profile settings
  - Admin dashboard
  - Protected routes (client and server)


- 🧩 **UI Components**
  - Responsive auth forms
  - Social login buttons
  - User profile components
  - Shadcn/UI integration


## Architecture


The project follows a modern Next.js architecture with:


- Server Actions for authentication operations
- Route handlers for API endpoints
- Protected routes using middleware
- Separation of client and server components


### Directory Structure


```
├── actions/                  # Server actions
│   ├── login.js              # Login functionality
│   ├── logout.js             # Logout functionality
│   ├── register.js           # User registration
│   ├── reset.js              # Password reset
│   ├── settings.js           # User settings
│   └── verification-actions.js # Email verification
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/[...nextauth]/ # NextAuth API route
│   │   └── admin/            # Admin API endpoints
│   ├── (protected)/          # Protected routes
│   │   ├── admin/            # Admin dashboard
│   │   ├── client/           # Client-side protected pages
│   │   ├── server/           # Server-side protected pages
│   │   └── settings/         # User settings pages
│   └── auth/                 # Auth pages
│       ├── login/            # Login page
│       ├── register/         # Registration page
│       ├── error/            # Auth error page
│       └── reset/            # Password reset page
└── components/
    ├── auth/                 # Auth components
    │   ├── login-form.js     # Login form
    │   ├── register-form.js  # Registration form
    │   ├── social.js         # Social login buttons
    │   └── role-gate.js      # Role-based access control
    └── ui/                   # UI components (shadcn/ui)
```


## Authentication Flow


### Registration Process


1. User submits registration form
2. Server validates input data
3. Password is hashed and user is created in database
4. Verification email is sent
5. User account is created in pending state


### Login Process


1. User submits credentials
2. Server validates credentials against database
3. JWT session is created
4. User is redirected to protected area


### Password Reset


1. User requests password reset
2. Reset token is generated and sent via email
3. User sets new password using token
4. Password is updated in database


## Implementation Details


### NextAuth Configuration


The core NextAuth configuration includes:


```javascript
// Key NextAuth options
export const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate credentials
        const validatedFields = LoginSchema.safeParse(credentials);
        
        if (!validatedFields.success) {
          return null;
        }
        
        const { email, password } = validatedFields.data;
        
        // Find user and verify password
        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;
        
        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;
        
        return user;
      }
    })
    // Additional OAuth providers can be added here
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: { strategy: "jwt" },
  callbacks: {
    // JWT and session callbacks
  }
};
```


### Protected Routes


Route protection is implemented using Next.js middleware:


```javascript
// Middleware protection for routes
export default withAuth({
  publicRoutes: [
    '/',
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/auth/reset',
    '/auth/new-password',
    '/auth/new-verification',
  ],
});
```


### Server Actions


Authentication operations are implemented as React Server Actions:


```javascript
// Example of login server action
export async function login(formData) {
  const { email, password } = LoginSchema.parse(formData);
  
  const user = await getUserByEmail(email);
  if (!user) return { error: "Invalid credentials" };
  
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) return { error: "Invalid credentials" };
  
  // Handle 2FA if enabled
  
  await signIn("credentials", {
    email,
    password,
    redirectTo: DEFAULT_LOGIN_REDIRECT,
  });
  
  return { success: "Logged in successfully" };
}
```


### Role-Based Access Control


Role-based protection is implemented at multiple levels:


1. **Component Level**:
```javascript
// RoleGate component for UI protection
export const RoleGate = ({ children, allowedRole }) => {
  const { role } = useCurrentUser();
  
  if (role !== allowedRole) {
    return (
      <div>
        <FormError message="You do not have permission to view this content!" />
      </div>
    );
  }
  
  return <>{children}</>;
};
```


2. **Route Level**:
```javascript
// Admin route protection
export async function GET() {
  const session = await auth();
  
  if (session?.user?.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }
  
  return Response.json({ admin: true });
}
```


### Client and Server Components


The project separates client and server components:


**Server Component**:
```javascript
// Server-side protected page
export default async function ServerPage() {
  const session = await auth();
  
  return (
    <div>
      <h1>Server Side Protected Page</h1>
      <div>
        Email: {session?.user?.email}
        Role: {session?.user?.role}
      </div>
    </div>
  );
}
```


**Client Component**:
```javascript
'use client';


import { useCurrentUser } from "@/hooks/use-current-user";


export default function ClientPage() {
  const user = useCurrentUser();
  
  return (
    <div>
      <h1>Client Side Protected Page</h1>
      <div>
        Email: {user?.email}
        Role: {user?.role}
      </div>
    </div>
  );
}
```


## UI Components


The project uses Shadcn UI components for the interface:


- **Form Components**: Login, register, settings forms
- **Dialog Components**: Confirmation dialogs
- **Button Components**: Action buttons, social login buttons
- **Card Components**: Auth cards, user info cards
- **Avatar Component**: User avatars
- **Dropdown Menu**: User menu, settings menu


## Setup and Configuration


### Environment Variables


```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=


# Email provider
EMAIL_SERVER=
EMAIL_FROM=


# OAuth providers (optional)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```


### Installation


1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```


## Security Considerations


- **Password Security**: Passwords are hashed using bcrypt
- **CSRF Protection**: Built-in with NextAuth.js
- **JWT Handling**: Secure token management
- **Input Validation**: Server-side validation using Zod schemas
- **Rate Limiting**: Prevents brute force attacks


## Extensibility


The authentication system is designed to be extensible:


- Additional OAuth providers can be easily added
- Custom authentication logic can be implemented
- Role-based permissions can be expanded
- UI components can be customized or replaced


## License


This project is licensed under the MIT License - see the LICENSE file for details.
