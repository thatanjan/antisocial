import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLogo } from "@/features/auth/components/AuthLogo";
import { GoogleButton } from "@/features/auth/components/GoogleButton";
import { GuestButton } from "@/features/guest-mode/components/GuestButton";
import { getSession } from "@/lib/session";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

/**
 * Login Page (Server Component).
 * Provides the main entry point for user authentication.
 */
const LoginPage = async (props: LoginPageProps) => {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  const session = await getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className="bg-background relative flex min-h-screen flex-col items-center overflow-hidden p-12">
      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center">
        {error && (
          <div className="mb-12 w-full">
            <div className="fade-in slide-in-from-top-4 animate-in border-destructive/20 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-center text-xs font-medium duration-300">
              Authentication failed. Please try again.
            </div>
          </div>
        )}

        <AuthLogo className="mb-24" />

        <div className="border-border bg-card flex w-full flex-col items-center space-y-16 rounded-3xl border p-12 py-16 shadow-sm">
          <GoogleButton />

          <div className="w-full">
            <div className="relative">
              <div className="bg-border absolute top-1/2 right-0 left-0 h-px" />
              <div className="relative flex justify-center">
                <span className="bg-card text-muted-foreground px-2 text-xs">
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
        className="text-muted-foreground/60 tracking-super-wide hover:border-primary/30 hover:text-primary mt-12 mb-4 border-b border-transparent pb-1 text-xs font-bold uppercase transition-colors"
        href="/terms"
      >
        Terms of Service
      </Link>
    </main>
  );
};

export default LoginPage;
