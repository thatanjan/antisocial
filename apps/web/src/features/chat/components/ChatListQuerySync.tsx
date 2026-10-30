"use client";

import {
  useChatListNavigation,
  useChatListQuery,
} from "../hooks/useChatListState";
import type { ChatFilterOption } from "./FilterPills";
import { FilterPills } from "./FilterPills";
import { SearchInput } from "./SearchInput";

export type { ChatFilterOption };

interface ChatListQuerySyncProps {
  filterOptions: ChatFilterOption[];
}

/**
 * Client bridge for the conversation-list search box and filter pills.
 * Values read from and written to `?q=` / `?filter=` URL state; server
 * components re-filter the conversation list from those params.
 */
export const ChatListQuerySync = ({
  filterOptions,
}: ChatListQuerySyncProps) => {
  const { q, filter } = useChatListQuery();
  const { applyQuery } = useChatListNavigation();

  return (
    <>
      <SearchInput onChange={(value) => applyQuery({ q: value })} value={q} />
      <FilterPills
        onChange={(value) => applyQuery({ filter: value })}
        onMoreFilters={() => {}}
        options={filterOptions}
        value={filter}
      />
    </>
  );
};
