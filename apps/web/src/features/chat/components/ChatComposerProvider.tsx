"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  type SampleContact,
  type SampleConversation,
  sampleConversations,
} from "../data/sample-conversations";
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
  /** Page-session conversations created via the chooser; stay until reload. */
  readonly sessionConversations: readonly SampleConversation[];
  /**
   * Reuse the existing direct conversation for the contact, or create one
   * (pre-seeded sample thread) and route to it. Returns the conversation id.
   */
  startConversation: (contact: SampleContact) => string;
}

const ChatComposerContext = createContext<ChatComposerContextValue | null>(
  null,
);

export const ChatComposerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [sentMessages, setSentMessages] = useState<
    Record<string, ChatMessage[]>
  >({});
  const [sessionConversations, setSessionConversations] = useState<
    SampleConversation[]
  >([]);

  const appendMessage = useCallback(
    (conversationId: string, message: ChatMessage) => {
      setSentMessages((previous) => ({
        ...previous,
        [conversationId]: [...(previous[conversationId] ?? []), message],
      }));
    },
    [],
  );

  const startConversation = useCallback(
    (contact: SampleContact): string => {
      // Reuse the bundled direct conversation when the contact already has one.
      const existing = sampleConversations.find(
        (conversation) =>
          conversation.id === contact.id && conversation.kind === "direct",
      );
      if (existing) {
        router.push(`/chat/${existing.id}`);
        return existing.id;
      }

      // Otherwise create a page-session thread with a small seeded exchange.
      const seededMessages: ChatMessage[] = [
        {
          id: `${contact.id}-seed-1`,
          direction: "in",
          sender: contact.name,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          body: `Hey! This is ${contact.name}. Sample thread for testing.`,
          dateLabel: "Today",
        },
        {
          id: `${contact.id}-seed-2`,
          direction: "out",
          sender: "You",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          body: "Hi! Testing the new conversation flow.",
          read: true,
        },
      ];
      const created: SampleConversation = {
        id: contact.id,
        name: contact.name,
        avatarUrl: contact.avatarUrl,
        presence: contact.presence,
        kind: "direct",
        timestamp: seededMessages[1].timestamp,
        preview: { kind: "text", text: seededMessages[1].body ?? "" },
        messages: seededMessages,
      };
      setSessionConversations((previous) => [
        ...previous.filter((conversation) => conversation.id !== created.id),
        created,
      ]);
      router.push(`/chat/${created.id}`);
      return created.id;
    },
    [router],
  );

  const value = useMemo<ChatComposerContextValue>(
    () => ({
      sentMessages,
      appendMessage,
      sessionConversations,
      startConversation,
    }),
    [sentMessages, appendMessage, sessionConversations, startConversation],
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
