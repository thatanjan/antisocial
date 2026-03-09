"use client";

import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  addReplyAction,
  deleteReplyAction,
  getRepliesAction,
  updateReplyAction,
} from "../actions/replies";
import type { CommentReply } from "../types";
import { CommentInput } from "./CommentInput";
import { CommentLikeButton } from "./CommentLikeButton";

/**
 * Props for the ReplyList component.
 */
interface ReplyListProps {
  /** The ID of the parent comment. */
  commentId: string;
  /** The ID of the post for revalidation. */
  postId: string;
  /** Current user ID for checking permissions. */
  currentUserId?: string;
  /** Callback for when a reply is added. */
  onReplyAdded?: () => void;
  /** Callback for when a reply is deleted. */
  onReplyDeleted?: () => void;
}

/**
 * ReplyList component displays nested replies for a comment and a reply form.
 * Implements optimistic updates for addition, editing, and deletion of replies.
 * Restricts nesting to one level deep per requirements.
 */
export const ReplyList = ({
  commentId,
  postId,
  currentUserId,
  onReplyAdded,
  onReplyDeleted,
}: ReplyListProps) => {
  const [replies, setReplies] = useState<CommentReply[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingReply, setIsAddingReply] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);

  const [, startTransition] = useTransition();

  // Optimistic replies state management
  const [optimisticReplies, addOptimisticReply] = useOptimistic(
    replies,
    (
      state,
      {
        action,
        payload,
      }: {
        action: "add" | "update" | "delete";
        payload: Partial<CommentReply> & { id: string };
      },
    ) => {
      switch (action) {
        case "add":
          return [payload as CommentReply, ...state];
        case "update":
          return state.map((r) =>
            r.id === payload.id ? { ...r, ...payload } : r,
          );
        case "delete":
          return state.filter((r) => r.id !== payload.id);
        default:
          return state;
      }
    },
  );

  /**
   * Initial fetch of replies when the component mounts or commentId changes.
   */
  useEffect(() => {
    const fetchReplies = async () => {
      setIsLoading(true);
      try {
        const res = await getRepliesAction(commentId);
        setReplies(res.replies);
        setTotal(res.total);
      } catch (error) {
        console.error("Failed to fetch replies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReplies();
  }, [commentId]);

  /**
   * Handles adding a new reply.
   */
  const handleAddReply = async (content: string) => {
    if (!content.trim()) return;

    startTransition(async () => {
      // Create a temporary optimistic reply
      const tempReply: CommentReply = {
        id: Math.random().toString(),
        commentId,
        authorId: currentUserId || "",
        author: {
          id: currentUserId || "",
          name: "You", // Fallback for optimistic state
          image: null,
        },
        content,
        likeCount: 0,
        isLiked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addOptimisticReply({ action: "add", payload: tempReply });

      try {
        const res = await addReplyAction(commentId, content);
        if (res.success && res.reply) {
          const newReply = res.reply;
          setReplies((prev) => [newReply, ...prev]);
          setTotal((prev) => prev + 1);
          setIsAddingReply(false);
          onReplyAdded?.();
        } else {
          toast.error(res.error || "Failed to add reply");
        }
      } catch (error) {
        console.error("Error adding reply:", error);
        toast.error("An unexpected error occurred while adding your reply.");
      }
    });
  };

  /**
   * Handles updating an existing reply.
   */
  const handleUpdateReply = async (replyId: string, content: string) => {
    startTransition(async () => {
      addOptimisticReply({
        action: "update",
        payload: { id: replyId, content },
      });
      try {
        const res = await updateReplyAction(replyId, content);
        if (res.success && res.reply) {
          const updatedReply = res.reply;
          setReplies((prev) =>
            prev.map((r) => (r.id === replyId ? updatedReply : r)),
          );
          setEditingReplyId(null);
        } else {
          toast.error(res.error || "Failed to update reply");
        }
      } catch (error) {
        console.error("Error updating reply:", error);
        toast.error("An unexpected error occurred while updating your reply.");
      }
    });
  };

  /**
   * Handles deleting a reply.
   */
  const handleDeleteReply = async (replyId: string) => {
    startTransition(async () => {
      addOptimisticReply({ action: "delete", payload: { id: replyId } });
      try {
        const res = await deleteReplyAction(replyId);
        if (res.success) {
          setReplies((prev) => prev.filter((r) => r.id !== replyId));
          setTotal((prev) => prev - 1);
          onReplyDeleted?.();
        } else {
          toast.error(res.error || "Failed to delete reply");
        }
      } catch (error) {
        console.error("Error deleting reply:", error);
        toast.error("An unexpected error occurred while deleting your reply.");
      }
    });
  };

  // Pagination helper (Load More)
  const hasMore = total > optimisticReplies.length;
  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const res = await getRepliesAction(commentId, 5, replies.length);
      setReplies((prev) => [...prev, ...res.replies]);
      setTotal(res.total);
    } catch {
      toast.error("Failed to load more replies");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-1 border-border/50 border-l-2 pl-4 transition-all duration-300">
      {optimisticReplies.map((reply) => {
        const timeAgo = formatDistanceToNow(new Date(reply.createdAt), {
          addSuffix: true,
        });
        const isOwner = currentUserId === reply.authorId;
        const isEditing = editingReplyId === reply.id;

        return (
          <div
            className="group relative flex gap-3 py-2 transition-colors duration-200"
            key={reply.id}
          >
            {/* Author Avatar */}
            <Avatar className="mt-0.5 h-6 w-6 rounded-full border border-border/50 shadow-xs">
              <AvatarImage
                alt={reply.author.name}
                src={reply.author.image ?? undefined}
              />
              <AvatarFallback className="bg-secondary font-semibold text-[8px] text-secondary-foreground">
                {reply.author.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-foreground text-xs">
                    {reply.author.name}
                  </span>
                  <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                    {timeAgo}
                  </span>
                </div>

                {/* Reply Actions (Edit/Delete) */}
                {isOwner && !isEditing && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 aria-expanded:opacity-100"
                        size="icon"
                        variant="ghost"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                        <span className="sr-only">Reply options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="p-1">
                      <DropdownMenuItem
                        className="cursor-pointer py-1 text-xs"
                        onClick={() => setEditingReplyId(reply.id)}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer py-1 text-destructive text-xs focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => handleDeleteReply(reply.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {isEditing ? (
                <div className="mt-1">
                  <CommentInput
                    autoFocus
                    commentId={commentId}
                    initialContent={reply.content}
                    onCancel={() => setEditingReplyId(null)}
                    onSubmit={(content) => handleUpdateReply(reply.id, content)}
                    postId={postId}
                  />
                </div>
              ) : (
                <p className="wrap-break-word mt-0.5 whitespace-pre-wrap font-normal text-foreground/90 text-xs leading-relaxed">
                  {reply.content}
                </p>
              )}

              {/* Reply Interactions (Like) */}
              {!isEditing && (
                <div className="mt-1.5 flex items-center gap-4">
                  <CommentLikeButton
                    initialIsLiked={!!reply.isLiked}
                    initialLikeCount={reply.likeCount}
                    targetId={reply.id}
                    targetType="reply"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Pagination: Load More */}
      {hasMore && (
        <Button
          className="h-7 w-fit text-[10px] text-muted-foreground hover:text-primary"
          disabled={isLoading}
          onClick={loadMore}
          variant="ghost"
        >
          {isLoading
            ? "Loading..."
            : `View more replies (${total - optimisticReplies.length})`}
        </Button>
      )}

      {/* Reply Form */}
      <div className="mt-2">
        {isAddingReply ? (
          <CommentInput
            autoFocus
            onCancel={() => setIsAddingReply(false)}
            onSubmit={handleAddReply}
            placeholder="Write a reply..."
            postId={postId}
          />
        ) : (
          <Button
            className="h-7 px-0 text-[11px] text-muted-foreground transition-colors hover:bg-transparent hover:text-primary"
            onClick={() => setIsAddingReply(true)}
            variant="ghost"
          >
            Reply to comment
          </Button>
        )}
      </div>
    </div>
  );
};
