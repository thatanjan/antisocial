---
description: 'Task list for implementing user profile page feature'
---

# Tasks: User Profile Page

**Input**: Design documents from `/specs/009-user-profile-page/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Not requested in feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `src/app/` for pages and layouts
- **Feature code**: `src/features/user-profile/` with subdirectories for components, hooks, utils, types
- **Library integrations**: `src/lib/` (prisma, auth, etc.)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create feature directory structure

- [x] T001 Create feature directory structure at `src/features/user-profile/` with components, utils, and types subdirectories

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and utilities that all user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Create profile types in `src/features/user-profile/types/index.ts`
- [x] T003 [P] Create utility function `format-user-stats.ts` in `src/features/user-profile/utils/`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View Own Profile (Priority: P1) 🎯 MVP

**Goal**: Logged-in user can view their own profile page with profile information and posts

**Independent Test**: Navigate to `/profile/[your-username]` and verify all profile information and personal posts are displayed correctly

### Implementation for User Story 1

- [x] T004 [P] [US1] Create `ProfileHeader.tsx` component in `src/features/user-profile/components/`
- [x] T005 [P] [US1] Create `ProfileTabs.tsx` client component in `src/features/user-profile/components/`
- [x] T006 [US1] Create `ProfilePage.tsx` component in `src/features/user-profile/components/` (depends on T004, T005)
- [x] T007 [US1] Create profile route at `src/app/(authenticated)/profile/[userId]/page.tsx`
- [x] T008 [US1] Implement user data fetching in profile route using Prisma
- [x] T009 [US1] Display own profile with "Edit Profile" button (no Follow button)

**Checkpoint**: User can view their own profile with correct information and posts

---

## Phase 4: User Story 2 - View Another User's Profile (Priority: P1)

**Goal**: Logged-in user can view another user's profile with Follow/Unfollow button

**Independent Test**: Navigate to another user's profile and verify Follow/Unfollow button appears and functions correctly

### Implementation for User Story 2

- [x] T010 [US2] Add follow status check logic in profile route
- [ ] T011 [US2] Display "Follow" button when not following another user
- [ ] T012 [US2] Display "Unfollow" button when already following another user
- [ ] T013 [US2] Connect Follow/Unfollow button to existing follow actions from `src/features/follow/actions/`
- [ ] T014 [US2] Update follow button state after successful follow/unfollow action

**Checkpoint**: User can view other users' profiles and toggle follow status

---

## Phase 5: User Story 3 - Browse User's Posts (Priority: P2)

**Goal**: User can view a list of posts from a profile with pagination and empty state

**Independent Test**: View a user profile and verify posts load correctly with proper ordering and empty state when no posts exist

### Implementation for User Story 3

- [ ] T015 [P] [US3] Fetch user's posts in profile route with pagination support
- [ ] T016 [US3] Reuse existing `PostList` component from `src/features/create-post/components/PostList.tsx`
- [ ] T017 [US3] Display posts in reverse chronological order
- [ ] T018 [US3] Handle empty state when user has no posts
- [ ] T019 [US3] Implement "Load More" functionality for pagination

**Checkpoint**: Posts display correctly with proper ordering and empty state handling

---

## Phase 6: User Story 4 - Switch Profile Content Tabs (Priority: P3)

**Goal**: User can switch between different content tabs (Posts, Shorts, Tags, Activity)

**Independent Test**: Click on different tabs and verify content area updates accordingly

### Implementation for User Story 4

- [ ] T020 [US4] Implement tab state management in `ProfileTabs.tsx`
- [ ] T021 [US4] Display Posts tab content (existing posts list)
- [ ] T022 [US4] Add placeholder content for Shorts tab
- [ ] T023 [US4] Add placeholder content for Tags tab
- [ ] T024 [US4] Add placeholder content for Activity tab
- [ ] T025 [US4] Style active tab with appropriate visual indicator

**Checkpoint**: User can switch between tabs with correct content display

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T026 [P] Add cover image/gradient placeholder area to profile header
- [ ] T027 Handle non-existent profile error state (404)
- [ ] T028 Add TSDoc comments to all exported components and functions
- [ ] T029 Ensure responsive design for mobile, tablet, and desktop
- [ ] T030 Verify profile page integrates with existing navigation (click username anywhere)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 1 (P1): Core profile display - MUST complete first
  - User Story 2 (P1): Follow functionality - depends on US1 for header
  - User Story 3 (P2): Posts list - depends on US1 for page structure
  - User Story 4 (P3): Tab switching - depends on US1 for tabs component
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### Within Each User Story

- Components before routes
- Data fetching before UI rendering
- Core implementation before edge cases

### Parallel Opportunities

- T002 and T003 can run in parallel (different files)
- T004 and T005 can run in parallel (different files)
- T015 and T016 can run in parallel (different files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 - View Own Profile
4. **STOP and VALIDATE**: Test own profile view independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (View Own Profile) → Test → Deploy/Demo (MVP!)
3. Add User Story 2 (View Others' Profiles) → Test → Deploy/Demo
4. Add User Story 3 (Browse Posts) → Test → Deploy/Demo
5. Add User Story 4 (Tabs) → Test → Deploy/Demo
6. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable
- Reuses existing `PostList` component and `follow` actions (DRY principle)
- Layout.tsx is NOT modified - only middle column content changes
