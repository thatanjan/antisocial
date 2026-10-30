import { Contact, Home, Users } from "lucide-react";
import type { BottomTabItem } from "@/features/chat/components/BottomTabBar";
import { ConversationsSidebar } from "@/features/chat/components/ConversationsSidebar";
import type { ChatNavigationItem } from "@/features/chat/components/LeftIconRail";
import { LeftIconRail } from "@/features/chat/components/LeftIconRail";
import { MobileChatListScreen } from "@/features/chat/components/MobileChatListScreen";
import {
  recentChats,
  sampleConversations,
  sampleCurrentUser,
  sampleFilterOptions,
} from "@/features/chat/data/sample-conversations";
import type { ChatListQuery } from "@/features/chat/hooks/useChatListState";
import { buildChatHref } from "@/features/chat/utils/chatLinks";

const PROFILE_HREF = "/profile";

/** Rail menu for the chat surface. Contacts/Groups go to their list filters/routes. */
const railNavItems: ChatNavigationItem[] = [
  { label: "Chats", href: "/chat", icon: Home, active: true },
  { label: "Contacts", href: "/contacts", icon: Contact, active: false },
  { label: "Groups", href: "/chat?filter=groups", icon: Users, active: false },
];

/** Mobile bottom tab menu mirroring the rail destinations. */
const tabNavItems: BottomTabItem[] = [
  { label: "Chats", href: "/chat", icon: Home, active: true },
  { label: "Contacts", href: "/contacts", icon: Contact, active: false },
  { label: "Groups", href: "/chat?filter=groups", icon: Users, active: false },
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

  /** Rows link to /chat/[id]; list state travels via the row hrefs. */
  const buildConversationHref = (id: string) => buildChatHref(id, {});

  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <LeftIconRail
        avatarUrl={sampleCurrentUser.avatarUrl}
        brandHref="/"
        displayName={sampleCurrentUser.displayName}
        isDarkMode={false}
        items={railNavItems}
        onToggleTheme={() => {}}
        profileHref={PROFILE_HREF}
      />
      <ConversationsSidebar
        buildConversationHref={buildConversationHref}
        buildRecentHref={buildConversationHref}
        conversations={conversations}
        filterOptions={sampleFilterOptions}
        onMore={() => {}}
        onMoreRecent={() => {}}
        onNewChat={() => {}}
        recentChats={recentItems}
        title="Antisocial"
      />
      <div className="min-w-0 flex-1">{children}</div>
      <MobileChatListScreen
        avatarUrl={sampleCurrentUser.avatarUrl}
        buildConversationHref={buildConversationHref}
        buildRecentHref={buildConversationHref}
        conversations={conversations}
        displayName={sampleCurrentUser.displayName}
        filterOptions={sampleFilterOptions}
        onMore={() => {}}
        onMoreRecent={() => {}}
        onNewChat={() => {}}
        profileHref={PROFILE_HREF}
        recentChats={recentItems}
        tabItems={tabNavItems}
        title="Chats"
      />
    </div>
  );
};
