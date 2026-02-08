"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { imagekit } from "@/lib/imagekit";
import prisma from "@/lib/prisma";
import { createPostSchema, updatePostSchema } from "../schemas";
import type {
  CreatePostInput,
  CreatePostResult,
  DeletePostResult,
  UpdatePostInput,
  UpdatePostResult,
} from "../types";

/**
 * Server action to create a new post.
 * Validates the input using Zod and persists the post to the database.
 *
 * @param data - The post data including content, aspect ratio, and images.
 * @returns A result object indicating success and the new post ID, or an error message.
 */
export const createPostAction = async (
  data: CreatePostInput,
): Promise<CreatePostResult> => {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized. Please log in to create a post.",
      };
    }

    // 2. Validate input
    const validatedData = createPostSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { id, content, aspectRatio, images } = validatedData.data;

    // 3. Persist to database
    const post = await prisma.post.create({
      data: {
        id: id || undefined,
        authorId: session.user.id,
        content: content ?? null,
        aspectRatio: aspectRatio ?? null,
        images: {
          create: images.map((img) => ({
            url: img.url,
            fileId: img.fileId,
            orderIndex: img.orderIndex,
          })),
        },
      },
    });

    return { success: true, postId: post.id };
  } catch (error) {
    console.error("Failed to create post:", error);
    return {
      success: false,
      error:
        "An unexpected error occurred while creating the post. Please try again.",
    };
  }
};

/**
 * Server action to update an existing post's text content.
 * Verifies that the requester is the post author.
 *
 * @param data - The update data including postId and new content.
 * @returns A result object indicating success or an error message.
 */
export const updatePostAction = async (
  data: UpdatePostInput,
): Promise<UpdatePostResult> => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = updatePostSchema.safeParse(data);
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { postId, content } = validatedData.data;

    // Check ownership
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (!existingPost) {
      return { success: false, error: "Post not found" };
    }

    if (existingPost.authorId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to edit this post",
      };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { content: content ?? null },
    });

    revalidatePath("/feed");
    revalidatePath(`/profile/${session.user.id}`);
    revalidatePath(`/post/${postId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to update post:", error);
    return { success: false, error: "Failed to update post" };
  }
};

/**
 * Server action to delete a post.
 * Verifies that the requester is the post author.
 * Note: Actual ImageKit deletion logic would go here as well.
 *
 * @param postId - The ID of the post to delete.
 * @returns A result object indicating success or an error message.
 */
export const deletePostAction = async (
  postId: string,
): Promise<DeletePostResult> => {
  console.log(postId)
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check ownership
    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { images: true },
    });

    if (!existingPost) {
      return { success: false, error: "Post not found" };
    }

    if (existingPost.authorId !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to delete this post",
      };
    }

    // 1. Delete images from ImageKit storage
    const fileIds = existingPost.images.map((img) => img.fileId);
    if (fileIds.length > 0) {
      try {
        // Using Promise.allSettled to ensure we try to delete all images 
        // even if some fail (e.g. already deleted or invalid fileId)
        await Promise.allSettled(fileIds.map((id) => imagekit.deleteFile(id)));
      } catch (error) {
        // Log error but proceed with database deletion to keep UI in sync
        console.error("ImageKit deletion failed:", error);
      }
    }

    // 2. Delete from database
    await prisma.$transaction(async (tx) => {
      await tx.postImage.deleteMany({
        where: { postId },
      });
      await tx.post.delete({
        where: { id: postId },
      });
    });

    revalidatePath("/feed");
    revalidatePath(`/profile/${session.user.id}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, error: "Failed to delete post" };
  }
};
