"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { commentSchema } from "../schemas";
import type {
  CommentActionResult,
  FetchCommentsResponse,
  PostComment,
} from "../types";
import {
  decrementPostCommentCount,
  incrementPostCommentCount,
} from "../utils/counts";

/**
 * Server action to fetch top-level comments for a post.
 * Supports pagination and includes author information and current user's like status.
 *
 * @param postId - ID of the post
 * @param limit - Maximum number of comments to fetch (default: 5 per spec)
 * @param offset - Number of comments to skip (default: 0)
 * @returns FetchCommentsResponse containing comments and total count
 */
export const getCommentsAction = async (
  postId: string,
  limit: number = 5,
  offset: number = 0,
): Promise<FetchCommentsResponse> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const [comments, total] = await Promise.all([
      prisma.postComment.findMany({
        where: { postId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          commentLikes: session?.user
            ? {
                where: { userId: session.user.id },
                select: { id: true },
              }
            : false,
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.postComment.count({ where: { postId } }),
    ]);

    const formattedComments = comments.map((comment) => ({
      ...comment,
      isLiked: session?.user ? comment.commentLikes.length > 0 : false,
    }));

    return { comments: formattedComments, total };
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return { comments: [], total: 0 };
  }
};

/**
 * Server action to add a new comment to a post.
 * Validates input, creates the record, and increments denormalized counts.
 *
 * @param postId - ID of the post to comment on
 * @param content - Content of the comment (max 2000 chars)
 * @returns CommentActionResult indicating success or error
 */
export const addCommentAction = async (
  postId: string,
  content: string,
): Promise<CommentActionResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to comment.",
      };
    }

    // Validate input
    const validated = commentSchema.safeParse({ content });
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    // Create comment with count increment in a transaction
    const newComment = await prisma.$transaction(async (tx) => {
      const comment = await tx.postComment.create({
        data: {
          postId,
          authorId: session.user.id,
          content: validated.data.content,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      // Increment denormalized count on Post
      await incrementPostCommentCount(tx, postId);

      return comment;
    });

    revalidatePath(`/post/${postId}`);
    revalidatePath("/feed");

    const formattedComment: PostComment = {
      ...newComment,
      isLiked: false,
    };

    return { success: true, comment: formattedComment };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return {
      success: false,
      error: "An unexpected error occurred while adding your comment.",
    };
  }
};

/**
 * Server action to update an existing comment.
 * Validates ownership and input, then updates the record.
 *
 * @param commentId - ID of the comment to update
 * @param content - New content for the comment
 * @returns CommentActionResult indicating success or error
 */
export const updateCommentAction = async (
  commentId: string,
  content: string,
): Promise<CommentActionResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to edit your comment.",
      };
    }

    // Validate input
    const validated = commentSchema.safeParse({ content });
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    // Fetch comment to check ownership
    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true },
    });

    if (!comment) {
      return { success: false, error: "Comment not found." };
    }

    if (comment.authorId !== session.user.id) {
      return {
        success: false,
        error: "Forbidden. You can only edit your own comments.",
      };
    }

    const updatedComment = await prisma.postComment.update({
      where: { id: commentId },
      data: { content: validated.data.content },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(`/post/${comment.postId}`);

    const formattedComment: PostComment = {
      ...updatedComment,
      isLiked: false, // For update, we can keep it false, caller should ideally merge with existing state
    };

    return { success: true, comment: formattedComment };
  } catch (error) {
    console.error("Failed to update comment:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating your comment.",
    };
  }
};

/**
 * Server action to delete a comment.
 * Validates ownership, deletes the record, and decrements denormalized counts.
 * Uses a transaction to ensure consistency with cascade and counts.
 *
 * @param commentId - ID of the comment to delete
 * @returns CommentActionResult (success: true/false)
 */
export const deleteCommentAction = async (
  commentId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to delete your comment.",
      };
    }

    // Fetch comment to check ownership and get counts for denormalization
    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
      select: { authorId: true, postId: true, replyCount: true },
    });

    if (!comment) {
      return { success: false, error: "Comment not found." };
    }

    if (comment.authorId !== session.user.id) {
      return {
        success: false,
        error: "Forbidden. You can only delete your own comments.",
      };
    }

    // Delete comment with count decrement in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete the comment (Prisma will handle cascade deletes of replies and likes if configured)
      await tx.postComment.delete({
        where: { id: commentId },
      });

      // Decrement denormalized count on Post
      // We decrement by 1 (the comment itself) + the number of replies it had
      await decrementPostCommentCount(
        tx,
        comment.postId,
        1 + comment.replyCount,
      );
    });

    revalidatePath(`/post/${comment.postId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete comment:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting your comment.",
    };
  }
};
