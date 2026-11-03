"use client";

import { Send } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { AutosizeTextarea } from "@/components/ui/auto-resize-textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";

/**
 * Props for the CommentInput component.
 */
interface CommentInputProps {
  /** The ID of the post (optional if editing). */
  postId: string;
  /** Optional ID of the comment if we are editing an existing one. */
  commentId?: string;
  /** Optional initial content if we are editing. */
  initialContent?: string;
  /** Callback for when a comment is successfully submitted (added or updated). */
  onSubmit: (content: string) => Promise<void>;
  /** Optional callback for when editing is cancelled. */
  onCancel?: () => void;
  /** Optional placeholder text. */
  placeholder?: string;
  /** Focus initially or not */
  autoFocus?: boolean;
}

/**
 * CommentInput component provides a textarea and button to add or edit a comment.
 * Features auto-resizing, authenticated session handling, and submission logic.
 */
export const CommentInput = ({
  commentId,
  initialContent = "",
  onSubmit,
  onCancel,
  placeholder = "Write a comment...",
  autoFocus = false,
}: CommentInputProps) => {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const { data: session } = authClient.useSession();

  // Sync content with initialContent when it changes (e.g. when beginning a new edit)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const isEditing = !!commentId;

  /**
   * Handles the form submission by calling the onSubmit prop.
   */
  const handlePostComment = async () => {
    if (!content.trim() || isPending) return;

    startTransition(async () => {
      await onSubmit(content);
      if (!isEditing) {
        setContent("");
      }
    });
  };

  /**
   * Character limit tracker (max 2000 characters).
   */
  const charLimit = 2000;
  const isTooLong = content.length > charLimit;

  if (!session?.user) {
    return (
      <div className="border-border bg-muted/50 flex items-center gap-3 rounded-lg border p-3">
        <div className="text-muted-foreground text-sm">
          Please log in to add a comment.
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 pt-2">
      <Avatar className="border-border mt-1 h-8 w-8 border shadow-sm">
        <AvatarImage
          alt={session.user.name ?? "User"}
          src={session.user.image || undefined}
        />
        <AvatarFallback className="bg-secondary text-secondary-foreground text-[10px] font-semibold">
          {session.user.name?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-2">
        <div className="group relative">
          <AutosizeTextarea
            autoFocus={autoFocus}
            className="scrollbar-hide border-border bg-background/50 focus-within:bg-background focus:border-primary group-hover:border-primary/50 resize-none pr-24 transition-colors duration-200"
            disabled={isPending}
            maxHeight={300}
            minHeight={40}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handlePostComment();
              }
            }}
            placeholder={placeholder}
            value={content}
          />
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {isEditing && (
              <Button
                className="text-muted-foreground hover:text-foreground h-8 px-2 text-xs"
                disabled={isPending}
                onClick={onCancel}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            )}
            <Button
              className="hover:bg-primary/10 hover:text-primary h-8 w-8 transition-colors disabled:opacity-30"
              disabled={!content.trim() || isPending || isTooLong}
              onClick={handlePostComment}
              size="icon"
              title={
                isEditing ? "Update Comment" : "Post Comment (Ctrl + Enter)"
              }
              variant="ghost"
            >
              {isPending ? (
                <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {content.length > charLimit - 100 && (
          <div
            className={`self-end text-[10px] font-medium transition-colors ${isTooLong ? "text-destructive" : "text-muted-foreground"}`}
          >
            {content.length}/{charLimit}
          </div>
        )}
      </div>
    </div>
  );
};
