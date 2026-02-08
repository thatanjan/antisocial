# API Contracts: Create Post

## Server Actions

### `createPostAction(data: CreatePostInput)`

**Description**: Persists a new post and its associated images.

**Input (`CreatePostInput`)**:
```typescript
interface CreatePostInput {
  content?: string; // Max 1000 chars
  aspectRatio: '1:1' | '16:9' | '4:5';
  images: {
    url: string;
    fileId: string;
    orderIndex: number;
  }[]; // Max 10 items
}
```

**Output**:
```typescript
type CreatePostResponse = 
  | { success: true; postId: string }
  | { success: false; error: string };
```

## API Routes (Internal Dependencies)

### `GET /api/upload-auth`

**Description**: Required by ImageKit SDK to authorize client-side uploads.

**Response**:
```json
{
  "token": "...",
  "expire": 12345678,
  "signature": "..."
}
```
