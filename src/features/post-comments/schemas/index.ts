import { z } from "zod";

/**
 * Zod schema for post comment content.
 */
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment cannot exceed 2000 characters"),
});

export type CommentSchema = z.infer<typeof commentSchema>;

/**
 * Zod schema for comment reply content.
 */
export const replySchema = z.object({
  content: z
    .string()
    .min(1, "Reply cannot be empty")
    .max(2000, "Reply cannot exceed 2000 characters"),
});

export type ReplySchema = z.infer<typeof replySchema>;
