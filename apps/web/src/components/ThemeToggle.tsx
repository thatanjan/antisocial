"use client";

import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle component that switches between light and dark modes.
 * Adheres to the notebook design's minimalist aesthetic.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Avoid hydration mismatch by only rendering after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.startsWith("/chat")) return null;

  if (!mounted) {
    return (
      <div className="flex h-10 w-10 items-center justify-center">
        <div className="bg-muted h-5 w-5 animate-pulse rounded-full" />
      </div>
    );
  }

  return (
    <Button
      aria-label="Toggle theme"
      className={cn(
        "border-border/50 bg-background/50 h-10 w-10 rounded-full border shadow-sm backdrop-blur-sm transition-transform hover:scale-110 active:scale-95",

        theme === "dark"
          ? "text-amber-200 hover:bg-slate-500 hover:text-amber-400"
          : "text-slate-700 hover:text-slate-900",
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-all" />
      ) : (
        <Moon className="h-5 w-5 transition-all" />
      )}
    </Button>
  );
}
