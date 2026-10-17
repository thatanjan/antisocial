import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutAction } from "../actions/authActions";

interface LogoutButtonProps {
  className?: string;
}

/**
 * LogoutButton component that triggers the better-auth sign-out via server action.
 */
export const LogoutButton = ({ className }: LogoutButtonProps) => {
  return (
    <form action={signOutAction} className="w-full">
      <Button
        className={cn(
          "group flex w-full items-center justify-start gap-4 rounded-xl px-4 py-6 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive active:scale-95",
          className,
        )}
        type="submit"
        variant="ghost"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/50 transition-colors group-hover:bg-destructive/20">
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        </div>
        <span className="font-semibold text-sm tracking-tight">Logout</span>
      </Button>
    </form>
  );
};
