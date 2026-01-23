import { createAuthClient } from "better-auth/react";

/**
 * Better Auth client instance for client-side authentication.
 * Initialized with the application base URL from environment variables.
 */
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});
