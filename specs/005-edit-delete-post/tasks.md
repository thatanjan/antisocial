# Tasks: Edit and Delete Post

**Input**: Design documents from `/specs/005-edit-delete-post/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Testing code NOT required unless explicitly requested (none requested).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Add required Shadcn components (DropdownMenu, AlertDialog, Dialog) using `npx shadcn@latest add dropdown-menu alert-dialog dialog`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Update `updatePostSchema` in `src/features/create-post/schemas/index.ts` to validate post updates
- [ ] T003 Create optimistic update or result types in `src/features/create-post/types/index.ts` if needed for server actions

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Edit Post Text (Priority: P1) 🎯 MVP

**Goal**: Allow post owners to edit the text content of their posts.

**Independent Test**: Login as author, click 3-dots, select Edit, change text, save. Verify text updates and image remains.

### Implementation for User Story 1

- [ ] T004 [P] [US1] Create `EditPostDialog` component with small image preview and textarea in `src/features/create-post/components/EditPostDialog.tsx`
- [ ] T005 [P] [US1] Implement `updatePostAction` in `src/features/create-post/actions/index.ts` with owner verification
- [ ] T006 [P] [US1] Create `PostActions` dropdown component in `src/features/create-post/components/PostActions.tsx` (initially with Edit option)
- [ ] T007 [US1] Integrate `PostActions` into `PostCard.tsx` and ensure it only renders for the post owner in `src/features/create-post/components/PostCard.tsx`

**Checkpoint**: User Story 1 (Edit) should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Delete Post (Priority: P1)

**Goal**: Allow post owners to delete their posts, including purging associated images.

**Independent Test**: Login as author, click 3-dots, select Delete, confirm in modal. Verify post is removed from feed and image is deleted from ImageKit.

### Implementation for User Story 2

- [ ] T008 [P] [US2] Create `DeletePostDialog` component with confirmation modal in `src/features/create-post/components/DeletePostDialog.tsx`
- [ ] T009 [P] [US2] Implement `deletePostAction` in `src/features/create-post/actions/index.ts` (must handle Postgres and ImageKit deletion)
- [ ] T010 [US2] Add Delete option to `PostActions.tsx` and integrate `DeletePostDialog` in `src/features/create-post/components/PostActions.tsx`

**Checkpoint**: User Story 2 (Delete) should be functional and testable independently.

---

## Phase 5: User Story 3 - Owner-only Actions (Priority: P2)

**Goal**: Ensure actions are strictly restricted to post owners in both UI and Server Actions.

**Independent Test**: Login as User A, view User B's post, verify no 3-dots icon is visible. Try to hit server actions directly and verify failure.

### Implementation for User Story 3

- [ ] T011 [US3] Refine owner-check logic in `PostCard.tsx` and `updatePostAction`/`deletePostAction` for robust security in `src/features/create-post/actions/index.ts`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T012 [P] Add success/error toast notifications for edit and delete actions in `src/features/create-post/components/PostActions.tsx`
- [ ] T013 [P] Ensure responsive design for dialogs and thumbnails on mobile in `src/features/create-post/components/EditPostDialog.tsx`
- [ ] T014 Run `quickstart.md` validation and perform final cleanup

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Stories (Phase 3+)**: All depend on Foundational phase completion. US1 and US2 can be done in parallel once `PostActions` structure is set.
- **Polish (Final Phase)**: Depends on all user stories being complete.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test Edit functionality independently.

### Incremental Delivery

1. Foundation ready.
2. Add Edit functionality (US1) → MVP.
3. Add Delete functionality (US2) → Full core feature.
4. Final security and polish.
