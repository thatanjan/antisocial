"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ToggleLikeResult } from "../types";
import {
  decrementCommentLikeCount,
  decrementReplyLikeCount,
  incrementCommentLikeCount,
  incrementReplyLikeCount,
} from "../utils/counts";

/**
 * Server action to toggle a like on a comment.
 * If the user has already liked the comment, it removes the like and decrements the count.
 * Otherwise, it adds a like and increments the count.
 *
 * @param commentId - ID of the comment to like/unlike
 * @returns ToggleLikeResult containing the new like status and count
 */
export const toggleCommentLikeAction = async (
  commentId: string,
): Promise<ToggleLikeResult> => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to like this comment.",
      };
    }

    const { id: userId } = session.user;

    // Use a transaction to ensure consistency between the like record and denormalized count
    const result = await prisma.$transaction(async (tx) => {
      // Check if the like already exists
      const existingLike = await tx.commentLike.findUnique({
        where: {
          userId_commentId: {
            userId,
            commentId,
          },
        },
      });

      if (existingLike) {
        // Unlike: delete the record and decrement count
        await tx.commentLike.delete({
          where: { id: existingLike.id },
        });
        await decrementCommentLikeCount(tx, commentId);

        // Fetch the updated count
        const updatedComment = await tx.postComment.findUnique({
          where: { id: commentId },
          select: { likeCount: true, postId: true },
        });

        return {
          isLiked: false,
          likeCount: updatedComment?.likeCount ?? 0,
          postId: updatedComment?.postId,
        };
      } else {
        // Like: create the record and increment count
        await tx.commentLike.create({
          data: {
            userId,
            commentId,
          },
        });
        await incrementCommentLikeCount(tx, commentId);

        // Fetch the updated count
        const updatedComment = await tx.postComment.findUnique({
          where: { id: commentId },
          select: { likeCount: true, postId: true },
        });

        return {
          isLiked: true,
          likeCount: updatedComment?.likeCount ?? 0,
          postId: updatedComment?.postId,
        };
      }
    });

    if (result.postId) {
      revalidatePath(`/post/${result.postId}`);
    }

    return {
      success: true,
      isLiked: result.isLiked,
      likeCount: result.likeCount,
    };
  } catch (error) {
    console.error("Failed to toggle comment like:", error);
    return {
      success: false,
      error: "An unexpected error occurred while toggling the like.",
    };
  }
};

/**
 * Server action to toggle a like on a reply.
 * If the user has already liked the reply, it removes the like and decrements the count.
 * Otherwise, it adds a like and increments the count.
 *
 * @param replyId - ID of the reply to like/unlike
 * @returns ToggleLikeResult containing the new like status and count
 */
export const toggleReplyLikeAction = async (
  replyId: string,
): Promise<ToggleLikeResult> => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to like this reply.",
      };
    }

    const { id: userId } = session.user;

    // Use a transaction to ensure consistency between the like record and denormalized count
    const result = await prisma.$transaction(async (tx) => {
      // Check if the like already exists
      const existingLike = await tx.replyLike.findUnique({
        where: {
          userId_replyId: {
            userId,
            replyId,
          },
        },
      });

      if (existingLike) {
        // Unlike: delete the record and decrement count
        await tx.replyLike.delete({
          where: { id: existingLike.id },
        });
        await decrementReplyLikeCount(tx, replyId);

        // Fetch updated information for revalidation
        const updatedReply = await tx.commentReply.findUnique({
          where: { id: replyId },
          select: { likeCount: true, comment: { select: { postId: true } } },
        });

        return {
          isLiked: false,
          likeCount: updatedReply?.likeCount ?? 0,
          postId: updatedReply?.comment.postId,
        };
      } else {
        // Like: create the record and increment count
        await tx.replyLike.create({
          data: {
            userId,
            replyId,
          },
        });
        await incrementReplyLikeCount(tx, replyId);

        // Fetch updated information for revalidation
        const updatedReply = await tx.commentReply.findUnique({
          where: { id: replyId },
          select: { likeCount: true, comment: { select: { postId: true } } },
        });

        return {
          isLiked: true,
          likeCount: updatedReply?.likeCount ?? 0,
          postId: updatedReply?.comment.postId,
        };
      }
    });

    if (result.postId) {
      revalidatePath(`/post/${result.postId}`);
    }

    return {
      success: true,
      isLiked: result.isLiked,
      likeCount: result.likeCount,
    };
  } catch (error) {
    console.error("Failed to toggle reply like:", error);
    return {
      success: false,
      error: "An unexpected error occurred while toggling the like.",
    };
  }
};
