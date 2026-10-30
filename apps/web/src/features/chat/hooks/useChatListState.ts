"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Shared client plumbing for the chat feature: reads and writes the
 * conversation-list URL state (`?q=`, `?filter=`) so server components
 * (the `(chat)` layout and its list children) can render from the URL.
 */

/** Query-string state of the conversation list view. */
export interface ChatListQuery {
  /** Search term; empty string means "no query". */
  q: string;
  /** Category filter value; `"all"` means "no filter". */
  filter: string;
}

/** Serializes non-default list state into a `?` query string. */
const serialize = (query: Partial<ChatListQuery>): string => {
  const params = new URLSearchParams();
  if (query.q) {
    params.set("q", query.q);
  }
  if (query.filter && query.filter !== "all") {
    params.set("filter", query.filter);
  }
  const search = params.toString();
  return search ? `?${search}` : "";
};

/** Current chat-list query state read from the URL. */
export const useChatListQuery = (): ChatListQuery => {
  const searchParams = useSearchParams();
  return {
    q: searchParams.get("q") ?? "",
    filter: searchParams.get("filter") ?? "all",
  };
};

/**
 * Returns navigation helpers for applying list state to the URL.
 * `applyQuery` merges the given partial state over the current URL params
 * and pushes the result; server components re-filter the list from it.
 */
export const useChatListNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** Push the current pathname with `state` merged over the URL params. */
  const applyQuery = (state: Partial<ChatListQuery>) => {
    const merged: ChatListQuery = {
      q: state.q ?? searchParams.get("q") ?? "",
      filter: state.filter ?? searchParams.get("filter") ?? "all",
    };
    router.push(`${pathname}${serialize(merged)}`);
  };

  return { applyQuery };
};
