# Implementation Plan: Post Comments and Replies

**Branch**: `007-post-comments` | **Date**: 2026-03-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-post-comments/spec.md`.

## Summary
Add support for top-level comments and one-layer replies to posts. Users can create, update, and delete their own comments, as well as toggle likes on any comment or reply. The system uses a denormalized approach, storing total totals (likes, comments, and replies) in the database for faster querying. The UI will provide "instant" feedback via `useOptimistic` for all major interactions. 

## Technical Context
- **Language/Version**: TypeScript (strict mode)
- **Framework**: Next.js (App Router, latest stable)
- **Primary Dependencies**: Shadcn UI (Button, Card, Textarea, Avatar), useOptimistic (React), React Hook Form, Zod, Better Auth
- **ORM**: Prisma
- **Storage**: PostgreSQL
- **Testing**: Not required
- **Performance Goals**: Instant feedback on comments (Optimistic UI), efficient counting (Denormalization).

## Constitution Check

- [x] Shadcn components used (custom auto-resizing textarea will be a simple adaptation of Shadcn's Textarea).
- [x] Server Components by default; "use client" for `CommentList`, `CommentItem`, `ReplyList`, and `LikeButton`.
- [x] Server Actions for all mutations (Add, Update, Delete, Toggle Like).
- [x] TSDoc comments on all exports.
- [x] Colors defined as CSS variables (standard project pattern).
- [x] KISS & DRY principles followed.
- [x] Feature-based file structure enforced (`src/features/post-comments`).

## Project Structure

### Documentation (this feature)
```text
specs/007-post-comments/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Research on auto-resizing and denormalization
├── data-model.md        # Prisma schema updates
├── quickstart.md        # Implementation checklist
├── contracts/
│   └── actions.md       # Server action signatures
└── checklists/          # Validation artifacts
```

### Source Code
```text
src/features/post-comments/
├── actions/             # comment-actions.ts, reply-actions.ts, like-actions.ts
├── components/          # CommentList, CommentItem, ReplyList, AutoResizeTextarea
├── hooks/               # useOptimisticComments, useOptimisticReplies
├── schemas/             # zod schemas for form validation
├── utils/               # denormalization helpers
└── types/               # comment types
```

## Implementation Phases

### Phase 1: Database and Boilerplate
- Update `prisma/schema.prisma` with four new tables: `post_comments`, `comment_replies`, `comment_likes`, `reply_likes`.
- Add `commentCount` to the `Post` table.
- Run `npx prisma generate` and `npx prisma db push`.
- Create the `src/features/post-comments` folder structure.

### Phase 2: Server Actions and Logic
- Implement `addCommentAction`, `updateCommentAction`, `deleteCommentAction`.
- Implement `toggleLikeAction` for comments and replies.
- Implement `addReplyAction`, `updateReplyAction`, `deleteReplyAction`.
- Ensure all count denormalization is consistent.

### Phase 3: UI Components and Optimistic Updates
- Create `AutoResizeTextarea` using a simple `scrollHeight` approach.
- Create `CommentInput` for submitting and managing edit/reply states.
- Implement `CommentList` with `useOptimistic` for top-level comments.
- Implement `ReplyList` with `useOptimistic` for nested replies.
- Use `useTransition` and `startTransition` to trigger optimistic states.

### Phase 4: Integration
- Add `CommentList` to the post details page.
- Update `PostCard` to display the total comment count.
- Implement the 5-item pagination with "Load More".

## Risk Assessment
- **Denormalization Drifts**: Avoid by using transactions.
- **Optimistic Sync**: Ensuring temporary IDs for new comments don't conflict with database IDs once synced (replace temp ID with real ID in state).
- **Infinite Loops**: Careful with `useEffect` or `useOptimistic` dependencies in the list.
