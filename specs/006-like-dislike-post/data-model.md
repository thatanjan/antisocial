# Data Model: Likes

## Prisma Schema

```prisma
model Like {
  id        String       @id @default(cuid())
  userId    String
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  postId    String
  post      Post         @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime     @default(now())

  @@unique([userId, postId])
  @@index([postId])
  @@map("like")
}

// Add to Post model
model Post {
  // ... existing fields
  likes Like[]
}

// Add to User model
model User {
  // ... existing fields
  likes Like[]
}
```

## Entity Details

### Like
- **userId**: Foreign key to the User who liked.
- **postId**: Foreign key to the Post.
- **Unique Constraint**: `[userId, postId]` ensures a user can only like a post once.

## State Transitions

| Current State | Action | New State |
|---------------|--------|-----------|
| None          | LIKE   | Like Created |
| LIKED         | LIKE   | Like Deleted (Toggle Off) |
