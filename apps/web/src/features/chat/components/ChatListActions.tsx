"use client";

import { useState } from "react";
import type { SampleConversation } from "../data/sample-conversations";
import { useChatListQuery } from "../hooks/useChatListState";
import type { BottomTabItem } from "./BottomTabBar";
import { useChatComposer } from "./ChatComposerProvider";
import { ChatContactChooser } from "./ChatContactChooser";
import { ConversationsSidebar } from "./ConversationsSidebar";
import type { ChatFilterOption } from "./FilterPills";
import { MobileChatListScreen } from "./MobileChatListScreen";
import type { RecentChatItem } from "./RecentChatsStrip";

interface ChatListActionsProps {
  conversations: SampleConversation[];
  filterOptions: ChatFilterOption[];
  recentChats: RecentChatItem[];
  tabItems: BottomTabItem[];
  profileHref: string;
  avatarUrl: string;
  displayName: string;
  title: string;
}

/**
 * Client boundary for list action callbacks and the new-chat chooser
 * (User Story 3). `onNewChat` opens the chooser; selecting a contact reuses
 * the bundled direct thread or creates a page-session one and routes to it.
 */
export const ChatListActions = ({
  conversations,
  filterOptions,
  recentChats,
  tabItems,
  profileHref,
  avatarUrl,
  displayName,
  title,
}: ChatListActionsProps) => {
  const { sessionConversations, startConversation } = useChatComposer();
  const [chooserOpen, setChooserOpen] = useState(false);
  const { q, filter } = useChatListQuery();
  const queryText = q.trim().toLowerCase();

  // Placeholder handlers until their flows exist (FR-010: no-op, no claim).
  const onMore = () => {};
  const onMoreRecent = () => {};

  // Session threads (chooser-created) join the bundled list rows.
  const listedConversations = [
    ...conversations.filter(
      (conversation) =>
        !sessionConversations.some(
          (sessionConversation) => sessionConversation.id === conversation.id,
        ),
    ),
    ...sessionConversations,
  ].filter((conversation) => {
    const matchesQuery =
      queryText === "" || conversation.name.toLowerCase().includes(queryText);
    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && conversation.unread) ||
      (filter === "favourites" && conversation.favourite) ||
      (filter === "groups" && conversation.kind === "group");
    return matchesQuery && matchesFilter;
  });

  return (
    <>
      <ConversationsSidebar
        conversations={listedConversations}
        filterOptions={filterOptions}
        onMore={onMore}
        onMoreRecent={onMoreRecent}
        onNewChat={() => setChooserOpen(true)}
        recentChats={recentChats}
        title={title}
      />
      <MobileChatListScreen
        avatarUrl={avatarUrl}
        conversations={listedConversations}
        displayName={displayName}
        filterOptions={filterOptions}
        onMore={onMore}
        onMoreRecent={onMoreRecent}
        onNewChat={() => setChooserOpen(true)}
        profileHref={profileHref}
        recentChats={recentChats}
        tabItems={tabItems}
        title={title}
      />
      <ChatContactChooser
        onOpenChange={setChooserOpen}
        onSelect={(contact) => {
          setChooserOpen(false);
          startConversation(contact);
        }}
        open={chooserOpen}
      />
    </>
  );
};
