"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

/**
 * ThemeProvider component to handle light/dark mode.
 * Uses next-themes for theme management.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
