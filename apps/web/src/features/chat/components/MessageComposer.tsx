"use client";

import { Mic, Paperclip, Send, Smile } from "lucide-react";
import type { FormEvent, KeyboardEvent } from "react";
import { AutosizeTextarea } from "@/components/ui/auto-resize-textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageComposerProps {
  /** Controlled draft value. */
  value: string;
  onValueChange: (value: string) => void;
  /** Called with the trimmed draft when the user submits; the caller clears the draft. */
  onSend: (value: string) => void;
  onVoiceMemo: () => void;
  onEmoji: () => void;
  onAttach: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const MessageComposer = ({
  value,
  onValueChange,
  onSend,
  onVoiceMemo,
  onEmoji,
  onAttach,
  placeholder = "Type Your Message",
  disabled = false,
  className,
}: MessageComposerProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    onValueChange("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <footer
      className={cn(
        "bg-card/90 md:bg-card border-border pb-safe border-t px-4 pt-4 backdrop-blur-xl",
        "fixed inset-x-0 bottom-0 z-20 md:static md:inset-auto md:z-auto md:p-4",
        className,
      )}
      data-purpose="chat-input-dock"
    >
      <form
        className="bg-muted focus-within:ring-primary/40 focus-within:border-primary flex items-end gap-2 rounded-xl border border-transparent px-4 py-2 transition-colors focus-within:ring-1"
        onSubmit={handleSubmit}
      >
        <Button
          aria-label="Record voice note"
          className="text-muted-foreground"
          onClick={onVoiceMemo}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Mic aria-hidden="true" />
        </Button>
        <AutosizeTextarea
          aria-label="Message"
          className="placeholder:text-muted-foreground min-h-6 flex-1 resize-none overflow-y-auto border-0 bg-transparent px-1 py-1 text-sm shadow-none outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50"
          disabled={disabled}
          maxHeight={108}
          minHeight={20}
          onChange={(event) => onValueChange(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          value={value}
        />
        <Button
          aria-label="Insert emoji"
          className="text-muted-foreground"
          onClick={onEmoji}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Smile aria-hidden="true" />
        </Button>
        <Button
          aria-label="Attach file"
          className="text-muted-foreground"
          onClick={onAttach}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <Paperclip aria-hidden="true" />
        </Button>
        <Button
          aria-label="Send message"
          className="shrink-0 rounded-lg"
          disabled={disabled}
          size="icon"
          type="submit"
        >
          <Send aria-hidden="true" />
        </Button>
      </form>
      <p className="text-muted-foreground mt-2 text-center text-xs">
        Calls, voice notes, and attachments are unavailable in this demo.
      </p>
    </footer>
  );
};
