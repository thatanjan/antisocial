import { auth } from "@antisocial/auth";
import { headers } from "next/headers";

/**
 * Gets the current session from the request headers.
 * Use this in server components and server actions to get the authenticated user.
 */
export const getSession = async () => {
  return auth.api.getSession({
    headers: await headers(),
  });
};
