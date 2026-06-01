---

description: "Task list template for feature implementation"
---

# Tasks: News Feed

**Input**: Design documents from `/specs/011-news-feed/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install @upstash/redis dependency
- [x] T002 [P] Create Redis client singleton in src/lib/redis.ts
- [x] T003 [P] Create feed types in src/features/feed/types/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 [P] Create feed service core functions in src/features/feed/lib/feed-service.ts
- [x] T005 Implement getFeedFromCache function with sorted set operations
- [x] T006 Implement getFeedFromDb function with Prisma queries
- [x] T007 [P] Add cache fallback logic for Redis unavailable scenarios

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Followees' Posts (Priority: P1) 🎯 MVP

**Goal**: Display posts from followed users in reverse chronological order, with empty state handling

**Independent Test**: A user with at least one followee who has posted content sees those posts ordered newest to oldest. A user following no one sees an empty-state message.

### Implementation for User Story 1

- [x] T008 [P] [US1] Create getFeed server action in src/features/feed/actions/get-feed.ts
- [x] T009 [US1] Add cursor-based pagination logic to getFeed action
- [x] T010 [US1] Implement empty-state handling for no follows/no posts
- [x] T011 [P] [US1] Update feed page in src/app/(authenticated)/feed/page.tsx to use getFeed action
- [x] T012 [US1] Integrate PostList component for rendering feed posts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Paginate Through Feed Results (Priority: P2)

**Goal**: Allow users to load older posts through pagination without duplicates or gaps

**Independent Test**: A user whose followees have >20 posts can request next page and receives older posts in correct order. Last page shows "no more posts" indicator.

### Implementation for User Story 2

- [ ] T013 [P] [US2] Add cursor-based pagination to Redis sorted set queries
- [ ] T014 [US2] Add cursor-based pagination to database queries
- [ ] T015 [US2] Add hasMore boolean and nextCursor to feed response
- [ ] T016 [US2] Integrate pagination with PostList component

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Feed Resilience on Cache Failure (Priority: P3)

**Goal**: Graceful degradation when Redis is unavailable - feed still works from database

**Independent Test**: Simulate Redis unavailability and verify feed loads correctly from database.

### Implementation for User Story 3

- [ ] T017 [P] [US3] Wrap Redis operations in try-catch with database fallback
- [ ] T018 [US3] Add logging for cache failures without blocking user
- [ ] T019 [US3] Add post deletion handling - filter out non-existent posts on read

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T020 Create invalidate-feed cache server action in src/features/feed/actions/invalidate-feed.ts
- [ ] T021 [P] Modify src/features/create-post/actions/index.ts to add fan-out call after post creation
- [ ] T022 Modify src/features/follow/actions/follow-actions.ts to call invalidate-feed on follow/unfollow
- [ ] T023 [P] Add FeedList component wrapper in src/features/feed/components/FeedList.tsx
- [ ] T024 Run npm run lint and fix any issues

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story

- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch core implementation tasks together:
Task: "Create getFeed server action in src/features/feed/actions/get-feed.ts"
Task: "Update feed page in src/app/(authenticated)/feed/page.tsx to use getFeed action"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently

---

## Summary

- **Total tasks**: 24
- **Tasks per user story**: 
  - US1: 5 tasks (View Followees' Posts - MVP)
  - US2: 4 tasks (Pagination)
  - US3: 3 tasks (Cache Resilience)
- **Parallel opportunities**: 10 tasks marked [P]
- **Independent test criteria**: Each user story can be tested independently with defined acceptance scenarios
- **Suggested MVP scope**: User Story 1 only (Phase 3) - displays followees' posts in feed

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence