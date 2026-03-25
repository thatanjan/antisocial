# Data Model: User Follow System

**Feature**: User Follow System  
**Branch**: 008-user-follow  
**Date**: March 21, 2026

## Entity: Follow

Represents a follow relationship between two users.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique identifier for the follow record |
| followerId | UUID | Not Null, FK → User.id | User who initiated the follow |
| followeeId | UUID | Not Null, FK → User.id | User being followed |
| createdAt | DateTime | Not Null, Default: now() | Timestamp when follow occurred |

### Constraints

- **Unique**: (followerId, followeeId) - prevents duplicate follows
- **Check**: followerId != followeeId - prevents self-follow
- **Partitioning**: Table partitioned by followerId (range or hash)

### Indexes

```prisma
@@index([followerId, createdAt(desc)])  // For "my following" queries
@@index([followeeId, createdAt(desc)])   // For "my followers" queries
@@unique([followerId, followeeId])        // Duplicate prevention
```

---

## Entity: User (Extension)

The existing User entity is extended with denormalized count fields.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| followerCount | Int | Default: 0, Not Null | Total number of users following this user |
| followingCount | Int | Default: 0, Not Null | Total number of users this user follows |

### Maintenance

- Increment on successful follow action
- Decrement on unfollow action
- Periodic reconciliation job for data consistency

---

## Relationships

```
User (1) ←── (N) Follow (N) →── (1) User
  ↑                    ↑
follower            followee
```

- A User can have many Follow records as follower (they follow others)
- A User can have many Follow records as followee (they are followed by others)
- Follow is a join table with additional constraints

---

## Prisma Schema Changes

```prisma
model User {
  id              String    @id @default(cuid())
  name            String?
  email           String?   @unique
  // ... existing fields
  
  // New: denormalized counts
  followerCount   Int       @default(0)
  followingCount  Int       @default(0)
  
  // Relationships
  following       Follow[]  @relation("Follower")
  followers       Follow[]  @relation("Followee")
}

model Follow {
  id          String   @id @default(cuid())
  followerId  String
  followeeId  String
  createdAt   DateTime @default(now())
  
  // Relationships
  follower    User     @relation("Follower", fields: [followerId], references: [id])
  followee    User     @relation("Followee", fields: [followeeId], references: [id])
  
  // Constraints & Indexes
  @@unique([followerId, followeeId])
  @@index([followerId, createdAt(sort: Desc)])
  @@index([followeeId, createdAt(sort: Desc)])
  
  // Custom constraint for self-follow prevention
  @@check(followerId != followeeId)
}
```

---

## Partitioning Note

PostgreSQL partitioning is defined at the database level, not in Prisma schema. The migration should include:

```sql
-- Partition the follows table by follower_id ranges
CREATE TABLE follows (
    -- ... fields
) PARTITION BY RANGE (follower_id);

-- Create partitions (expand as needed)
CREATE TABLE follows_p0 PARTITION OF follows FOR VALUES FROM (MINVALUE) TO ('1000000');
CREATE TABLE follows_p1 PARTITION OF follows FOR VALUES FROM ('1000000') TO ('2000000');
-- etc.
```

Prisma does not natively express partitioning - it's handled via raw SQL migration.