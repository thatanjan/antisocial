import { cn } from "@/lib/utils";

type AuthLogoProps = {
  className?: string;
};

/**
 * Logo component for the authentication page.
 * Displays "antisocial" and the subtitle "JOIN THE QUIET."
 */
export const AuthLogo = ({ className }: AuthLogoProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center space-y-0 text-center",
        className,
      )}
    >
      <h1 className="font-notebook text-text-deep dark:text-text-light translate-y-2 text-6xl leading-tight font-bold tracking-tight lowercase md:text-7xl">
        antisocial
      </h1>
      <p className="text-muted-foreground tracking-super-wide font-sans text-xs font-bold uppercase opacity-50">
        JOIN THE QUIET.
      </p>
    </div>
  );
};
