import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthLogo } from "@/features/auth/components/AuthLogo";
import { GoogleButton } from "@/features/auth/components/GoogleButton";
import Link from "next/link";
import { redirect } from "next/navigation";

/**
 * Login Page (Server Component).
 * Provides the main entry point for user authentication.
 */
export default async function LoginPage(props: {
    searchParams: Promise<{ error?: string }>;
}) {
    const searchParams = await props.searchParams;
    const error = searchParams.error;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session) {
        redirect("/");
    }
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
            {/* Error Alert */}
            {error && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-50">
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs py-3 px-4 rounded-xl text-center font-medium animate-in fade-in slide-in-from-top-4 duration-300">
                        Authentication failed. Please try again.
                    </div>
                </div>
            )}
            {/* Theme Toggle Position */}
            <div className="absolute top-6 right-6">
                <ThemeToggle />
            </div>

            {/* Decorative background elements could be added here if needed to match the "Notebook" aesthetic */}

            <div className="w-full max-w-sm flex flex-col items-center space-y-24 z-10">
                {/* Logo Section */}
                <AuthLogo />

                {/* Login Card */}
                <div className="w-full bg-card rounded-3xl p-12 shadow-sm border border-border flex flex-col items-center space-y-10">
                    <GoogleButton />

                    <p className="text-xs text-muted-foreground text-center font-medium leading-relaxed max-w-48">
                        Escape the noise. Join the quiet.
                    </p>
                </div>

                {/* Footer Link */}
                <Link
                    href="/terms"
                    className="text-xs tracking-super-wide font-bold text-primary hover:opacity-70 transition-opacity uppercase border-b border-primary/30 pb-1"
                >
                    Terms of Service
                </Link>
            </div>
        </main>
    );
}
