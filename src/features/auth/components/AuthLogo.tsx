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
    <div
      className={cn(
        "flex flex-col items-center space-y-0 text-center",
        className,
      )}
    >
      <h1 className="translate-y-2 font-bold font-notebook text-6xl text-text-deep lowercase leading-tight tracking-tight md:text-7xl dark:text-text-light">
        antisocial
      </h1>
      <p className="font-bold font-sans text-muted-foreground text-xs uppercase tracking-super-wide opacity-50">
        JOIN THE QUIET.
      </p>
    </div>
  );
}
