import { ChatListActions } from "@/features/chat/components/ChatListActions";
import type { ChatNavigationItem } from "@/features/chat/components/LeftIconRail";
import {
  recentChats,
  sampleConversations,
  sampleCurrentUser,
  sampleFilterOptions,
} from "@/features/chat/data/sample-conversations";
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
 * Server component for permanent chat chrome: icon rail + sidebar at desktop,
 * full-screen list + tabs on narrow screens. Client list actions read the
 * search/filter URL state and filter bundled and page-session conversations.
 */
export const ChatListShell = ({
  children,
  activeId,
}: {
  children: React.ReactNode;
  /** Route conversation id; highlights the row and recent strip entry. */
  activeId?: string;
}) => {
  const conversations = sampleConversations.map((conversation) => ({
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
      <ChatListActions
        avatarUrl={sampleCurrentUser.avatarUrl}
        conversations={conversations}
        displayName={sampleCurrentUser.displayName}
        filterOptions={sampleFilterOptions}
        profileHref={PROFILE_HREF}
        recentChats={recentItems}
        tabItems={tabNavItems}
        title="Antisocial"
      />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
};
