import { cn } from "@/lib/utils";

interface AuthLogoProps {
    className?: string;
}

/**
 * Logo component for the authentication page.
 * Displays "antisocial" and the subtitle "JOIN THE QUIET."
 */
export function AuthLogo({ className }: AuthLogoProps) {
    return (
        <div className={cn("flex flex-col items-center space-y-2 text-center", className)}>
            <h1 className="text-5xl font-bold tracking-tighter sm:text-6xl text-foreground">
                antisocial
            </h1>
            <p className="text-sm tracking-widest text-muted-foreground uppercase opacity-80">
                JOIN THE QUIET.
            </p>
        </div>
    );
}
