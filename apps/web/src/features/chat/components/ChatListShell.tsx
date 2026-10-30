import { ChatListChrome } from "@/features/chat/components/ChatListChrome";
import type { ChatNavigationItem } from "@/features/chat/components/LeftIconRail";
import {
  recentChats,
  sampleConversations,
  sampleCurrentUser,
  sampleFilterOptions,
} from "@/features/chat/data/sample-conversations";
import type { ChatListQuery } from "@/features/chat/hooks/useChatListState";
import type { BottomTabItem } from "./BottomTabBar";
import { LeftIconRail } from "./LeftIconRail";

const PROFILE_HREF = "/profile";

/** Rail menu for the chat surface. Contacts/Groups go to their list filters/routes. */
const railNavItems: ChatNavigationItem[] = [
  { label: "Chats", href: "/chat", icon: "home", active: true },
  { label: "Contacts", href: "/contacts", icon: "contact", active: false },
  {
    label: "Groups",
    href: "/chat?filter=groups",
    icon: "users",
    active: false,
  },
];

/** Mobile bottom tab menu mirroring the rail destinations. */
const tabNavItems: BottomTabItem[] = [
  { label: "Chats", href: "/chat", icon: "home", active: true },
  { label: "Contacts", href: "/contacts", icon: "contact", active: false },
  {
    label: "Groups",
    href: "/chat?filter=groups",
    icon: "users",
    active: false,
  },
];

/**
 * Server component owning the permanent chat chrome: icon rail + conversation
 * sidebar at desktop widths, full-screen list + bottom tabs on narrow screens.
 * Search/filter state arrives as URL params (read in the layout); conversation
 * rows and recent-chat avatars open chats via hrefs preserving that state.
 */
export const ChatListShell = ({
  children,
  activeId,
  query,
}: {
  children: React.ReactNode;
  /** Route conversation id; highlights the row and recent strip entry. */
  activeId?: string;
  /** Conversation-list URL state (?q=, ?filter=). */
  query: ChatListQuery;
}) => {
  const queryText = query.q.trim().toLowerCase();
  const filtered = sampleConversations.filter((conversation) => {
    const matchesQuery =
      queryText === "" || conversation.name.toLowerCase().includes(queryText);
    const matchesFilter =
      query.filter === "all" ||
      (query.filter === "unread" && conversation.unread) ||
      (query.filter === "favourites" && conversation.favourite) ||
      (query.filter === "groups" && conversation.kind === "group");
    return matchesQuery && matchesFilter;
  });

  const conversations = filtered.map((conversation) => ({
    ...conversation,
    active: conversation.id === activeId,
  }));

  const recentItems = recentChats.map((recentChat) => ({
    ...recentChat,
    active: recentChat.id === activeId,
  }));

  /** Items render internal Links to /chat/[id]; list state rides the URL. */

  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <LeftIconRail
        avatarUrl={sampleCurrentUser.avatarUrl}
        brandHref="/"
        displayName={sampleCurrentUser.displayName}
        items={railNavItems}
        profileHref={PROFILE_HREF}
      />
      <ChatListChrome
        avatarUrl={sampleCurrentUser.avatarUrl}
        conversations={conversations}
        displayName={sampleCurrentUser.displayName}
        filterOptions={sampleFilterOptions}
        onMore={() => {}}
        onMoreRecent={() => {}}
        onNewChat={() => {}}
        profileHref={PROFILE_HREF}
        recentChats={recentItems}
        tabItems={tabNavItems}
        title="Antisocial"
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
};
