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
        <div className={cn("flex flex-col items-center space-y-4 text-center", className)}>
            <h1 className="text-6xl font-bold tracking-tight text-foreground font-notebook">
                antisocial
            </h1>
            <p className="text-sm tracking-super-wide text-muted-foreground uppercase opacity-70 font-medium">
                JOIN THE QUIET.
            </p>
        </div>
    );
}
