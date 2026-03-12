# Tasks: Post Comments and Replies

**Input**: Design documents from `/specs/007-post-comments/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Includes exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan in `src/features/post-comments/`
- [x] T002 [P] Define TypeScript interfaces for comments, replies, and likes in `src/features/post-comments/types/index.ts`
- [x] T003 [P] Define Zod schemas for comment and reply validation in `src/features/post-comments/schemas/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and database schema that MUST be complete before ANY user story can be implemented

- [x] T004 Add `commentCount` to `Post` model and create `PostComment`, `CommentReply`, `CommentLike`, `ReplyLike` models in `prisma/schema.prisma`
- [x] T005 [P] Run `npx prisma generate` to update the Prisma Client
- [x] T006 Implement denormalization helper functions for count updates in `src/features/post-comments/utils/counts.ts`

---

## Phase 3: User Story 1 - Core Commenting (Priority: P1) 🎯 MVP

**Goal**: Allow users to add comments to a post and see the total count on the post card.

**Independent Test**: Add a comment on the post detail page and verify the comment count updates on the post card in the feed.

### Implementation for User Story 1

- [x] T007 [US1] Implement `getCommentsAction` to fetch top-level comments for a post in `src/features/post-comments/actions/comments.ts`
- [x] T008 [US1] Implement `addCommentAction` with `Post.commentCount` increment in `src/features/post-comments/actions/comments.ts`
- [x] T009 [US1] Create `CommentInput` component using `src/components/ui/auto-resize-textarea.tsx` in `src/features/post-comments/components/CommentInput.tsx`
- [x] T010 [US1] Create `CommentItem` skeleton to display basic comment info in `src/features/post-comments/components/CommentItem.tsx`
- [x] T011 [US1] Create `CommentList` component that displays comments and the `CommentInput` in `src/features/post-comments/components/CommentList.tsx`
- [x] T012 [US1] Integrate `CommentList` into the post detail page in `src/app/post/[postId]/page.tsx`
- [x] T013 [US1] Update `PostCard` to display `commentCount` from the database in `src/features/create-post/components/PostCard.tsx`
- [x] T014 [US1] Wrap `MessageCircle` icon in `PostCard` with a Link to the post details page in `src/features/create-post/components/PostCard.tsx`

**Checkpoint**: Core commenting is functional. Users can post comments and see accurate counts.

---

## Phase 4: User Story 2 - Comment Management (Priority: P1)

**Goal**: Allow authors to edit and delete their own comments.

**Independent Test**: Log in as a comment author, edit a comment text, then delete it and verify it's gone and the post's total count decrements.

### Implementation for User Story 2

- [x] T015 [US2] Implement `updateCommentAction` in `src/features/post-comments/actions/comments.ts`
- [x] T016 [US2] Implement `deleteCommentAction` with cascade logic and `Post.commentCount` decrement in `src/features/post-comments/actions/comments.ts`
- [x] T017 [US2] Add edit/delete dropdown menu to `CommentItem` (conditional on ownership) in `src/features/post-comments/components/CommentItem.tsx`
- [x] T018 [US2] Implement optimistic updates for adding, editing, and deleting comments in `src/features/post-comments/components/CommentList.tsx` using `useOptimistic`

**Checkpoint**: Users have full control over their own comments with instant UI feedback.

---

## Phase 5: User Story 3 - Comment Interaction (Priority: P2)

**Goal**: Allow users to like comments/replies and add one-level deep replies.

**Independent Test**: Like a comment and verify count; reply to a comment and verify it appears nested; check that replies cannot be replied to.

### Implementation for User Story 3

- [x] T019 [P] [US3] Implement `toggleCommentLikeAction` in `src/features/post-comments/actions/likes.ts`
- [x] T020 [P] [US3] Implement `toggleReplyLikeAction` in `src/features/post-comments/actions/likes.ts`
- [x] T021 [US3] Implement `addReplyAction`, `updateReplyAction`, and `deleteReplyAction` in `src/features/post-comments/actions/replies.ts`
- [x] T022 [US3] Create `CommentLikeButton` component with optimistic UI for both comments and replies in `src/features/post-comments/components/CommentLikeButton.tsx`
- [x] T023 [US3] Create `ReplyList` component that displays nested replies and a reply form in `src/features/post-comments/components/ReplyList.tsx`
- [x] T024 [US3] Integrate `CommentLikeButton` and `ReplyList` into `CommentItem.tsx`
- [x] T025 [US3] Ensure `CommentInput` or similar is used for replies but restricted to one level deep.
- [x] T026 [US3] Implement optimistic updates for replies in `src/features/post-comments/components/ReplyList.tsx`

**Checkpoint**: Discussion threads and likes are fully functional.

---

## Phase 6: User Story 4 - Pagination (Priority: P3)

**Goal**: Display only 5 comments/replies at a time with a "Load More" button.

**Independent Test**: Find a post with 6+ comments, verify only 5 show initially, click "Load More" to see the 6th. Repeat for replies.

### Implementation for User Story 4

- [x] T027 [US4] Update `getCommentsAction` and `getRepliesAction` to support limit/offset pagination in `src/features/post-comments/actions/`
- [x] T028 [US4] Add "Load More" button logic to `CommentList.tsx` to fetch and append the next 5 comments.
- [x] T029 [US4] Add "Load More" button logic to `ReplyList.tsx` to fetch and append the next 5 replies.

---

## Phase 7: Polish & Cross-Cutting Concerns

- [x] T030 Add loading skeletons for comment and reply lists in `src/features/post-comments/components/`
- [x] T031 Ensure all error cases show user-friendly toasts using `sonner`
- [x] T032 Add TSDoc comments to all new functions and components per Constitution I.
- [x] T033 Verify all colors use standard Tailwind variables from `globals.css` per Constitution III.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Foundational (Phases 1-2)**: MUST be completed first.
- **US1 (Phase 3)**: Core functionality, prerequisite for US2, US3, and US4.
- **US2, US3 (Phases 4-5)**: Can proceed after US1 basic skeleton is ready.
- **US4 (Phase 6)**: Optimization, can be done last.

### Parallel Opportunities

- T002 and T003 (Types and Schemas) can be done in parallel.
- T019 and T020 (Like actions for comments vs replies) can be done in parallel.
- T030-T033 (Polish tasks) can be distributed.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Complete US1 (Core Commenting).
3. **STOP and VALIDATE**: Verify users can add comments and counts update.

### Incremental Delivery

1. Add US2 (Management) -> authors can now correct mistakes.
2. Add US3 (Interactions) -> users can now engage more deeply.
3. Add US4 (Pagination) -> system now scales to many comments.
