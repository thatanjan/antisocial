/**
 * Bundled sample data for the chat feature.
 *
 * Every export below is static demonstration data assembled in-memory when the
 * module loads. Per specs/014-chat-ui/data-model.md, nothing here is persisted
 * (no database, no server actions): sends, previews, and new conversations are
 * page-session state kept by the caller, and a page reload discards all
 * page-session changes and reseeds the UI from these exports. Consumers MUST
 * treat the exported arrays and objects as immutable; apply page-session
 * mutations to copies in caller-owned state, never to these values.
 */
import type { ConversationItem } from "../components/ConversationListItem";
import type { ChatFilterOption } from "../components/FilterPills";
import type {
  ChatPresence,
  RecentChatItem,
} from "../components/RecentChatsStrip";
import type { ChatMessage } from "../types";

/** A bundled conversation: list display fields plus its sample message history. */
export interface SampleConversation extends ConversationItem {
  /** `"group"` drives the Groups category filter; `"direct"` is a one-to-one thread. */
  kind: "direct" | "group";
  /** Marks the row for the Unread category filter. */
  unread?: boolean;
  /** Marks the row for the Favourites category filter. */
  favourite?: boolean;
  /** Ordered sample history for `MessageStream`; local sends are appended by the caller. */
  messages: ChatMessage[];
}

/** A sample participant offered by the new-conversation contact chooser. */
export interface SampleContact {
  id: string;
  name: string;
  avatarUrl?: string;
  presence?: ChatPresence;
}

/** The signed-in sample identity shown by the rail, tabs, and composer avatar. */
export interface SampleCurrentUser {
  id: string;
  displayName: string;
  avatarUrl: string;
}

/** Filter pills for the conversation list, shared by desktop sidebar and mobile list. */
export const sampleFilterOptions: ChatFilterOption[] = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Favourites", value: "favourites" },
  { label: "Groups", value: "groups" },
];

/** Sample signed-in user ("You" in outgoing message metadata per the mocks). */
export const sampleCurrentUser: SampleCurrentUser = {
  id: "current-user",
  displayName: "You",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBZvf8UK3lDbGuOR0b1sRLCJ5w7-s6TCf_1SHJrGeXSMZeCc9iSAjwRvb1jF8C4VnSqrkWJWfigZSEFCjzv3SLvpgjQsQRv3Z5tdbPJekXHzXj4Ewtlqsb2r0zF9jBTAZA6rx9Axte2WXankdsRg3f0bkMaGRyNU-kSRodSSFBp-f2NMN8qElWJS7ZV4Ms5wfd_kVkNGmoIuxIzb_hmr7XpcxhZOfEpRZNeDIhNOPtf68tQ6r5kL7s",
};

/** Sample contacts for the new-conversation chooser; "Jordan Lee" has no bundled thread. */
export const sampleContacts: SampleContact[] = [
  {
    id: "mark-williams",
    name: "Mark Williams",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxPMoh09UBke4AFuAvAILiWoLEi1WgVVhcCOeUfhJeOwiwy0TcFh6uO79VZrjaZvngKoQ9W7FdUktnfmsdhqsf7s9bqNC_nqtRqALMVh0s84G9kh8IcaOHCOzzLD2wItXF6j26O876_5XaO1hm7rk462xuCQwCFdBFwWXhR3JyPvFzOywiojgWHz5O924exIi7km6QfUFVnLisUbVSG2S4p7amxXPnkOUvSYNMCwTNJ1yeYfm7X38",
    presence: "online",
  },
  {
    id: "emily-carter",
    name: "Emily Carter",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBadT661ChiWwdQtN1vKBNwk8q7cynXB_0_DpOz5-cELWKHTJuGuUjZkAx6eMRf63EaNxKTVx8bPp0-JaLw0FZu63gLZ_5UzCZjspfzVbrZtGFyMVmDo3AYUKXNjNkbHMgqgJ63tdlM0IMA2PV41iRUNfUJh_SUwRD6YOgOeSLO0jDKcDkohg_N04ExrS6hEHactb7tK9iUu0WDTQo6p3v4J_1jRACVOcKZ0PFOEhyy1oVcLvnYAWM",
    presence: "online",
  },
  {
    id: "clyde-smith",
    name: "Clyde Smith",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDE-hMdMtBZ16T0XOic0mK7Jb8hvdlwDf0Xq_wHuBsVo1kwi2FgPGtP1eTx5I77AuYjQCNoro_1U-uDYBGAq4JO1RUwGYmZyljHZH2jQjW4vFUFPJ7G1QWq_2fJyf-AY1YM-noU38BwxnDfZC_IvLSHQSr9R1vaBOG_zmMCY5cCua1_tOJz0ANrs8BpuaTR1t86bLeb8D6Go8fw5dp8N-LMzZtYa4mBLsm3NcKYOaOqpRoCW0f4KUY",
    presence: "busy",
  },
  {
    id: "jordan-lee",
    name: "Jordan Lee",
  },
];

/** The bundled Emily Carter unread thread: text, deleted, starred, and read variants plus one call event. */
const emilyMessages: ChatMessage[] = [
  {
    id: "emily-1",
    direction: "in",
    sender: "Emily Carter",
    timestamp: "02:38 AM",
    body: "Do you know which build the client is testing?",
    dateLabel: "Yesterday",
  },
  {
    id: "emily-2",
    direction: "out",
    sender: "You",
    timestamp: "03:38 AM",
    body: "Build 2.7.6, I shared the link this morning.",
    read: true,
  },
  {
    id: "emily-3",
    direction: "out",
    sender: "You",
    timestamp: "04:38 AM",
    deleted: true,
  },
  {
    id: "emily-4",
    direction: "in",
    sender: "Emily Carter",
    timestamp: "05:39 AM",
    body: "Found it, thanks!",
    starred: true,
  },
  {
    id: "emily-5",
    direction: "out",
    sender: "You",
    timestamp: "08:25 PM",
    body: "ce",
    read: true,
  },
  {
    id: "emily-6",
    direction: "in",
    sender: "Emily Carter",
    timestamp: "09:25 PM",
    body: "Sure, let me check and get back to you.",
  },
  {
    id: "emily-7",
    direction: "in",
    sender: "Emily Carter",
    timestamp: "09:28 PM",
    type: "call",
    callKind: "voice",
    durationText: "1 sec",
  },
];

/** The five bundled conversations replicating the stitch-screen mocks. */
export const sampleConversations: SampleConversation[] = [
  {
    id: "mark-williams",
    name: "Mark Williams",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxPMoh09UBke4AFuAvAILiWoLEi1WgVVhcCOeUfhJeOwiwy0TcFh6uO79VZrjaZvngKoQ9W7FdUktnfmsdhqsf7s9bqNC_nqtRqALMVh0s84G9kh8IcaOHCOzzLD2wItXF6j26O876_5XaO1hm7rk462xuCQwCFdBFwWXhR3JyPvFzOywiojgWHz5O924exIi7km6QfUFVnLisUbVSG2S4p7amxXPnkOUvSYNMCwTNJ1yeYfm7X38",
    presence: "online",
    kind: "direct",
    favourite: true,
    pinned: true,
    timestamp: "12:11 PM",
    preview: { kind: "call", call: "video" },
    messages: [],
  },
  {
    id: "am-technology",
    name: "AM Technology",
    presence: "online",
    kind: "group",
    timestamp: "08:38 AM",
    preview: { kind: "text", text: "Thanks, I will review the numbers." },
    read: true,
    messages: [
      {
        id: "am-technology-1",
        direction: "in",
        sender: "AM Technology",
        timestamp: "08:38 AM",
        body: "Thanks, I will review the numbers.",
      },
    ],
  },
  {
    id: "emily-carter",
    name: "Emily Carter",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBadT661ChiWwdQtN1vKBNwk8q7cynXB_0_DpOz5-cELWKHTJuGuUjZkAx6eMRf63EaNxKTVx8bPp0-JaLw0FZu63gLZ_5UzCZjspfzVbrZtGFyMVmDo3AYUKXNjNkbHMgqgJ63tdlM0IMA2PV41iRUNfUJh_SUwRD6YOgOeSLO0jDKcDkohg_N04ExrS6hEHactb7tK9iUu0WDTQo6p3v4J_1jRACVOcKZ0PFOEhyy1oVcLvnYAWM",
    presence: "online",
    kind: "direct",
    unread: true,
    timestamp: "09:28 PM",
    preview: { kind: "call", call: "voice" },
    messages: emilyMessages,
  },
  {
    id: "clyde-smith",
    name: "Clyde Smith",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDE-hMdMtBZ16T0XOic0mK7Jb8hvdlwDf0Xq_wHuBsVo1kwi2FgPGtP1eTx5I77AuYjQCNoro_1U-uDYBGAq4JO1RUwGYmZyljHZH2jQjW4vFUFPJ7G1QWq_2fJyf-AY1YM-noU38BwxnDfZC_IvLSHQSr9R1vaBOG_zmMCY5cCua1_tOJz0ANrs8BpuaTR1t86bLeb8D6Go8fw5dp8N-LMzZtYa4mBLsm3NcKYOaOqpRoCW0f4KUY",
    presence: "busy",
    kind: "direct",
    timestamp: "09:26 PM",
    preview: { kind: "call", call: "voice-cancelled" },
    read: true,
    messages: [
      {
        id: "clyde-1",
        direction: "in",
        sender: "Clyde Smith",
        timestamp: "09:26 PM",
        type: "call",
        callKind: "voice",
        cancelled: true,
      },
    ],
  },
  {
    id: "design-dynamos",
    name: "Design Dynamos",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtD_pj6KWMmf8rr71orv1aBxmXuWW0P0lgTtZ_4koIKditm3umg912O2upkS2C3wB_Uhi61sxYPzUnx6dDb9AdopqLdflj5tWzsW-U6F1-GFFn180Tp2e7m44GzdCB5ayyA0MYLg8QqyGJKYalAvbqPsLTUSCzqagRbRXtD79jQGExHTqwoYGRrXPbZEXUBoUjBbgNheiRf4mNsA2xQ2MISjkFQxDBlRkjcJzA1V5IwTXd3BUBuDQ",
    presence: "online",
    kind: "group",
    timestamp: "09:38 AM",
    preview: { kind: "text", text: "Agreed, minimal it is." },
    messages: [
      {
        id: "design-dynamos-1",
        direction: "in",
        sender: "Design Dynamos",
        timestamp: "09:38 AM",
        body: "Agreed, minimal it is.",
      },
    ],
  },
];

/** Recent-chats strip entries, one per bundled direct conversation face shown in the mocks. */
export const recentChats: RecentChatItem[] = [
  {
    id: "mark-williams",
    name: "Mark",
    presence: "online",
    avatarUrl: sampleContacts[0].avatarUrl,
  },
  {
    id: "emily-carter",
    name: "Emily",
    presence: "online",
    avatarUrl: sampleContacts[1].avatarUrl,
  },
  {
    id: "clyde-smith",
    name: "Clyde",
    presence: "busy",
    avatarUrl: sampleContacts[2].avatarUrl,
  },
  {
    id: "design-dynamos",
    name: "Design",
    presence: "online",
    avatarUrl: sampleConversations[4].avatarUrl,
  },
];
