"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

interface ChatLinkProps {
  /** Destination path without query string, e.g. `/chat/emily-carter` or `/chat`. */
  href: string;
  children: ReactNode;
  className?: string;
  [key: `data-${string}`]: string | undefined;
}

/**
 * Server-compatible conversation link that preserves the current list state
 * (`?q=`, `?filter=`) into the destination URL. The layout tree is a server
 * component and can only see a conversation id, so this client leaf reads the
 * route search params and appends them.
 */
export const ChatLink = ({
  href,
  children,
  className,
  ...dataAttrs
}: ChatLinkProps) => {
  const searchParams = useSearchParams();

  const q = searchParams.get("q");
  const filter = searchParams.get("filter");
  const params = new URLSearchParams();
  if (q) {
    params.set("q", q);
  }
  if (filter && filter !== "all") {
    params.set("filter", filter);
  }
  const search = params.toString();

  return (
    <Link
      className={className}
      href={`${href}${search ? `?${search}` : ""}`}
      {...dataAttrs}
    >
      {children}
    </Link>
  );
};
