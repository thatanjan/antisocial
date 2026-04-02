"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { ToggleLikeResult } from "../types";

/**
 * Server action to toggle a like on a post.
 * Uses a Prisma transaction to ensure atomicity between Like record creation/deletion
 * and the denormalized likeCount update on the Post model.
 *
 * @param postId - The ID of the post to like/unlike.
 * @returns A result object containing the new like state and count.
 */
export const toggleLikeAction = async (
  postId: string,
): Promise<ToggleLikeResult> => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to like posts.",
      };
    }

    const userId = session.user.id;

    // 1. Fetch post to verify existence and check author
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!post) {
      return { success: false, error: "Post not found." };
    }

    // 2. Prevent self-liking per requirements
    if (post.authorId === userId) {
      return { success: false, error: "You cannot like your own post." };
    }

    // 3. Perform atomic toggle operation in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const existingLike = await tx.postLikes.findUnique({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      if (existingLike) {
        // CASE: UNLIKE
        await tx.postLikes.delete({
          where: {
            id: existingLike.id,
          },
        });

        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
          select: { likeCount: true },
        });

        return { isLiked: false, likeCount: updatedPost.likeCount };
      } else {
        // CASE: LIKE
        await tx.postLikes.create({
          data: {
            userId,
            postId,
          },
        });

        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
          select: { likeCount: true },
        });

        return { isLiked: true, likeCount: updatedPost.likeCount };
      }
    });

    // 4. Revalidate paths to sync UI across the application
    revalidatePath("/feed");
    revalidatePath(`/post/${postId}`);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return {
      success: false,
      error: "An unexpected error occurred while processing your like.",
    };
  }
};
