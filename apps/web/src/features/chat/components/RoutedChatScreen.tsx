"use client";

import { useRouter } from "next/navigation";
import type { ChatConversation, ChatMessage } from "../types";
import { ChatScreen } from "./ChatScreen";

interface RoutedChatScreenProps {
  conversation: ChatConversation;
  messages: ChatMessage[];
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: (value: string) => void;
  onCallBack?: (message: ChatMessage) => void;
  selfAvatarUrl?: string;
  className?: string;
}

/** ChatScreen wired to the /chat/[id] route: mobile Back navigates to /chat. */
export const RoutedChatScreen = ({
  conversation,
  messages,
  draft,
  onDraftChange,
  onSend,
  onCallBack,
  selfAvatarUrl,
  className,
}: RoutedChatScreenProps) => {
  const router = useRouter();

  return (
    <ChatScreen
      className={className}
      conversation={conversation}
      draft={draft}
      messages={messages}
      onAttach={() => {}}
      onBack={() => {
        router.push("/chat");
      }}
      onCallBack={onCallBack}
      onDraftChange={onDraftChange}
      onEmoji={() => {}}
      onInfo={() => {}}
      onMore={() => {}}
      onSearch={() => {}}
      onSend={onSend}
      onVideoCall={() => {}}
      onVoiceCall={() => {}}
      onVoiceMemo={() => {}}
      selfAvatarUrl={selfAvatarUrl}
    />
  );
};
