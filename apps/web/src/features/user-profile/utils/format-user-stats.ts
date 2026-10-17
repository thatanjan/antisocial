/**
 * Utility functions for formatting user profile statistics.
 */

/**
 * Formats a number for display (e.g., 122100 -> "122.1K").
 *
 * @param count - The number to format
 * @returns Formatted string with K/M suffix for large numbers
 *
 * @example
 * ```ts
 * formatCount(150) // "150"
 * formatCount(1221) // "1.2K"
 * formatCount(122100) // "122.1K"
 * formatCount(1500000) // "1.5M"
 * ```
 */
export const formatCount = (count: number): string => {
  if (count < 1000) {
    return count.toString();
  }

  if (count < 1_000_000) {
    const value = count / 1000;
    return value % 1 === 0 ? `${value}K` : `${value.toFixed(1)}K`;
  }

  const value = count / 1_000_000;
  return value % 1 === 0 ? `${value}M` : `${value.toFixed(1)}M`;
};

/**
 * Formats a date to a readable "Joined Month Year" format.
 *
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Joined March 2023")
 *
 * @example
 * ```ts
 * formatJoinDate(new Date("2023-03-15")) // "Joined March 2023"
 * ```
 */
export const formatJoinDate = (date: Date): string => {
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `Joined ${month} ${year}`;
};

/**
 * Formats follower count for display.
 *
 * @param count - The follower count
 * @returns Formatted follower count string
 */
export const formatFollowerCount = (count: number): string => {
  return `${formatCount(count)} Followers`;
};

/**
 * Formats following count for display.
 *
 * @param count - The following count
 * @returns Formatted following count string
 */
export const formatFollowingCount = (count: number): string => {
  return `${formatCount(count)} Following`;
};
