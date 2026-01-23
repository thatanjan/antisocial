# API Contracts: Google Auth Page (Server Actions)

Per the **Antisocial Constitution**, this feature uses **Server Actions** instead of route handlers for all mutations and authentication logic.

## Server Actions

### `signInWithGoogle`
Initiates the Google OAuth flow from the server.
- **Provider**: `auth.api.signInSocial`
- **Location**: `src/features/auth/actions/auth-actions.ts`
- **Behavior**: Retrieves the Google OAuth URL from the server instance and performs a redirect using `next/navigation`.

### `signOut`
Logs the user out and terminates the session.
- **Provider**: `auth.api.signOut`
- **Behavior**: Invalidates the session cookie and redirects to the login page.

## Server-Side Session Validation

### `getSession`
Checks the current session in Server Components.
- **Method**: `auth.api.getSession({ headers: await headers() })`
- **Visibility**: Used in `layout.tsx` or `page.tsx` to protect routes or render user-specific content.

## Redirect Handling
- **Login Callback**: Better Auth handles the callback logic via its internal handler. (Note: A single catch-all route handler `api/auth/[...better-auth]/route.ts` is required by the library architecture to process incoming OAuth responses from Google, but all user-facing logic is encapsulated in actions).
- **Error Redirects**: If the callback returns an error, the user is redirected to `/login?error=OAuthCallbackError`.
