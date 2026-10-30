import { cn } from "@/lib/utils";
import { ChatListQuerySync } from "./ChatListQuerySync";
import { ChatsListHeader } from "./ChatsListHeader";
import {
  type ConversationItem,
  ConversationListItem,
} from "./ConversationListItem";
import type { ChatFilterOption } from "./FilterPills";
import { type RecentChatItem, RecentChatsStrip } from "./RecentChatsStrip";

/**
 * Props for the desktop conversation sidebar (permanent chat chrome).
 */
interface ConversationsSidebarProps {
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
  className?: string;
}

/**
 * Desktop-only list pane composing the header, URL-synced search/filter
 * bridge, recent chats strip, and the All Chats conversation list.
 */
export const ConversationsSidebar = ({
  title,
  onNewChat,
  onMore,
  filterOptions,
  recentChats,
  buildRecentHref,
  onMoreRecent,
  conversations,
  buildConversationHref,
  className,
}: ConversationsSidebarProps) => {
  return (
    <aside
      className={cn(
        "bg-background border-border hidden h-full w-80 shrink-0 flex-col border-r md:flex md:w-96",
        className,
      )}
      data-purpose="chat-sidebar"
    >
      <div className="space-y-3 p-4 pb-2">
        <ChatsListHeader onMore={onMore} onNewChat={onNewChat} title={title} />
        <ChatListQuerySync filterOptions={filterOptions} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <RecentChatsStrip
          buildHref={buildRecentHref}
          className="border-border border-b"
          items={recentChats}
          onMore={onMoreRecent}
        />
        <section className="px-2 py-3" data-purpose="all-chats-list">
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
      </div>
    </aside>
  );
};
