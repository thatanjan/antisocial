# Tasks: User Follow System

**Input**: Design documents from `specs/008-user-follow/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md
**Tests**: Not required (per project guidelines)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create feature directory structure and verify existing dependencies

- [x] T001 [P] Create feature directory structure `src/features/follow/` with subdirectories: actions/, components/, hooks/, types/, utils/
- [x] T002 [P] Create TypeScript type definitions for Follow entity in `src/features/follow/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema and core infrastructure that MUST be complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Add Follow model to Prisma schema in `prisma/schema.prisma` with: id, followerId, followeeId, createdAt, unique constraint on (followerId, followeeId), indexes on (followerId, createdAt) and (followeeId, createdAt)
- [x] T004 Add followerCount and followingCount fields to User model in `prisma/schema.prisma`
- [x] T005 Created migration `20260321153852_add_follow_system` via `npx prisma migrate dev` with Follow model and indexes (partitioning via raw SQL can be added separately if needed)
- [x] T006 Run `npx prisma generate` to update Prisma client with new schema
- [x] T007 Create follow-related Zod validation schemas in `src/features/follow/types/index.ts` for follow-user and unfollow-user actions
- [x] T008 Create shared utilities for follow operations in `src/features/follow/utils/index.ts`

---

## Phase 3: User Story 1 & 2 & 3 - Core Follow Functionality (Priority: P1) 🎯 MVP

**Goal**: Enable users to follow each other with self-follow prevention and duplicate prevention

**Independent Test**: User A clicks "Follow" on User B's profile → follow relationship created. User A cannot follow themselves. User A cannot follow User B twice.

### Implementation

- [x] T009 [P] [US1-US3] Create `follow-actions.ts` server actions in `src/features/follow/actions/follow-actions.ts` with: `followUser` (session validation, self-follow check, duplicate check, Prisma create, count updates), `unfollowUser` (session validation, Prisma delete, count decrements), `checkFollowStatus` (check if current user follows target user)
- [x] T010 (combined into T009)
- [x] T011 (combined into T009)
- [ ] T012 [US1-US3] Create `follow-button.tsx` component in `src/features/follow/components/follow-button.tsx` with: client component ("use client"), calls follow/unfollow actions, displays "Follow" or "Following" state based on status, shows error toast on failure

---

## Phase 4: User Story 4 - Viewing Followers and Following (Priority: P2)

**Goal**: Allow users to view lists of their followers and users they follow

**Independent Test**: User views their followers list → sees list of users. User views their following list → sees list of users.

### Implementation

- [x] T013 [P] [US4] Create `get-followers.ts` server action in `src/features/follow/actions/get-followers.ts` with: pagination support, returns list of users following the target user with createdAt
- [x] T014 [P] [US4] Create `get-following.ts` server action in `src/features/follow/actions/get-following.ts` with: pagination support, returns list of users the target user follows with createdAt
- [ ] T015 [US4] Create `followers-list.tsx` component in `src/features/follow/components/followers-list.tsx` with: server component, calls get-followers action, displays user list with avatar and name
- [ ] T016 [US4] Create `following-list.tsx` component in `src/features/follow/components/following-list.tsx` with: server component, calls get-following action, displays user list with avatar and name

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T017 Create profile page route at `src/app/profile/[id]/page.tsx` that displays user profile image, name, and follow/unfollow button (uses follow-button component from Phase 3)
- [ ] T018 [P] Update profile page to display followerCount and followingCount from User model
- [ ] T019 [P] Add loading states and error handling to all follow-related components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-4)**: All depend on Foundational phase completion
- **Polish (Phase 5)**: Depends on all user stories being complete

### User Story Dependencies

- **US1, US2, US3 (P1)**: Can start after Foundational - all share the same follow/unfollow actions but have different validation logic
- **US4 (P2)**: Can start after Foundational - depends on follow/unfollow actions working correctly

### Within Each User Story

- Prisma schema before server actions
- Server actions before UI components
- Core implementation before integration

### Parallel Opportunities

- T001, T002 can run in parallel
- T003, T004 can run in parallel (both schema changes)
- T009, T010, T011 can run in parallel (server actions, different files)
- T013, T014 can run in parallel (data fetching actions)
- T015, T016 can run in parallel (list components)

---

## Implementation Strategy

### MVP First (User Story 1, 2, 3 - Core Follow)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Stories 1, 2, 3
4. **STOP and VALIDATE**: Test core follow functionality independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add Phase 3 (US1-US3) → Test core follow → Deploy/Demo (MVP!)
3. Add Phase 4 (US4) → Test follower/following lists → Deploy/Demo
4. Add Phase 5 (Polish) → Final improvements

---

## Summary

| Metric                 | Count |
| ---------------------- | ----- |
| Total Tasks            | 19    |
| Phase 1 (Setup)        | 2     |
| Phase 2 (Foundational) | 6     |
| Phase 3 (US1-US3)      | 4     |
| Phase 4 (US4)          | 4     |
| Phase 5 (Polish)       | 3     |
| Parallelizable Tasks   | 12    |

### MVP Scope

**Phase 1 + Phase 2 + Phase 3** = Core follow functionality with self-follow prevention and duplicate prevention.

### Files to Create/Modify

```
prisma/schema.prisma                              [MODIFY]
src/features/follow/
├── actions/
│   ├── follow-user.ts                           [CREATE]
│   ├── unfollow-user.ts                         [CREATE]
│   ├── check-follow-status.ts                   [CREATE]
│   ├── get-followers.ts                         [CREATE]
│   └── get-following.ts                         [CREATE]
├── components/
│   ├── follow-button.tsx                        [CREATE]
│   ├── followers-list.tsx                      [CREATE]
│   └── following-list.tsx                      [CREATE]
├── types/
│   └── index.ts                                 [CREATE]
└── utils/
    └── index.ts                                 [CREATE]
```
