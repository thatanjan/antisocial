import { cn } from "@/lib/utils";
import { BottomTabBar, type BottomTabItem } from "./BottomTabBar";
import { ChatListQuerySync } from "./ChatListQuerySync";
import { ChatsListHeader } from "./ChatsListHeader";
import {
  type ConversationItem,
  ConversationListItem,
} from "./ConversationListItem";
import type { ChatFilterOption } from "./FilterPills";
import { type RecentChatItem, RecentChatsStrip } from "./RecentChatsStrip";

/**
 * Props for the mobile chat-list screen (permanent chat chrome).
 */
interface MobileChatListScreenProps {
  title: string;
  onNewChat: () => void;
  onMore: () => void;
  filterOptions: ChatFilterOption[];
  recentChats: RecentChatItem[];
  /** Builds the qualified href for a recent-chat item. */
  buildRecentHref: (id: string) => string;
  onMoreRecent: () => void;
  conversations: ConversationItem[];
  /** Builds the qualified href for a conversation row. */
  buildConversationHref: (id: string) => string;
  tabItems: BottomTabItem[];
  profileHref: string;
  avatarUrl: string;
  displayName: string;
  className?: string;
}

/**
 * Narrow-screen list view composing the header, URL-synced search/filter
 * bridge, recent chats strip, All Chats list, and the bottom tab bar.
 */
export const MobileChatListScreen = ({
  title,
  onNewChat,
  onMore,
  filterOptions,
  recentChats,
  buildRecentHref,
  onMoreRecent,
  conversations,
  buildConversationHref,
  tabItems,
  profileHref,
  avatarUrl,
  displayName,
  className,
}: MobileChatListScreenProps) => {
  return (
    <div className={cn("flex h-full flex-col md:hidden", className)}>
      <div className="px-5 pt-2 pb-3">
        <ChatsListHeader onMore={onMore} onNewChat={onNewChat} title={title} />
      </div>
      <main className="no-scrollbar flex-1 overflow-y-auto pb-20">
        <section className="mb-3 px-5">
          <ChatListQuerySync filterOptions={filterOptions} />
        </section>
        <RecentChatsStrip
          buildHref={buildRecentHref}
          className="mb-4 px-5"
          items={recentChats}
          onMore={onMoreRecent}
        />
        <section className="px-3" data-purpose="all-chats-list">
          <h2 className="text-2xs text-muted-foreground mb-2 px-2 font-bold tracking-wider uppercase">
            All Chats
          </h2>
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <ConversationListItem
                  conversation={conversation}
                  href={buildConversationHref(conversation.id)}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <BottomTabBar
        avatarUrl={avatarUrl}
        displayName={displayName}
        items={tabItems}
        profileHref={profileHref}
      />
    </div>
  );
};
