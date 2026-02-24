# Tasks: Like Post

**Input**: Design documents from `/specs/006-like-dislike-post/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT requested in the specification. Implementation will focus on functionality and manual verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create feature directory structure for `src/features/likes`
- [x] T002 [P] Create `src/features/likes/types/index.ts` for shared reaction types

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Update `prisma/schema.prisma` with the `PostLikes` model and relationships
- [x] T004 Run `npx prisma migrate dev --name add_likes` and `npx prisma generate`
- [x] T005 Implement `toggleLikeAction` in `src/features/likes/actions/toggle-like.ts` (include atomic `likeCount` update)

**Checkpoint**: Foundation ready - database models and server actions are in place.

---

## Phase 3: User Story 1 - Liking a Post (Priority: P1) 🎯 MVP

**Goal**: Implement the core "Like" toggle functionality with optimistic UI and a client-side post list.

**Independent Test**: Click the Heart icon on a post. It should fill instantly and the count should increment. Refreshing the page should persist the state.

### Implementation for User Story 1

- [ ] T006 [P] [US1] Create `LikeButton.tsx` in `src/features/likes/components/LikeButton.tsx` (Client Component)
- [ ] T007 [US1] Implement `useOptimistic` hook and Server Action call in `LikeButton.tsx`
- [ ] T008 [P] [US1] Create `PostList.tsx` in `src/features/create-post/components/PostList.tsx` (Client Component using `useState`)
- [ ] T009 [US1] Update `src/app/(authenticated)/feed/page.tsx` to pass server-fetched posts to the `PostList` component
- [ ] T010 [US1] Update `src/features/create-post/components/PostCard.tsx` to integrate the `LikeButton` component
- [ ] T011 [US1] Ensure post fetching logic includes initial `isLiked` status for the current user and accurately reflects the stored `likeCount`

**Checkpoint**: At this point, User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 - Error Handling and Revert (Priority: P2)

**Goal**: Ensure the UI reverts correctly and provides feedback when a Like action fails.

**Independent Test**: Simulate a server error (e.g., throw Error in `toggleLikeAction`). Clicking the Heart should briefly toggle and then revert to its original state, showing a toast notification.

### Implementation for User Story 2

- [ ] T012 [US2] Update `LikeButton.tsx` to handle Promise rejection from `toggleLikeAction`
- [ ] T013 [US2] Add toast notification on failure in `LikeButton.tsx` using `useToast` from Shadcn UI

**Checkpoint**: User Story 2 ensures UX reliability.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T014 Add TSDoc comments to all exports in `src/features/likes/`
- [ ] T015 Ensure `LikeButton` has appropriate `aria-label` for accessibility
- [ ] T016 Run validation per `quickstart.md` manual verification steps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on T001. Blocks all UI work.
- **User Story 1 (Phase 3)**: Depends on Phase 2.
- **User Story 2 (Phase 4)**: Depends on US1 (T007).
- **Polish (Final Phase)**: Depends on all user stories.

### Parallel Opportunities

- T002 (Types) can be done in parallel with T001 or T003.
- T006 (Component skeleton) can start as soon as types (T002) are defined, even if the Server Action isn't ready.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1).
3. **STOP and VALIDATE**: Verify the toggle works smoothly.

### Incremental Delivery

1. Setup + Foundation -> DB ready.
2. User Story 1 -> Happy path works (MVP).
3. User Story 2 -> Error states handled.
4. Polish -> Documentation and accessibility.
