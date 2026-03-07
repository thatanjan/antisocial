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
import { incrementPostCommentCount } from "../utils/counts";

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
