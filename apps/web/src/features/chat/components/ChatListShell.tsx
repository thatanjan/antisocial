"use client";

import { Contact, Home, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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

const PROFILE_HREF = "/profile";

const railNavItems: ChatNavigationItem[] = [
  { label: "Chats", href: "/chat", icon: Home, active: true },
  {
    label: "Contacts",
    href: "/chat?view=contacts",
    icon: Contact,
    active: false,
  },
  { label: "Groups", href: "/chat?view=groups", icon: Users, active: false },
];

const tabNavItems: BottomTabItem[] = [
  { label: "Chats", href: "/chat", icon: Home, active: true },
  {
    label: "Contacts",
    href: "/chat?view=contacts",
    icon: Contact,
    active: false,
  },
  { label: "Groups", href: "/chat?view=groups", icon: Users, active: false },
];

/** Client wrapper that owns search/filter/list state for the permanent chat chrome. */
export const ChatListShell = ({
  children,
  activeId,
}: {
  children: React.ReactNode;
  /** Route conversation id; highlights the list row and recent strip entry. */
  activeId?: string;
}) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sampleConversations.filter((conversation) => {
      const matchesQuery =
        query === "" || conversation.name.toLowerCase().includes(query);
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && conversation.unread) ||
        (filter === "favourites" && conversation.favourite) ||
        (filter === "groups" && conversation.kind === "group");
      return matchesQuery && matchesFilter;
    });
  }, [search, filter]);

  const selectConversation = (id: string) => {
    router.push(`/chat/${id}`);
  };

  const listConversations = filtered.map((conversation) => ({
    ...conversation,
    active: conversation.id === activeId,
  }));

  const listRecentChats = recentChats.map((recentChat) => ({
    ...recentChat,
    active: recentChat.id === activeId,
  }));

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
        conversations={listConversations}
        filterOptions={sampleFilterOptions}
        filterValue={filter}
        onFilterChange={setFilter}
        onMore={() => {}}
        onMoreFilters={() => {}}
        onMoreRecent={() => {}}
        onNewChat={() => {}}
        onSearchChange={setSearch}
        onSelectConversation={selectConversation}
        onSelectRecent={selectConversation}
        recentChats={listRecentChats}
        searchValue={search}
        title="Antisocial"
      />
      <div className="min-w-0 flex-1">{children}</div>
      <MobileChatListScreen
        avatarUrl={sampleCurrentUser.avatarUrl}
        conversations={listConversations}
        displayName={sampleCurrentUser.displayName}
        filterOptions={sampleFilterOptions}
        filterValue={filter}
        onFilterChange={setFilter}
        onMore={() => {}}
        onMoreFilters={() => {}}
        onMoreRecent={() => {}}
        onNewChat={() => {}}
        onSearchChange={setSearch}
        onSelectConversation={selectConversation}
        onSelectRecent={selectConversation}
        profileHref={PROFILE_HREF}
        recentChats={listRecentChats}
        searchValue={search}
        tabItems={tabNavItems}
        title="Antisocial"
      />
    </div>
  );
};
