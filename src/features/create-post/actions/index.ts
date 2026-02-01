"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "../schemas";
import type { CreatePostInput, CreatePostResult } from "../types";

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
        error: validatedData.error.errors.map((e) => e.message).join(", "),
      };
    }

    const { content, aspectRatio, images } = validatedData.data;

    // 3. Persist to database
    const post = await prisma.post.create({
      data: {
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
