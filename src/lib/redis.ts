/**
 * Redis client singleton for Upstash Redis integration.
 * Used for caching the news feed with sorted sets.
 */

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL ?? "",
  token: process.env.REDIS_TOKEN ?? "",
});

export { redis };

export const FEED_CACHE_TTL = 180;
export const FEED_CACHE_MAX_SIZE = 500;
export const HOT_USER_THRESHOLD = 1000;
