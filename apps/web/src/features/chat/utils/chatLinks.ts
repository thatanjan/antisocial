/**
 * Chat route href builders shared by server and client code.
 *
 * The layout tree is a server component, so it cannot read `useSearchParams`.
 * State-preserving links are built with `ChatLink` (client) — these helpers
 * cover server-side href building where query state is not needed in the path
 * itself.
 */

/** Query-string state of the conversation list view. */
export interface ChatListQuery {
  /** Search term; empty string or undefined means "no query". */
  q?: string;
  /** Category filter value; `"all"` or undefined means "no filter". */
  filter?: string;
}

/**
 * Build the href for a conversation page, preserving non-default list state.
 *
 * @example
 * buildChatHref("emily-carter", { q: "em" }); // "/chat/emily-carter?q=em"
 */
export const buildChatHref = (
  conversationId: string,
  query: ChatListQuery,
): string => {
  const params = new URLSearchParams();
  if (query.q) {
    params.set("q", query.q);
  }
  if (query.filter && query.filter !== "all") {
    params.set("filter", query.filter);
  }
  const search = params.toString();
  return `/chat/${conversationId}${search ? `?${search}` : ""}`;
};

/**
 * Build the href for the chat-list page (`/chat`), preserving non-default
 * list state so navigation returns to the filtered view.
 */
export const buildChatListHref = (query: ChatListQuery): string => {
  const params = new URLSearchParams();
  if (query.q) {
    params.set("q", query.q);
  }
  if (query.filter && query.filter !== "all") {
    params.set("filter", query.filter);
  }
  const search = params.toString();
  return `/chat${search ? `?${search}` : ""}`;
};
