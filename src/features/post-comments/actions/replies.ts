"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { replySchema } from "../schemas";
import type {
  CommentReply,
  FetchRepliesResponse,
  ReplyActionResult,
} from "../types";
import {
  decrementCommentReplyCount,
  decrementPostCommentCount,
  incrementCommentReplyCount,
  incrementPostCommentCount,
} from "../utils/counts";

/**
 * Server action to add a new reply to a comment.
 * Validates input, creates the record, and increments denormalized counts on both the comment and the post.
 *
 * @param commentId - ID of the parent comment
 * @param content - Content of the reply (max 2000 chars)
 * @returns ReplyActionResult indicating success or error
 */
export const addReplyAction = async (
  commentId: string,
  content: string,
): Promise<ReplyActionResult> => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to reply.",
      };
    }

    // Validate input
    const validated = replySchema.safeParse({ content });
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    // Fetch parent comment to get postId for revalidation and count update
    const parentComment = await prisma.postComment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });

    if (!parentComment) {
      return { success: false, error: "Parent comment not found." };
    }

    // Create reply and update counts in a transaction
    const newReply = await prisma.$transaction(async (tx) => {
      const reply = await tx.commentReply.create({
        data: {
          commentId,
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

      // Increment denormalized count on the parent comment
      await incrementCommentReplyCount(tx, commentId);

      // Increment denormalized count on the post
      await incrementPostCommentCount(tx, parentComment.postId);

      return reply;
    });

    revalidatePath(`/post/${parentComment.postId}`);

    const formattedReply: CommentReply = {
      ...newReply,
      isLiked: false,
    };

    return { success: true, reply: formattedReply };
  } catch (error) {
    console.error("Failed to add reply:", error);
    return {
      success: false,
      error: "An unexpected error occurred while adding your reply.",
    };
  }
};

/**
 * Server action to update an existing reply.
 * Validates ownership and input, then updates the record.
 *
 * @param replyId - ID of the reply to update
 * @param content - New content for the reply
 * @returns ReplyActionResult indicating success or error
 */
export const updateReplyAction = async (
  replyId: string,
  content: string,
): Promise<ReplyActionResult> => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to edit your reply.",
      };
    }

    // Validate input
    const validated = replySchema.safeParse({ content });
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((e) => e.message).join(", "),
      };
    }

    // Fetch reply to check ownership and get postId for revalidation
    const reply = await prisma.commentReply.findUnique({
      where: { id: replyId },
      include: {
        comment: {
          select: { postId: true },
        },
      },
    });

    if (!reply) {
      return { success: false, error: "Reply not found." };
    }

    if (reply.authorId !== session.user.id) {
      return {
        success: false,
        error: "Forbidden. You can only edit your own replies.",
      };
    }

    const updatedReply = await prisma.commentReply.update({
      where: { id: replyId },
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

    revalidatePath(`/post/${reply.comment.postId}`);

    const formattedReply: CommentReply = {
      ...updatedReply,
      isLiked: false, // Caller should ideally merge with existing state
    };

    return { success: true, reply: formattedReply };
  } catch (error) {
    console.error("Failed to update reply:", error);
    return {
      success: false,
      error: "An unexpected error occurred while updating your reply.",
    };
  }
};

/**
 * Server action to delete a reply.
 * Validates ownership, deletes the record, and decrements denormalized counts.
 *
 * @param replyId - ID of the reply to delete
 * @returns Object indicating success or error
 */
export const deleteReplyAction = async (
  replyId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to delete your reply.",
      };
    }

    // Fetch reply to check ownership and get counts for denormalization
    const reply = await prisma.commentReply.findUnique({
      where: { id: replyId },
      include: {
        comment: {
          select: { id: true, postId: true },
        },
      },
    });

    if (!reply) {
      return { success: false, error: "Reply not found." };
    }

    if (reply.authorId !== session.user.id) {
      return {
        success: false,
        error: "Forbidden. You can only delete your own replies.",
      };
    }

    // Delete reply and update counts in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.commentReply.delete({
        where: { id: replyId },
      });

      // Decrement denormalized count on the parent comment
      await decrementCommentReplyCount(tx, reply.commentId);

      // Decrement denormalized count on the post
      await decrementPostCommentCount(tx, reply.comment.postId);
    });

    revalidatePath(`/post/${reply.comment.postId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete reply:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting your reply.",
    };
  }
};

/**
 * Server action to fetch replies for a comment.
 * Supports pagination and includes author information and current user's like status.
 *
 * @param commentId - ID of the parent comment
 * @param limit - Maximum number of replies to fetch (default: 5)
 * @param offset - Number of replies to skip (default: 0)
 * @returns Object containing replies and total count
 */
export const getRepliesAction = async (
  commentId: string,
  limit: number = 5,
  offset: number = 0,
): Promise<FetchRepliesResponse> => {
  try {
    const session = await getSession();

    const [replies, total] = await Promise.all([
      prisma.commentReply.findMany({
        where: { commentId },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replyLikes: session?.user
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
      prisma.commentReply.count({ where: { commentId } }),
    ]);

    const formattedReplies = replies.map((reply) => ({
      ...reply,
      isLiked: session?.user ? reply.replyLikes.length > 0 : false,
    }));

    return { replies: formattedReplies, total };
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    return { replies: [], total: 0 };
  }
};
