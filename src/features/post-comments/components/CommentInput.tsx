"use client";

import { Send } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AutosizeTextarea } from "@/components/ui/auto-resize-textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { addCommentAction } from "../actions/comments";
import type { PostComment } from "../types";

/**
 * Props for the CommentInput component.
 */
interface CommentInputProps {
  /** The ID of the post to add a comment to. */
  postId: string;
  /** Optional callback for when a comment is successfully added. */
  onCommentAdded?: (comment: PostComment) => void;
  /** Optional placeholder text. */
  placeholder?: string;
  /** Focus initially or not */
  autoFocus?: boolean;
}

/**
 * CommentInput component provides a textarea and button to add a new top-level comment.
 * Features auto-resizing, authenticated session handling, and optimistic submission states.
 */
export const CommentInput = ({
  postId,
  onCommentAdded,
  placeholder = "Write a comment...",
  autoFocus = false,
}: CommentInputProps) => {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const { data: session } = authClient.useSession();

  /**
   * Handles the form submission to add a new comment.
   */
  const handlePostComment = async () => {
    if (!content.trim() || isPending) return;

    startTransition(async () => {
      const result = await addCommentAction(postId, content);

      if (result.success) {
        setContent("");
        if (onCommentAdded) {
          onCommentAdded(result.comment);
        }
        toast.success("Comment posted successfully!");
      } else {
        toast.error(result.error);
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
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
        <div className="text-muted-foreground text-sm">
          Please log in to add a comment.
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 pt-2">
      <Avatar className="mt-1 h-8 w-8 border border-border shadow-sm">
        <AvatarImage
          alt={session.user.name}
          src={session.user.image ?? undefined}
        />
        <AvatarFallback className="bg-secondary font-semibold text-[10px] text-secondary-foreground">
          {session.user.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col gap-2">
        <div className="group relative">
          <AutosizeTextarea
            autoFocus={autoFocus}
            className="scrollbar-hide resize-none border-border bg-background/50 pr-12 transition-all duration-200 focus-within:bg-background focus:border-primary group-hover:border-primary/50"
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
          <div className="absolute top-2 right-2">
            <Button
              className="h-8 w-8 transition-colors hover:bg-primary/10 hover:text-primary disabled:opacity-30"
              disabled={!content.trim() || isPending || isTooLong}
              onClick={handlePostComment}
              size="icon"
              title="Post Comment (Ctrl + Enter)"
              variant="ghost"
            >
              {isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {content.length > charLimit - 100 && (
          <div
            className={`self-end font-medium text-[10px] transition-colors ${isTooLong ? "text-destructive" : "text-muted-foreground"}`}
          >
            {content.length}/{charLimit}
          </div>
        )}
      </div>
    </div>
  );
};
