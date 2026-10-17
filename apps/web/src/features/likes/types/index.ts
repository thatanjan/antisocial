/**
 * Result of a toggle like operation.
 */
export interface ToggleLikeResult {
  success: boolean;
  data?: {
    isLiked: boolean;
    likeCount: number;
  };
  error?: string;
}

/**
 * Initial state passed to the LikeButton component.
 */
export interface LikeState {
  isLiked: boolean;
  likeCount: number;
}
