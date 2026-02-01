# Tasks: Create Post

**Input**: Design documents from `/specs/004-create-post/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install core dependencies: `imagekit-javascript`, `@imagekit/next`, `imagekit`, `browser-image-compression`
- [x] T002 Add Shadcn UI components: `dialog`, `carousel`, `card`, `scroll-area`, `avatar`, `input`, `button`, `textarea`, `label`
- [x] T003 [P] Configure ImageKit environment variables in `.env`
- [x] T004 Build feature directory structure in `src/features/create-post/` (components, actions, hooks, utils, types)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and database setup

- [x] T005 [P] Define `Post` and `PostImage` models in `prisma/schema.prisma`
- [x] T006 Generate Prisma client: `npx prisma generate`
- [x] T007 [P] Create ImageKit authorization route in `src/app/api/upload-auth/route.ts`
- [x] T008 [P] Define TypeScript types/schemas in `src/features/create-post/types/index.ts`
- [x] T009 [P] Create Zod validation schema for post creation in `src/features/create-post/schemas.ts`

**Checkpoint**: Foundation ready - UI and logic implementation can begin

---

## Phase 3: User Story 1 - Base Post Creation (Priority: P1) 🎯 MVP

**Goal**: Users can open a modal and create a text-only post with redirection.

**Independent Test**: Open modal, enter text < 1000 chars, click "Create", verify server record, and verify redirect to `/post/[id]`.

- [x] T010 [US1] Create the base `PostCreationModal` component in `src/features/create-post/components/PostCreationModal.tsx`
- [x] T011 [US1] Implement "Create Post" trigger button in `src/app/(authenticated)/feed/page.tsx`
- [x] T012 [US1] Add text description input with character counter (max 1000) to `PostCreationModal.tsx`
- [x] T013 [US1] Implement `createPostAction` in `src/features/create-post/actions/index.ts` (handling text only initially)
- [x] T014 [US1] Integrate `createPostAction` with the form in `PostCreationModal.tsx` using `useTransition`
- [x] T015 [US1] Implement redirection to `/post/[id]` on success in `PostCreationModal.tsx`
- [x] T016 [US1] Create the post detail page in `src/app/(authenticated)/post/[id]/page.tsx` (basic layout)

**Checkpoint**: Text-only posting is functional.

---

## Phase 4: User Story 2 - Image Upload & Optimization (Priority: P1)

**Goal**: Users can upload up to 10 optimized images with aspect ratio selection.

**Independent Test**: Select 10+ images (fail), select 1 image, choose 1:1 ratio, verify ImageKit upload success and browser-side file size reduction.

- [ ] T017 [P] [US2] Implement image compression utility in `src/features/create-post/utils/image-compression.ts` using `browser-image-compression`
- [ ] T018 [US2] Build `ImageUploader` component in `src/features/create-post/components/ImageUploader.tsx`
- [ ] T019 [US2] Implement multi-image selection logic (limit 10) in `ImageUploader.tsx`
- [ ] T020 [US2] Create aspect ratio selector (16:9, 1:1, 4:5) in `ImageUploader.tsx`
- [ ] T021 [US2] Implement direct upload to ImageKit via `@imagekit/next` in `ImageUploader.tsx`
- [ ] T022 [US2] Add upload progress indicator for each image in `ImageUploader.tsx`
- [ ] T023 [US2] Integrate `ImageUploader` into `PostCreationModal.tsx`
- [ ] T024 [US2] Update `createPostAction` in `src/features/create-post/actions/index.ts` to handle `PostImage` relations

**Checkpoint**: Multi-image posting with optimization is functional.

---

## Phase 5: User Story 3 - Post Display (Priority: P1)

**Goal**: Posts are displayed in the feed with carousels and collapsible text.

**Independent Test**: View a post with 3 images; swipe through carousel. View a long description; click "See more" to expand.

- [ ] T025 [P] [US3] Build `CarouselDisplay` component using Shadcn Carousel in `src/features/create-post/components/CarouselDisplay.tsx`
- [ ] T026 [P] [US3] Build `CollapsibleDescription` component with 2-line limit in `src/features/create-post/components/CollapsibleDescription.tsx`
- [ ] T027 [US3] Create `PostCard` component in `src/features/create-post/components/PostCard.tsx` combining display items
- [ ] T028 [US3] Update feed page `src/app/(dashboard)/feed/page.tsx` to fetch and display posts using `PostCard`
- [ ] T029 [US3] Implement the same `PostCard` usage in `src/app/post/[id]/page.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Loading states, error handling, and final refinements.

- [ ] T030 Add loading overlay to `PostCreationModal.tsx` during submission
- [ ] T031 Implement error snackbar notification on failed submission in `PostCreationModal.tsx`
- [ ] T032 [P] Add TSDoc comments to all new functions and components
- [ ] T033 [P] Final CSS cleanup for mobile responsiveness in all new components

---

## Dependencies & Execution Order

1. **Phase 1 & 2** are strict prerequisites.
2. **Phase 3 (US1)** provides the container for everything else.
3. **Phase 4 (US2)** can be worked on after Phase 3 is started.
4. **Phase 5 (US3)** can be worked on in parallel with Phase 4.
5. **Phase 6** happens after all stories are essentially complete.

## Parallel Opportunities

- T017 (Utility) can be written while T010-T012 (Modal UI) are being built.
- T025 & T026 (Display components) can be built independently of the creation logic.
- T032 & T033 can be done alongside any other task.

## Implementation Strategy

### MVP First (User Story 1)
1. Complete Setup + Foundations.
2. Implement basic Modal + Text Action + Redirect.
3. Now you have a working "Post" feature (text only).

### Incremental
1. Add Image Upload (US2) to the existing Modal.
2. Add Feed Rendering (US3) to show the new content.
