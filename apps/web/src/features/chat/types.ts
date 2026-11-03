import type { ChatPresence } from "./components/RecentChatsStrip";

export type ChatMessageDirection = "in" | "out";

export type ChatCallKind = "video" | "voice";

/** Identity of the peer in an open conversation (chat header / list selection). */
export interface ChatConversation {
  id: string;
  name: string;
  avatarUrl?: string;
  /** Same flag the list rows use; `"online"` renders the header status line. */
  presence?: ChatPresence;
}

export interface ChatMessage {
  id: string;
  direction: ChatMessageDirection;
  /** Display name of the author, e.g. "Emily Carter" (incoming) or "You" (outgoing). */
  sender: string;
  timestamp: string;
  body?: string;
  deleted?: boolean;
  starred?: boolean;
  /** Outgoing only: renders the "Read" receipt under the bubble. */
  read?: boolean;
  type?: "text" | "call";
  callKind?: ChatCallKind;
  durationText?: string;
  cancelled?: boolean;
  /** When set, a `DateSeparator` with this label renders above the message. */
  dateLabel?: string;
}
