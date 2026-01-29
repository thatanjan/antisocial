import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLogo } from "@/features/auth/components/AuthLogo";
import { GoogleButton } from "@/features/auth/components/GoogleButton";
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
      {/* Theme Toggle Position */}
      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
        {/* Error Alert */}
        {error && (
          <div className="mb-12 w-full">
            <div className="fade-in slide-in-from-top-4 animate-in rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-center font-medium text-destructive text-xs duration-300">
              Authentication failed. Please try again.
            </div>
          </div>
        )}

        {/* Logo Section */}
        <AuthLogo className="mb-24" />

        {/* Login Card */}
        <div className="flex w-full flex-col items-center space-y-16 rounded-3xl border border-border bg-card p-12 py-16 shadow-sm">
          <GoogleButton />

          <p className="max-w-48 text-center font-medium font-notebook text-muted-foreground text-xs leading-relaxed">
            One-tap access for invited members only.
          </p>
        </div>
      </div>

      {/* Footer Link */}
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
