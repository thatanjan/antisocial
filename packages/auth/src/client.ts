import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const createAppAuthClient = (baseUrl?: string) =>
  createAuthClient({
    baseURL: baseUrl || process.env.BETTER_AUTH_URL,
    plugins: [anonymousClient()],
  });
