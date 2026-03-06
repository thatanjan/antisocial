# Research: Like Post

## Decisions & Rationale

### 1. Data Model: `PostLikes` Table
- **Decision**: Create a dedicated `PostLikes` model.
- **Rationale**: 
    - Since "Dislike" is explicitly omitted and defined as "removing a like", a dedicated `PostLikes` model is the most semantic and performant approach.
    - Unique index on `(userId, postId)` ensures one like per user per post.
- **Alternatives Considered**: 
    - Boolean field on Post: Not scalable for multi-user interactions.

### 2. Interaction: Server Actions + `useOptimistic`
- **Decision**: Use `toggleLikeAction` with `useOptimistic`.
- **Rationale**: 
    - Provides a premium, app-like feel where the heart icon fills instantly.
    - Revert logic handles network errors gracefully.

### 3. State Management & Performance
- **Decision**: Store `likeCount` directly on the `Post` model (denormalization).
- **Rationale**: User requested for performance. Fetching posts and their like counts becomes a single-table fast operation.
- **Consistency**: Use Prisma transactions to update `likeCount` whenever a `Like` record is created or deleted.

## Best Practices & Patterns

### Error Handling
- Use `useOptimistic` for state and a `toast` via `useActionState` or simple promise handling for error notifications if the background sync fails.

## Unresolved Items (NEEDS CLARIFICATION)
- *None.* The user clarified that "dislike" is simply the removal of a like.
