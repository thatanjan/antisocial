---

description: "Task list for Guest Mode feature implementation"
---

# Tasks: Guest Mode for Anonymous Users

**Input**: Design documents from `/specs/010-guest-mode/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Not requested - skipped per spec

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `src/app/` for pages and layouts
- **Global components**: `src/components/` (Shadcn + approved custom)
- **Feature code**: `src/features/[feature-name]/` with subdirectories for components, hooks, utils, types, actions
- **Library integrations**: `src/lib/` (prisma, auth, etc.)
- **Prisma**: `prisma/schema.prisma`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Configure Better Auth anonymous plugin

- [X] T001 Add anonymous plugin to src/lib/auth.ts with emailDomainName option
- [X] T002 Add anonymousClient plugin to src/lib/authClient.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema changes required for all user stories

- [ ] T003 Add isAnonymous field to User model in prisma/schema.prisma
- [ ] T004 Run Prisma migration to update database schema

---

## Phase 3: User Story 1 - Enter App as Guest (Priority: P1) 🎯 MVP

**Goal**: User can click "Continue as Guest" on login page and access the app with a temporary session

**Independent Test**: Visit login page, click "Continue as Guest", verify user lands on feed with guest session

### Implementation for User Story 1

- [ ] T005 Create GuestButton component in src/features/guest-mode/components/GuestButton.tsx
- [ ] T006 Create GuestConfirmationModal component in src/features/guest-mode/components/GuestConfirmationModal.tsx
- [ ] T007 [P] Add "Continue as Guest" button to src/app/(auth)/login/page.tsx
- [ ] T008 Implement guest sign-in flow in GuestButton using authClient.signIn.anonymous()
- [ ] T009 [US1] Update ProfileSummary to display "Guest" for anonymous users in src/features/navigation/components/ProfileSummary.tsx

**Checkpoint**: User Story 1 fully functional - guest can enter and see "Guest" display name

---

## Phase 4: User Story 2 - Browse Content as Guest (Priority: P1)

**Goal**: Guest can view posts, comments, and user profiles (read-only)

**Independent Test**: Enter guest mode, visit feed, verify all content is visible

### Implementation for User Story 2

- [ ] T010 [P] [US2] Verify feed page works for anonymous users in src/app/(authenticated)/feed/page.tsx
- [ ] T011 [P] [US2] Verify post details page accessible to guests in src/app/(authenticated)/post/[id]/page.tsx
- [ ] T012 [P] [US2] Verify user profile page accessible to guests

**Checkpoint**: Guest can browse all read-only content

---

## Phase 5: User Story 3 - Convert to Registered User (Priority: P2)

**Goal**: Guest can sign up with Google and convert their session to a permanent account

**Independent Test**: Enter guest mode, click Google sign-in, verify account is created and guest is removed

### Implementation for User Story 3

- [ ] T013 [US3] Configure onLinkAccount callback in src/lib/auth.ts for account migration
- [ ] T014 [US3] Test guest-to-registered conversion via Google OAuth

**Checkpoint**: Guest can convert to permanent account seamlessly

---

## Phase 6: User Story 4 - Sign Out from Guest Mode (Priority: P2)

**Goal**: Guest can exit guest mode and return to login page

**Independent Test**: Enter guest mode, click "Exit Guest Mode", verify redirect to login

### Implementation for User Story 4

- [ ] T015 [US4] Add "Exit Guest Mode" option in profile menu
- [ ] T016 [US4] Implement exit guest mode using authClient.deleteAnonymousUser()
- [ ] T017 [US4] Add exit button to ProfileSummary component

**Checkpoint**: Guest can exit and return to login page

---

## Phase 7: User Story 5 - Restricted Actions for Guests (Priority: P1)

**Goal**: Guests see registration prompts when attempting restricted actions (create post, like, comment, follow)

**Independent Test**: Try each restricted action as guest, verify registration prompt appears

### Implementation for User Story 5

- [ ] T018 [P] [US5] Add guest check to create post component in src/features/create-post/components/CreatePost.tsx
- [ ] T019 [P] [US5] Add guest check to like button in src/features/likes/components/ToggleLike.tsx
- [ ] T020 [P] [US5] Add guest check to comment component in src/features/post-comments/components/CommentForm.tsx
- [ ] T021 [P] [US5] Add guest check to follow button in src/features/follow/components/FollowButton.tsx

**Checkpoint**: All restricted actions show registration prompts for guests

---

## Phase 8: Polish & Cross-Cutting Concerns

- [ ] T022 Run lint and typecheck to verify code quality
- [ ] T023 Verify all user stories work together in integration

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel where marked [P]
  - Or sequentially in priority order (P1 → P2)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories (MVP)
- **User Story 2 (P1)**: Can start after Foundational - Works with US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational - Uses US1 session for conversion
- **User Story 4 (P2)**: Can start after Foundational - Uses US1 session for exit
- **User Story 5 (P1)**: Can start after Foundational - Works with all stories

### Within Each User Story

- Components before integration
- UI updates after auth setup
- Story complete before moving to next priority

### Parallel Opportunities

- T001, T002 can run in parallel (Setup)
- T003, T004 can run in parallel (Foundational)
- T010, T011, T012 can run in parallel (US2)
- T018, T019, T020, T021 can run in parallel (US5)

---

## Parallel Example: User Story 1 (MVP)

```bash
# These can run in parallel within US1:
Task: "Create GuestButton component in src/features/guest-mode/components/GuestButton.tsx"
Task: "Create GuestConfirmationModal component in src/features/guest-mode/components/GuestConfirmationModal.tsx"

# After T005, T006 complete:
Task: "Add 'Continue as Guest' button to src/app/(auth)/login/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: Foundational (T003, T004)
3. Complete Phase 3: User Story 1 (T005-T009)
4. **STOP and VALIDATE**: Test guest entry works
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3-4 → Test → Deploy/Demo
5. Add User Story 5 → Test → Deploy/Demo
6. Polish → Final deployment

---

## Summary

- **Total Task Count**: 23
- **Task Count by User Story**:
  - US1: 5 tasks (MVP)
  - US2: 3 tasks
  - US3: 2 tasks
  - US4: 3 tasks
  - US5: 4 tasks
  - Polish: 2 tasks
- **Parallel Opportunities**: 4 task groups identified
- **MVP Scope**: User Story 1 (Enter App as Guest) - 5 tasks

All tasks follow the checklist format with ID, optional [P] marker, optional [Story] label, and exact file paths.