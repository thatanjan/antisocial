import { getSessionCookie } from "better-auth/cookies";
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "./auth.ts";

export { getSessionCookie };
export const authHandlers = toNextJsHandler(auth);
