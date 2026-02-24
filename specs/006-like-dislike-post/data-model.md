# Data Model: PostLikes

## Prisma Schema

```prisma
model PostLikes {
  id        String       @id @default(cuid())
  userId    String
  user      User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  postId    String
  post      Post         @relation(fields: [postId], references: [id], onDelete: Cascade)
  createdAt DateTime     @default(now())

  @@unique([userId, postId])
  @@index([postId])
  @@map("post_likes")
}

// Add to Post model
model Post {
  // ... existing fields
  likeCount Int @default(0)
  postLikes PostLikes[]
}

// Add to User model
model User {
  // ... existing fields
  postLikes PostLikes[]
}
```

## Entity Details

### PostLikes
- **userId**: Foreign key to the User who liked.
- **postId**: Foreign key to the Post.
- **Unique Constraint**: `[userId, postId]` ensures a user can only like a post once.

## State Transitions

| Current State | Action | New State |
|---------------|--------|-----------|
| None          | LIKE   | PostLikes Created |
| LIKED         | LIKE   | PostLikes Deleted (Toggle Off) |
