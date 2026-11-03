"use client";

import { useEffect, useState } from "react";
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
 * Values read from and written to `?q=` / `?filter=` URL state; ChatListActions
 * filters bundled and page-session conversations from that state.
 */
export const ChatListQuerySync = ({
  filterOptions,
}: ChatListQuerySyncProps) => {
  const { q, filter } = useChatListQuery();
  const { applyQuery } = useChatListNavigation();
  const [searchValue, setSearchValue] = useState(q);

  useEffect(() => {
    setSearchValue(q);
  }, [q]);

  return (
    <>
      <SearchInput
        onChange={(value) => {
          setSearchValue(value);
          applyQuery({ filter, q: value });
        }}
        value={searchValue}
      />
      <FilterPills
        onChange={(value) => applyQuery({ filter: value, q: searchValue })}
        onMoreFilters={() => {}}
        options={filterOptions}
        value={filter}
      />
    </>
  );
};
