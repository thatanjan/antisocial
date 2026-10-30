"use client";

import { useMemo, useState } from "react";
import {
  sampleConversations,
  sampleCurrentUser,
} from "../data/sample-conversations";
import type { ChatConversation, ChatMessage } from "../types";
import { useChatComposer } from "./ChatComposerProvider";
import { ChatScreen } from "./ChatScreen";

interface RoutedChatScreenProps {
  conversation: ChatConversation & { messages?: ChatMessage[] };
  selfAvatarUrl?: string;
  className?: string;
}

/**
 * ChatScreen wired to the /chat/[id] route.
 *
 * Sends flow into the layout-level page-session store (see
 * `chatComposerStore`): messages survive in-tab navigation between
 * conversations; a reload remounts the layout and restores sample data.
 * Mobile Back navigates to /chat.
 */
export const RoutedChatScreen = ({
  conversation,
  selfAvatarUrl,
  className,
}: RoutedChatScreenProps) => {
  const { sentMessages, appendMessage } = useChatComposer();
  const [draft, setDraft] = useState("");

  const sampleThread = useMemo(() => {
    if (conversation.messages && conversation.messages.length > 0) {
      return conversation.messages;
    }
    return (
      sampleConversations.find(
        (sampleConversation) => sampleConversation.id === conversation.id,
      )?.messages ?? []
    );
  }, [conversation]);

  const messages = [...sampleThread, ...(sentMessages[conversation.id] ?? [])];

  const handleSend = (text: string) => {
    if (!text) {
      // Composer already guards against empty/whitespace-only sends.
      return;
    }
    // The sample current user renders as "You" in outgoing metadata.
    const sent: ChatMessage = {
      id: `sent-${Date.now()}`,
      direction: "out",
      sender: sampleCurrentUser.displayName,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      body: text,
      read: false,
      type: "text",
    };
    appendMessage(conversation.id, sent);
  };

  return (
    <ChatScreen
      className={className}
      conversation={conversation}
      draft={draft}
      messages={messages}
      onAttach={() => { }}
      onBack={() => {
        window.history.back();
      }}
      onCallBack={() => { }}
      onDraftChange={setDraft}
      onEmoji={() => { }}
      onInfo={() => { }}
      onMore={() => { }}
      onSearch={() => { }}
      onSend={handleSend}
      onVideoCall={() => { }}
      onVoiceCall={() => { }}
      onVoiceMemo={() => { }}
      selfAvatarUrl={selfAvatarUrl}
    />
  );
};
