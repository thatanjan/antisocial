"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server Action to initiate Google OAuth login.
 * Uses Better Auth's server-side API to get the redirect URL.
 */
export async function signInWithGoogle() {
  const result = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/", // Redirect here after successful Google login
    },
  });

  if (result?.url) {
    redirect(result.url);
  }

  // If no URL returned, redirect back to login with error
  redirect("/login?error=OAuthInitFailed");
}

/**
 * Server Action to sign out the current user.
 * Invalidates the session and clears cookies.
 */
export async function signOutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}
