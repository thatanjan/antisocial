"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server action to sign in as a guest user.
 * Creates an anonymous session and redirects to the feed.
 */
const signInAsGuest = async () => {
  try {
    await auth.api.signInAnonymous({
      headers: await headers(),
    });

    redirect("/feed");
  } catch (err) {
    // HACK: Check for Next.js redirect error and re-throw it to allow proper redirection
    if (
      err &&
      typeof err === "object" &&
      "digest" in err &&
      typeof err.digest === "string" &&
      err.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw err;
    }
    console.error("Guest sign-in failed:", err);
    return { success: false, error: "Failed to sign in as guest" };
  }
};

export { signInAsGuest };
