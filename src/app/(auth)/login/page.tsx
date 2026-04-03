import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLogo } from "@/features/auth/components/AuthLogo";
import { GoogleButton } from "@/features/auth/components/GoogleButton";
import { GuestButton } from "@/features/guest-mode/components/GuestButton";
import { auth } from "@/lib/auth";

/**
 * Login Page (Server Component).
 * Provides the main entry point for user authentication.
 */
const LoginPage = async (props: {
  searchParams: Promise<{ error?: string }>;
}) => {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-background p-12">
      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
        {error && (
          <div className="mb-12 w-full">
            <div className="fade-in slide-in-from-top-4 animate-in rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-center font-medium text-destructive text-xs duration-300">
              Authentication failed. Please try again.
            </div>
          </div>
        )}

        <AuthLogo className="mb-24" />

        <div className="flex w-full flex-col items-center space-y-16 rounded-3xl border border-border bg-card p-12 py-16 shadow-sm">
          <GoogleButton />

          <div className="w-full">
            <div className="relative">
              <div className="absolute top-1/2 right-0 left-0 h-px bg-border" />
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-muted-foreground text-xs">
                  or
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <GuestButton />
            </div>
          </div>
        </div>
      </div>

      <Link
        className="mt-12 mb-4 border-transparent border-b pb-1 font-bold text-muted-foreground/60 text-xs uppercase tracking-super-wide transition-colors hover:border-primary/30 hover:text-primary"
        href="/terms"
      >
        Terms of Service
      </Link>
    </main>
  );
};

export default LoginPage;
