import { createAppAuthClient } from "@antisocial/auth/client";

/**
 * Better Auth client instance for client-side authentication.
 * Initialized with the application base URL from environment variables.
 */
export const authClient = createAppAuthClient(process.env.BETTER_AUTH_URL);
