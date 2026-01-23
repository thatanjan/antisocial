"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * ThemeToggle component that switches between light and dark modes.
 * Adheres to the notebook design's minimalist aesthetic.
 */
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch by only rendering after mounting
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-10 w-10 flex items-center justify-center">
                <div className="h-5 w-5 bg-muted rounded-full animate-pulse" />
            </div>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full border border-border/50 bg-background/50 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform active:scale-95"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-200 transition-all" />
            ) : (
                <Moon className="h-5 w-5 text-slate-700 transition-all" />
            )}
        </Button>
    );
}
