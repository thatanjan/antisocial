/**
 * Represents a navigation link in the sidebars.
 */
export interface NavItem {
  /** Display label for the link */
  label: string;
  /** Destination route path */
  href: string;
  /** Name of the Lucide icon to display */
  icon: string;
  /** Optional count for notifications or badges */
  badgeCount?: number;
}

/**
 * Represents the current user's profile information for display.
 */
export interface MockUser {
  /** Unique user identifier */
  id: string;
  /** Full name of the user */
  name: string;
  /** Social media handle (e.g., @username) */
  handle: string;
  /** URL to the user's avatar image */
  avatar: string;
  /** User's primary location */
  location: string;
  /** Profile metrics */
  stats: {
    /** Total number of posts */
    posts: number;
    /** Total number of followers */
    followers: number;
    /** Total number of users followed */
    following: number;
  };
}

/**
 * Represents a social interaction item (Request or Suggestion).
 */
export interface SocialItem {
  /** Unique item identifier */
  id: string;
  /** Display name of the user */
  name: string;
  /** Social media handle */
  handle: string;
  /** URL to the user's avatar image */
  avatar: string;
  /** Optional status of the social connection */
  status?: 'active' | 'pending' | 'suggested';
}
