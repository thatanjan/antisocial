"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ChatMessage } from "../types";

/**
 * Page-session store for locally sent messages (User Story 2).
 *
 * Lives at the `(chat)` layout level so messages survive in-tab navigation
 * between conversations. Nothing persists: a page reload remounts the layout
 * and discards every locally sent message, restoring the bundled sample data.
 */

interface ChatComposerContextValue {
  /** Locally sent messages per conversation id, oldest first. */
  readonly sentMessages: Readonly<Record<string, readonly ChatMessage[]>>;
  /** Append one trimmed outgoing message; non-empty text enforced by composer. */
  appendMessage: (conversationId: string, message: ChatMessage) => void;
}

const ChatComposerContext = createContext<ChatComposerContextValue | null>(
  null,
);

export const ChatComposerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sentMessages, setSentMessages] = useState<
    Record<string, ChatMessage[]>
  >({});

  const appendMessage = useCallback(
    (conversationId: string, message: ChatMessage) => {
      setSentMessages((previous) => ({
        ...previous,
        [conversationId]: [...(previous[conversationId] ?? []), message],
      }));
    },
    [],
  );

  const value = useMemo<ChatComposerContextValue>(
    () => ({ sentMessages, appendMessage }),
    [sentMessages, appendMessage],
  );

  return (
    <ChatComposerContext.Provider value={value}>
      {children}
    </ChatComposerContext.Provider>
  );
};

/** Access the page-session sent-message store; throws outside the provider. */
export const useChatComposer = (): ChatComposerContextValue => {
  const context = useContext(ChatComposerContext);
  if (!context) {
    throw new Error(
      "useChatComposer must be used inside ChatComposerProvider (the (chat) layout).",
    );
  }
  return context;
};
