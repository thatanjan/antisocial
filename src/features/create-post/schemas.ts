import { z } from "zod";

/**
 * Zod schema for post image input.
 */
export const postImageSchema = z.object({
  url: z.string().url(),
  fileId: z.string(),
  orderIndex: z.number().int().nonnegative(),
});

/**
 * Zod schema for create post input.
 * Ensures character limit and image count limit are respected.
 */
export const createPostSchema = z
  .object({
    id: z.string().optional(),
    content: z
      .string()
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),
    aspectRatio: z.enum(["16:9", "1:1", "4:5"], {
      message: "Please select a valid aspect ratio",
    }),
    images: z
      .array(postImageSchema)
      .max(10, "You can upload a maximum of 10 images"),
  })
  .refine(
    (data) =>
      (data.content && data.content.trim().length > 0) ||
      data.images.length > 0,
    {
      message: "Post must have either text or at least one image",
      path: ["content"],
    },
  );

export type CreatePostSchema = z.infer<typeof createPostSchema>;
