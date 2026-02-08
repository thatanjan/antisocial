# Data Model: Create Post

## Entities

### Post
Represents a user-created post in the social feed.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary Key |
| authorId | String | Foreign Key to User |
| content | String? | Markdown/Text content (max 1000 chars) |
| aspectRatio | String? | Selected aspect ratio for the post (1:1, 16:9, 4:5) |
| createdAt | DateTime | Timestamp of creation |
| updatedAt | DateTime | Timestamp of last update |

**Relationships**:
- Belongs to **User**.
- Has many **PostImage**.

### PostImage
Represents an image attached to a post.

| Field | Type | Description |
|-------|------|-------------|
| id | String (UUID) | Primary Key |
| postId | String | Foreign Key to Post |
| url | String | The delivery URL from ImageKit |
| fileId | String | ImageKit unique file ID (for management/deletion) |
| orderIndex | Integer | Sorting order for the carousel |

**Relationships**:
- Belongs to **Post**.

## Validation Rules (Zod)

- `content`: max 1000 characters.
- `images`: max 10 items.
- `aspectRatio`: must be one of `['1:1', '16:9', '4:5']`.

## Proposed Prisma Schema Additions

```prisma
model Post {
  id          String      @id @default(cuid())
  authorId    String
  author      User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
  content     String?     @db.Text
  aspectRatio String?
  images      PostImage[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("post")
  @@index([authorId])
}

model PostImage {
  id         String @id @default(cuid())
  postId     String
  post       Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  url        String
  fileId     String
  orderIndex Int

  @@map("post_image")
  @@index([postId])
}
```

*Note: User model will need `posts Post[]` relation.*
