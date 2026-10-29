import { cn } from "@/lib/utils";
import { ChatsListHeader } from "./ChatsListHeader";
import {
  type ConversationItem,
  ConversationListItem,
} from "./ConversationListItem";
import { type ChatFilterOption, FilterPills } from "./FilterPills";
import { type RecentChatItem, RecentChatsStrip } from "./RecentChatsStrip";
import { SearchInput } from "./SearchInput";

interface ConversationsSidebarProps {
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
  className?: string;
}

export const ConversationsSidebar = ({
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
        <SearchInput onChange={onSearchChange} value={searchValue} />
        <div data-purpose="filter-pills">
          <FilterPills
            onChange={onFilterChange}
            onMoreFilters={onMoreFilters}
            options={filterOptions}
            value={filterValue}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <RecentChatsStrip
          className="border-border border-b"
          items={recentChats}
          onMore={onMoreRecent}
          onSelect={onSelectRecent}
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
                  onSelect={onSelectConversation}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
};
