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
    console.error("Guest sign-in failed:", err);
    return { success: false, error: "Failed to sign in as guest" };
  }
};

export { signInAsGuest };
