# Research: User Follow System Implementation

**Date**: March 21, 2026  
**Feature**: User Follow System  
**Branch**: 008-user-follow

## Research Tasks

### 1. Database Partitioning for Large Scale

**Decision**: PostgreSQL range-based partitioning by follower_id

**Rationale**:
- PostgreSQL supports native table partitioning since version 10
- Range partitioning distributes data based on a key range (e.g., user ID ranges)
- Each partition can be placed on different tablespaces for parallel processing
- Partition pruning allows queries to skip irrelevant partitions

**Implementation Approach**:
- Partition by `follower_id` using hash or range distribution
- Initial setup: 4 partitions, expandable to 16+ as data grows
- Partition by user ID ranges (e.g., 0-1M, 1M-2M, etc.) or hash-based

**Alternatives Considered**:
- Hash partitioning: Even distribution but less efficient for range queries
- List partitioning: Good for categorical data, not suitable here
- Single table with indexing: OK for millions, not for billions

---

### 2. Indexing Strategy for Follow Queries

**Decision**: Composite indexes on (follower_id, created_at) and (followee_id, created_at)

**Rationale**:
- Primary query patterns:
  - Get user's following list: WHERE follower_id = X ORDER BY created_at DESC
  - Get user's followers list: WHERE followee_id = X ORDER BY created_at DESC
  - Check if follow exists: WHERE follower_id = X AND followee_id = Y
- Composite index covers both ordering and filtering needs
- Unique constraint on (follower_id, followee_id) handles duplicate prevention at DB level

**Index Design**:
```sql
-- For "who do I follow" queries
CREATE INDEX idx_follows_follower_created ON follows (follower_id, created_at DESC);

-- For "who follows me" queries  
CREATE INDEX idx_follows_followee_created ON follows (followee_id, created_at DESC);

-- For duplicate check (covered by unique constraint)
UNIQUE INDEX idx_follows_unique_follower_followee ON follows (follower_id, followee_id);
```

---

### 3. Denormalized Count Fields in User Profile

**Decision**: Add follower_count and following_count columns to User table

**Rationale**:
- Computing counts from millions of rows is expensive
- Denormalization provides O(1) access to counts
- Can be maintained via triggers or application-level updates
- Prisma supports computed/derived fields pattern

**Maintenance Strategy**:
- Application-level update on follow/unfollow actions
- Periodic reconciliation job to ensure consistency
- Future: Redis cache for real-time counts

---

### 4. Redis Cache (Future)

**Decision**: Not implemented in initial version - planned for future

**Rationale**:
- User explicitly stated "I will add redis cache in future"
- Initial implementation focuses on core functionality
- Database-level optimization (indexes, partitioning) sufficient for MVP

**Future Implementation Notes**:
- Cache follower/following counts
- Cache recent followers list
- Invalidate on follow/unfollow actions
- Use TTL with background refresh

---

## Summary

| Decision | Rationale |
|----------|-----------|
| PostgreSQL partitioning | Scalability for billions of rows |
| Composite indexes | Optimize common query patterns |
| Denormalized counts | O(1) access vs O(n) aggregation |
| No Redis now | User deferring to future phase |