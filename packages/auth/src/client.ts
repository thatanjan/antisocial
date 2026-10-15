import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const createAppAuthClient = (baseURL?: string) =>
  createAuthClient({
    baseURL,
    plugins: [anonymousClient()],
  });
