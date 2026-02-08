/**
 * Types and interfaces for the Create Post feature.
 */

/**
 * Supported aspect ratios for post images.
 */
export type AspectRatio = "16:9" | "1:1" | "4:5";

/**
 * Image data structure as received from ImageKit after upload.
 */
export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
}

/**
 * Data needed to create a post image record.
 */
export interface CreatePostImageInput {
  url: string;
  fileId: string;
  orderIndex: number;
}

/**
 * Input for the create post server action.
 */
export interface CreatePostInput {
  id?: string;
  content?: string;
  aspectRatio: AspectRatio;
  images: CreatePostImageInput[];
}

/**
 * Result of the create post server action.
 */
export type CreatePostResult =
  | { success: true; postId: string }
  | { success: false; error: string };

/**
 * Input for the update post server action.
 */
export interface UpdatePostInput {
  postId: string;
  content?: string;
}

/**
 * Result of the update post server action.
 */
export type UpdatePostResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Result of the delete post server action.
 */
export type DeletePostResult =
  | { success: true }
  | { success: false; error: string };
