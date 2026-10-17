"use client";

import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Reply } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PostComment } from "../types";
import { CommentInput } from "./CommentInput";
import { CommentLikeButton } from "./CommentLikeButton";
import { ReplyList } from "./ReplyList";

/**
 * Props for the CommentItem component.
 */
interface CommentItemProps {
  /** The comment object to display. */
  comment: PostComment;
  /** Current user ID for checking permissions. */
  currentUserId?: string;
  /** Callback for when the user wants to reply. */
  onReply?: (comment: PostComment) => void;
  /** Callback for when the user wants to edit. */
  onEdit?: (comment: PostComment) => void;
  /** Callback for when the user wants to delete. */
  onDelete?: (commentId: string) => void;
  /** Whether the comment is currently being edited. */
  isEditing?: boolean;
  /** Callback to cancel editing. */
  onEditCancel?: () => void;
  /** Callback for when the comment is successfully updated. */
  onCommentUpdated?: (commentId: string, content: string) => void;
}

/**
 * CommentItem component displays an individual comment with author info,
 * content, and interaction buttons. It serves as the base for US1 and
 * is extended with management/interaction capabilities in later stories.
 */
export const CommentItem = ({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  isEditing,
  onEditCancel,
  onCommentUpdated,
}: CommentItemProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const isOwner = currentUserId === comment.authorId;
  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="group flex gap-3 py-3 transition-colors duration-200">
      {/* Author Avatar */}
      <Avatar className="mt-0.5 h-8 w-8 rounded-full border border-border/50 shadow-sm">
        <AvatarImage
          alt={comment.author.name}
          src={comment.author.image ?? undefined}
        />
        <AvatarFallback className="bg-secondary font-semibold text-[10px] text-secondary-foreground">
          {comment.author.name?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Comment Body */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-foreground text-sm">
              {comment.author.name}
            </span>
            <span className="whitespace-nowrap text-[11px] text-muted-foreground">
              {timeAgo}
            </span>
          </div>

          {/* Comment Actions (Edit/Delete) - US2 */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 aria-expanded:opacity-100"
                  size="icon"
                  variant="ghost"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  <span className="sr-only">Comment options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px] p-1">
                <DropdownMenuItem
                  className="cursor-pointer py-1.5 text-xs focus:bg-accent focus:text-accent-foreground"
                  onClick={() => onEdit?.(comment)}
                >
                  Edit Comment
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer py-1.5 text-destructive text-xs focus:bg-destructive/10 focus:text-destructive"
                  onClick={() => onDelete?.(comment.id)}
                >
                  Delete Comment
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing && onCommentUpdated ? (
          <div className="mt-1">
            <CommentInput
              autoFocus
              commentId={comment.id}
              initialContent={comment.content}
              onCancel={onEditCancel}
              onSubmit={async (content) =>
                onCommentUpdated(comment.id, content)
              }
              postId={comment.postId}
            />
          </div>
        ) : (
          <p className="wrap-break-word mt-0.5 whitespace-pre-wrap text-[13px] text-foreground/90 leading-relaxed">
            {comment.content}
          </p>
        )}

        {/* Comment Interactions (Like/Reply) - US3 */}
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <CommentLikeButton
              initialIsLiked={!!comment.isLiked}
              initialLikeCount={comment.likeCount}
              targetId={comment.id}
              targetType="comment"
            />

            <button
              className="flex items-center gap-1.5 font-medium text-[11px] text-muted-foreground transition-colors hover:text-primary"
              onClick={() => {
                setShowReplies(!showReplies);
                onReply?.(comment);
              }}
              type="button"
            >
              <Reply className="h-3 w-3" />
              <span>
                {comment.replyCount > 0
                  ? `${comment.replyCount} ${comment.replyCount === 1 ? "Reply" : "Replies"}`
                  : "Reply"}
              </span>
            </button>
          </div>

          {showReplies && (
            <div className="mt-1">
              <ReplyList
                commentId={comment.id}
                currentUserId={currentUserId}
                postId={comment.postId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
