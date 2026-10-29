"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ChatConversation, ChatMessage } from "../types";
import { ChatHeader } from "./ChatHeader";
import { MessageComposer } from "./MessageComposer";
import { MessageStream } from "./MessageStream";

interface ChatScreenProps {
  /** Currently open conversation; `null` shows the list state. */
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  /** Controlled composer draft owned by the caller. */
  draft: string;
  onDraftChange: (value: string) => void;
  /** Called with the trimmed draft on send; the caller clears the draft. */
  onSend: (value: string) => void;
  /** Mobile back affordance returning to the list state. */
  onBack: () => void;
  /** Desktop list column (components 1-9); hidden below `md`. */
  sidebar?: ReactNode;
  /** Mobile list state (components 1-9); hidden from `md` up. */
  listScreen?: ReactNode;
  /** Empty-state copy for the desktop pane when nothing is selected. */
  emptyLabel?: string;
  selfAvatarUrl?: string;
  onSearch?: () => void;
  onVideoCall?: () => void;
  onVoiceCall?: () => void;
  onInfo?: () => void;
  onMore?: () => void;
  onCallBack?: (message: ChatMessage) => void;
  onVoiceMemo?: () => void;
  onEmoji?: () => void;
  onAttach?: () => void;
  className?: string;
}

export const ChatScreen = ({
  conversation,
  messages,
  draft,
  onDraftChange,
  onSend,
  onBack,
  sidebar,
  listScreen,
  emptyLabel = "Select a conversation to start chatting.",
  selfAvatarUrl,
  onSearch,
  onVideoCall,
  onVoiceCall,
  onInfo,
  onMore,
  onCallBack,
  onVoiceMemo,
  onEmoji,
  onAttach,
  className,
}: ChatScreenProps) => (
  <div className={cn("bg-background flex h-dvh overflow-hidden", className)}>
    {sidebar}
    {conversation ? (
      <main
        className="relative flex min-w-0 flex-1 flex-col"
        data-purpose="active-chat-pane"
      >
        <ChatHeader
          avatarUrl={conversation.avatarUrl}
          name={conversation.name}
          onBack={onBack}
          onInfo={onInfo}
          online={conversation.presence === "online"}
          onMore={onMore}
          onSearch={onSearch}
          onVideoCall={onVideoCall}
          onVoiceCall={onVoiceCall}
        />
        <MessageStream
          messages={messages}
          onCallBack={onCallBack}
          peerAvatarUrl={conversation.avatarUrl}
          selfAvatarUrl={selfAvatarUrl}
        />
        <MessageComposer
          onAttach={onAttach}
          onEmoji={onEmoji}
          onSend={onSend}
          onValueChange={onDraftChange}
          onVoiceMemo={onVoiceMemo}
          value={draft}
        />
      </main>
    ) : (
      <div className="flex h-full min-w-0 flex-1">
        {listScreen ? (
          <div className="min-w-0 flex-1 md:hidden">{listScreen}</div>
        ) : null}
        <p className="text-muted-foreground m-auto hidden p-6 text-sm md:block">
          {emptyLabel}
        </p>
      </div>
    )}
  </div>
);
