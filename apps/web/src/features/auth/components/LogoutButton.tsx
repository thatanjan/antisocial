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
          "group hover:bg-destructive/10 hover:text-destructive flex w-full items-center justify-start gap-4 rounded-xl px-4 py-6 transition-all duration-300 active:scale-95",
          className,
        )}
        type="submit"
        variant="ghost"
      >
        <div className="bg-secondary/50 group-hover:bg-destructive/20 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors">
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
        </div>
        <span className="text-sm font-semibold tracking-tight">Logout</span>
      </Button>
    </form>
  );
};
