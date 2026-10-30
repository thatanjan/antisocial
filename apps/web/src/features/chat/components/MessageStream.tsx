import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "../types";
import { CallLogCard } from "./CallLogCard";
import { DateSeparator } from "./DateSeparator";
import { MessageBubble } from "./MessageBubble";

interface MessageStreamProps {
  messages: ChatMessage[];
  /** Avatar shown on the other party's messages. */
  peerAvatarUrl?: string;
  /** Avatar shown on the viewer's own outgoing messages. */
  selfAvatarUrl?: string;
  /** Invoked by the call card's call-back button. */
  onCallBack: (message: ChatMessage) => void;
  className?: string;
}

export const MessageStream = ({
  messages,
  peerAvatarUrl,
  selfAvatarUrl,
  onCallBack,
  className,
}: MessageStreamProps) => (
  <div
    aria-label="Message history"
    className={cn(
      "chat-canvas max-md:no-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-4 pb-36 md:gap-6 md:p-6",
      className,
    )}
    data-purpose="messages-stream"
    role="log"
  >
    {messages.map((message) => {
      const avatarUrl =
        message.direction === "out" ? selfAvatarUrl : peerAvatarUrl;
      return (
        <Fragment key={message.id}>
          {message.dateLabel ? (
            <DateSeparator label={message.dateLabel} />
          ) : null}
          {message.type === "call" ? (
            <CallLogCard
              avatarUrl={avatarUrl}
              message={message}
              onCallBack={() => onCallBack(message)}
            />
          ) : (
            <MessageBubble avatarUrl={avatarUrl} message={message} />
          )}
        </Fragment>
      );
    })}
  </div>
);
