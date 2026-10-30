"use client";

import type { BottomTabItem } from "./BottomTabBar";
import type { ConversationItem } from "./ConversationListItem";
import { ConversationsSidebar } from "./ConversationsSidebar";
import type { ChatFilterOption } from "./FilterPills";
import { MobileChatListScreen } from "./MobileChatListScreen";
import type { RecentChatItem } from "./RecentChatsStrip";

interface ChatListChromeProps {
  conversations: ConversationItem[];
  filterOptions: ChatFilterOption[];
  recentChats: RecentChatItem[];
  tabItems: BottomTabItem[];
  profileHref: string;
  avatarUrl: string;
  displayName: string;
  title: string;
  onNewChat: () => void;
  onMore: () => void;
  onMoreRecent: () => void;
}

/**
 * Client boundary for list action callbacks. All callbacks are required by the
 * composed controls. Current actions are explicit no-ops until their feature
 * flows are implemented.
 */
export const ChatListChrome = ({
  conversations,
  filterOptions,
  recentChats,
  tabItems,
  profileHref,
  avatarUrl,
  displayName,
  title,
  onNewChat,
  onMore,
  onMoreRecent,
}: ChatListChromeProps) => (
  <>
    <ConversationsSidebar
      conversations={conversations}
      filterOptions={filterOptions}
      onMore={onMore}
      onMoreRecent={onMoreRecent}
      onNewChat={onNewChat}
      recentChats={recentChats}
      title={title}
    />
    <MobileChatListScreen
      avatarUrl={avatarUrl}
      conversations={conversations}
      displayName={displayName}
      filterOptions={filterOptions}
      onMore={onMore}
      onMoreRecent={onMoreRecent}
      onNewChat={onNewChat}
      profileHref={profileHref}
      recentChats={recentChats}
      tabItems={tabItems}
      title={title}
    />
  </>
);
