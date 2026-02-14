# Data Model: Edit and Delete Post

## Entities

### Post (Updated)
Represented by the Prisma `Post` model.
- `content`: `String` (nullable) - Can be updated.
- `updatedAt`: `DateTime` - Automatically updated on save.

### PostImage (No Change)
Represented by the Prisma `PostImage` model.
- `url`: `String`
- `fileId`: `String` (Used for ImageKit deletion)
- `orderIndex`: `Int`

## Validation Rules (Zod)

### UpdatePostSchema
- `postId`: `String` (UUID, required)
- `content`: `String` (optional, max 2000 chars)

## State Transitions
- **Published** → **Updated**: When `updatePostAction` succeeds.
- **Published** → **Deleted**: When `deletePostAction` succeeds and data is removed from Postgres + ImageKit.
