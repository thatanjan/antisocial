---

description: "Task list for news feed final customization"
---

# Tasks: News Feed Final Customization

**Input**: Design documents from `/specs/012-news-feed-customization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not applicable — no test framework configured per project conventions.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Paths shown assume Next.js App Router single project structure

## Phase 1: Foundational (Blocking Prerequisites)

**Purpose**: Type definition changes required by User Story 3

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Add `disabled?: boolean` field to `NavItem` interface in `src/features/navigation/types/index.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 2: User Story 1 - Sidebars Stay Fixed While Scrolling Feed (Priority: P1) 🎯 MVP

**Goal**: Left and right sidebars remain fixed on screen while the main feed content scrolls independently.

**Independent Test**: Load the news feed, scroll down the main content area by at least 3 viewport heights, and verify both sidebars remain visible and unmoved from their original screen positions.

### Implementation for User Story 1

- [X] T004 [P] [US1] Update LeftSidebar: replace `sticky top-0` with `fixed top-0 left-0`, remove ScrollArea wrapper and import in `src/features/navigation/components/LeftSidebar.tsx`
- [X] T005 [US1] Update RightSidebar: replace `sticky top-0` with `fixed top-0 right-0`, remove ScrollArea wrapper and import in `src/features/navigation/components/RightSidebar.tsx`
- [X] T006 [US1] Update layout: add left/right padding on `<main>` to compensate for fixed sidebars in `src/app/(authenticated)/layout.tsx`

**Checkpoint**: At this point, both sidebars should stay fixed while scrolling the feed content.

---

## Phase 3: User Story 2 - Remove Requests Section from Right Sidebar (Priority: P2)

**Goal**: The "Requests" heading and request items are removed from the right sidebar. Mobile nav requests section is also removed.

**Independent Test**: Load the news feed page and verify no "Requests" heading or request items appear in the right sidebar or mobile drawer.

### Implementation for User Story 2

- [ ] T007 [P] [US2] Remove the Social Requests `<section>` block (including heading, badge, request items, and View All button) and its imports from `src/features/navigation/components/RightSidebar.tsx`
- [ ] T008 [P] [US2] Remove the Requests section and its imports (`socialRequests`, `SocialRequestItem`) from `src/features/navigation/components/MobileNav.tsx`

**Checkpoint**: At this point, no "Requests" section appears anywhere in the UI.

---

## Phase 4: User Story 3 - Disable Placeholder Navigation Items (Priority: P2)

**Goal**: "Explore", "My Favorites", "Direct", and "Stats" nav items appear disabled with native "coming soon" title on hover. "Feed" and "Settings" remain functional.

**Independent Test**: Hover over each of the four disabled items and verify the "coming soon" title tooltip appears; click each disabled item and verify no navigation occurs; click Feed and Settings and verify they still navigate.

### Implementation for User Story 3

- [ ] T009 [P] [US3] Add `disabled: true` to Explore, My Favorites, Direct, Stats nav items in `src/features/navigation/utils/mock-data.ts`
- [ ] T010 [US3] Update NavLinkItem to check `item.disabled`: if disabled, render `<span>` with muted styling and native `title="coming soon"`; if not disabled, render existing `<Link>` in `src/features/navigation/components/NavLinkItem.tsx`

**Checkpoint**: At this point, disabled nav items show "coming soon" on hover and do not navigate.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification that all user stories work together

- [ ] T011 Run quickstart.md verification steps:
  1. Load feed page, scroll — both sidebars stay fixed
  2. Check right sidebar — no "Requests" section visible
   3. Hover each disabled nav item — "coming soon" title tooltip appears
   4. Click each disabled nav item — no navigation occurs
   5. Click Feed and Settings — they navigate normally
   6. Check mobile view — disabled items also show title tooltips, no requests section

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies — can start immediately
- **User Story 1 (Phase 2)**: Depends on Foundational phase completion — **MVP scope**
- **User Story 2 (Phase 3)**: Depends on Phase 2 completion (modifies same RightSidebar file)
- **User Story 3 (Phase 4)**: Depends on Foundational phase completion (needs NavItem disabled field)
- **Polish (Phase 5)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational — no dependencies on other stories
- **User Story 2 (P2)**: Cannot start until US1 is done (both modify RightSidebar.tsx — conflict)
- **User Story 3 (P2)**: Can start after Foundational — no file conflicts with US1 or US2

### Within Each User Story

- Simpler tasks first, build toward the full user story
- Each story is a complete, independently testable increment

### Parallel Opportunities

- **T004 ↔ T005**: Different sidebar files, no conflict
- **T007 ↔ T008**: RightSidebar vs MobileNav, different files
- **T009 ↔ T010**: Mock data vs component, different files
- US1 and US3 can run in parallel after Foundation (no file conflicts)
- US2 must wait for US1 (RightSidebar.tsx conflict)

---

## Parallel Example: User Story 1

```bash
# Launch both sidebar changes in parallel:
Task: "Update LeftSidebar fixed positioning + remove ScrollArea in src/features/navigation/components/LeftSidebar.tsx"
Task: "Update RightSidebar fixed positioning + remove ScrollArea in src/features/navigation/components/RightSidebar.tsx"
```

## Parallel Example: User Story 2

```bash
# Launch both removal tasks in parallel:
Task: "Remove requests section from RightSidebar in src/features/navigation/components/RightSidebar.tsx"
Task: "Remove requests section from MobileNav in src/features/navigation/components/MobileNav.tsx"
```

## Parallel Example: User Story 3

```bash
# Launch data and component changes in parallel:
Task: "Add disabled: true to mock data in src/features/navigation/utils/mock-data.ts"
Task: "Update NavLinkItem with disabled state and native title tooltip in src/features/navigation/components/NavLinkItem.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Foundational
2. Complete Phase 2: User Story 1 (fixed sidebars)
3. **STOP and VALIDATE**: Scroll feed — sidebars stay fixed
4. Deploy/demo if ready

### Incremental Delivery

1. Add Foundation → ready
2. Add User Story 1 → Test: scroll feed with fixed sidebars → Deploy/Demo (MVP!)
3. Add User Story 2 → Test: no requests section visible → Deploy/Demo
4. Add User Story 3 → Test: disabled items + title tooltips → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Foundation (Phase 1)
2. Once Foundational is done:
   - Developer A: User Story 1 (fixed sidebars)
   - Developer B: User Story 3 (disabled nav items)
   - Developer C: Wait for US1 to complete, then User Story 2 (remove requests)
3. Stories complete and integrate independently (US1 ↔ US3 no conflict)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests required per project conventions
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- T005 and T007 both modify RightSidebar.tsx — ensure T005 (positioning) is done before T007 (removal)
