/**
 * Redis client singleton for Upstash Redis integration.
 * Used for caching the news feed with sorted sets.
 */

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL ?? "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
});

export { redis };

export const FEED_CACHE_TTL = 180;
export const FEED_CACHE_MAX_SIZE = 500;
export const HOT_USER_THRESHOLD = 1000;
