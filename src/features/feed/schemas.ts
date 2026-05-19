import { z } from "zod";

export const getFeedSchema = z.object({
  cursor: z.string().nullable().optional(),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .optional()
    .default(20),
});
