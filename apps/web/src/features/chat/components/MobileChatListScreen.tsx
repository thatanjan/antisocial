import { cn } from "@/lib/utils";
import { BottomTabBar, type BottomTabItem } from "./BottomTabBar";
import { ChatsListHeader } from "./ChatsListHeader";
import {
  type ConversationItem,
  ConversationListItem,
} from "./ConversationListItem";
import { type ChatFilterOption, FilterPills } from "./FilterPills";
import { type RecentChatItem, RecentChatsStrip } from "./RecentChatsStrip";
import { SearchInput } from "./SearchInput";

interface MobileChatListScreenProps {
  title: string;
  onNewChat: () => void;
  onMore: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions: ChatFilterOption[];
  filterValue: string;
  onFilterChange: (value: string) => void;
  onMoreFilters: () => void;
  recentChats: RecentChatItem[];
  onSelectRecent: (id: string) => void;
  onMoreRecent: () => void;
  conversations: ConversationItem[];
  onSelectConversation: (id: string) => void;
  tabItems: BottomTabItem[];
  profileHref: string;
  avatarUrl: string;
  displayName: string;
  className?: string;
}

export const MobileChatListScreen = ({
  title,
  onNewChat,
  onMore,
  searchValue,
  onSearchChange,
  filterOptions,
  filterValue,
  onFilterChange,
  onMoreFilters,
  recentChats,
  onSelectRecent,
  onMoreRecent,
  conversations,
  onSelectConversation,
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
          <SearchInput onChange={onSearchChange} value={searchValue} />
        </section>
        <section className="mb-5 px-5" data-purpose="filter-pills">
          <FilterPills
            onChange={onFilterChange}
            onMoreFilters={onMoreFilters}
            options={filterOptions}
            value={filterValue}
          />
        </section>
        <RecentChatsStrip
          className="mb-4 px-5"
          items={recentChats}
          onMore={onMoreRecent}
          onSelect={onSelectRecent}
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
                  onSelect={onSelectConversation}
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
