"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authClient";
import { deleteCommentAction, getCommentsAction } from "../actions/comments";
import type { PostComment } from "../types";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { CommentListSkeleton } from "./CommentSkeleton";

interface CommentListProps {
  /** The ID of the post to display comments for. */
  postId: string;
  /** Initial set of comments fetched on the server. */
  initialComments: PostComment[];
  /** Initial total count of comments fetched on the server. */
  initialTotalCount: number;
}

type CommentOptimisticAction =
  | { type: "add"; comment: PostComment }
  | { type: "update"; comment: PostComment }
  | { type: "delete"; commentId: string }
  | { type: "sync"; comments: PostComment[] };

/**
 * CommentList component handles fetching, displaying, and managing comments
 * for a specific post. It implements US1 (Core) and US2 (Management).
 */
export const CommentList = ({
  postId,
  initialComments,
  initialTotalCount,
}: CommentListProps) => {
  const [comments, setComments] = useState<PostComment[]>(initialComments);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const [isInitialLoading, setIsInitialLoading] = useState(
    initialComments.length === 0 && initialTotalCount === 0,
  );
  const [, startTransition] = useTransition();

  const { data: session } = authClient.useSession();

  /**
   * Optimistic UI management for all comment mutations.
   */
  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state: PostComment[], action: CommentOptimisticAction): PostComment[] => {
      switch (action.type) {
        case "add":
          return [action.comment, ...state];
        case "update":
          return state.map((c) =>
            c.id === action.comment.id ? { ...c, ...action.comment } : c,
          );
        case "delete":
          return state.filter((c) => c.id !== action.commentId);
        case "sync":
          return action.comments;
        default:
          return state;
      }
    },
  );

  /**
   * Sync server data if it changes (e.g. on navigation)
   */
  useEffect(() => {
    setComments(initialComments);
    setTotalCount(initialTotalCount);
    addOptimisticComment({ type: "sync", comments: initialComments });
    setIsInitialLoading(false);
  }, [initialComments, initialTotalCount, addOptimisticComment]);

  /**
   * Handle "Load More" logic - (US4 Integration).
   */
  const handleLoadMore = async () => {
    if (isFetchingMore || comments.length >= totalCount) return;
    setIsFetchingMore(true);
    try {
      const result = await getCommentsAction(postId, 5, comments.length);
      setComments((prev) => [...prev, ...result.comments]);
      setTotalCount(result.total);
    } catch (error) {
      console.error("Failed to load more comments:", error);
      toast.error("Failed to load more comments");
    } finally {
      setIsFetchingMore(false);
    }
  };

  /**
   * Handles adding a new comment with optimistic update.
   */
  const handleAddComment = async (content: string) => {
    if (!session?.user) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticComment: PostComment = {
      id: tempId,
      postId,
      authorId: session.user.id,
      author: {
        id: session.user.id,
        name: session.user.name || "You",
        image: session.user.image || null,
      },
      content,
      likeCount: 0,
      replyCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    startTransition(async () => {
      addOptimisticComment({ type: "add", comment: optimisticComment });
      const { addCommentAction } = await import("../actions/comments");
      const result = await addCommentAction(postId, content);
      if (result.success) {
        setComments((prev) => [result.comment, ...prev]);
        setTotalCount((prev) => prev + 1);
      } else {
        toast.error(result.error);
      }
    });
  };

  /**
   * Handles updating a comment with optimistic update.
   */
  const handleUpdateComment = async (commentId: string, content: string) => {
    const originalComment = comments.find((c) => c.id === commentId);
    if (!originalComment) return;

    startTransition(async () => {
      addOptimisticComment({
        type: "update",
        comment: { ...originalComment, content },
      });
      const { updateCommentAction } = await import("../actions/comments");
      const result = await updateCommentAction(commentId, content);
      if (result.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? result.comment : c)),
        );
      } else {
        toast.error(result.error);
      }
      setEditingCommentId(null);
    });
  };

  /**
   * Handles deleting a comment with optimistic update.
   */
  const handleDeleteComment = async (commentId: string) => {
    startTransition(async () => {
      addOptimisticComment({ type: "delete", commentId });

      const result = await deleteCommentAction(commentId);
      if (result.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        setTotalCount((prev) => prev - 1);
        toast.success("Comment deleted");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <div className="fade-in flex animate-in flex-col gap-6 border-border/50 border-t py-6 duration-500">
      {/* Header / Summary */}
      <div className="flex items-center gap-2.5">
        <div className="rounded-full bg-primary/10 p-1.5 text-primary">
          <MessageSquare className="h-4 w-4" />
        </div>
        <h3 className="font-bold text-foreground/90 text-sm uppercase tracking-tight">
          Comments{" "}
          {totalCount > 0 && (
            <span className="ml-1 font-medium text-muted-foreground italic">
              ({totalCount})
            </span>
          )}
        </h3>
      </div>

      {/* Input - US1 */}
      {!editingCommentId && (
        <CommentInput
          onSubmit={handleAddComment}
          placeholder="Share your thoughts..."
          postId={postId}
        />
      )}

      {/* Comments List */}
      <div className="flex flex-col">
        {isInitialLoading ? (
          <CommentListSkeleton count={3} />
        ) : optimisticComments.length > 0 ? (
          <div className="divide-y divide-border/30">
            {optimisticComments.map((comment) => (
              <CommentItem
                comment={comment}
                currentUserId={session?.user?.id}
                isEditing={editingCommentId === comment.id}
                key={comment.id}
                onCommentUpdated={handleUpdateComment}
                onDelete={handleDeleteComment}
                onEdit={(c) => setEditingCommentId(c.id)}
                onEditCancel={() => setEditingCommentId(null)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-border/40 border-dashed bg-accent/5 py-14 text-center transition-all duration-300 hover:bg-accent/10">
            <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="font-medium text-muted-foreground/80 text-sm">
              No comments yet.
            </p>
            <p className="mt-1 text-muted-foreground/60 text-xs italic">
              Be the first to start the discussion!
            </p>
          </div>
        )}

        {/* Load More - US4 */}
        {comments.length < totalCount && (
          <div className="mt-6 flex justify-center border-border/20 border-t pt-6">
            <Button
              className="gap-2 font-bold text-muted-foreground text-xs transition-all duration-200 hover:scale-105 hover:text-primary active:scale-95"
              disabled={isFetchingMore}
              onClick={handleLoadMore}
              size="sm"
              variant="ghost"
            >
              {isFetchingMore ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>
                  LOAD MORE ({totalCount - comments.length} remaining)
                </span>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
