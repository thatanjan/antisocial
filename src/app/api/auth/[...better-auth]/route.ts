import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

/**
 * Better Auth catch-all API route handler for Next.js.
 */
export const { GET, POST } = toNextJsHandler(auth);
