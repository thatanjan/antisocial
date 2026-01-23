# Tasks: Google Auth Page

**Input**: Design documents from `/specs/002-google-auth-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 [P] Install `next-themes` and `lucide-react` dependencies
- [ ] T002 Create feature directory structure in `src/features/auth/`
- [ ] T003 [P] Add Google OAuth environment variables to `.env` per `quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Setup Better Auth server instance in `src/lib/auth.ts`
- [ ] T005 [P] Setup Better Auth API route in `src/app/api/auth/[...better-auth]/route.ts`
- [ ] T006 [P] Ensure Better Auth client is initialized in `src/lib/auth-client.ts`
- [ ] T007 Add Better Auth models to `prisma/schema.prisma` using `npx @better-auth/cli generate`
- [ ] T008 Run database migrations and generate Prisma client: `npx prisma generate && npx prisma db push`
- [ ] T009 [P] Create `src/components/theme-provider.tsx` using `next-themes`
- [ ] T010 Wrap application in `ThemeProvider` in `src/app/layout.tsx` (set dark as default)
- [ ] T011 [P] Configure global CSS variables for colors in `src/app/globals.css` per Constitution and Notebook theme

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Google Authentication (Priority: P1) 🎯 MVP

**Goal**: Implement the core Google login flow using Server Actions.

**Independent Test**: Navigate to `/login`, click "Continue with Google", and get redirected to the Google consent screen.

### Implementation for User Story 1

- [ ] T012 [US1] Create `signInWithGoogle` and `signOutAction` in `src/features/auth/actions/auth-actions.ts`
- [ ] T013 [P] [US1] Create the "antisocial" logo component in `src/features/auth/components/auth-logo.tsx` using "Architects Daughter" font
- [ ] T014 [P] [US1] Create the Google Login button component in `src/features/auth/components/google-button.tsx` calling the server action
- [ ] T015 [US1] Build the main login page in `src/app/(auth)/login/page.tsx` as a Server Component
- [ ] T016 [US1] Implement server-side session check on the login page to redirect already authenticated users

**Checkpoint**: User Story 1 is functional - Login flow is testable.

---

## Phase 4: User Story 2 - Theme Switching (Priority: P1)

**Goal**: Enable users to toggle between light and dark modes.

**Independent Test**: Click the theme toggle icon and verify colors switch instantly.

### Implementation for User Story 2

- [ ] T017 [US2] Create theme toggle component in `src/components/theme-toggle.tsx`
- [ ] T018 [US2] Add the theme toggle to the auth page (top right as per design)

---

## Phase 5: User Story 3 - Responsive Design (Priority: P1)

**Goal**: Ensure a beautiful mobile-first layout.

**Independent Test**: View `/login` on a 375px mobile device and verify text and button are properly scaled.

### Implementation for User Story 3

- [ ] T019 [US3] Apply responsive styling to the central card in `src/app/(auth)/login/page.tsx`
- [ ] T020 [US3] Implement the catchy footer text: "Escape the noise. Join the quiet." below the login card
- [ ] T021 [US3] Add a "TERMS OF SERVICE" link in the footer of `src/app/(auth)/login/page.tsx`

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T022 Handle OAuth failure by checking `error` query param and showing a Shadcn toast
- [ ] T023 Final accessibility audit for color contrast in both themes
- [ ] T024 Code cleanup and TSDoc documentation for all new exports

---

## Dependencies & Execution Order

- **Phase 1 & 2**: MUST be completed first.
- **Phase 3 (Google Auth)**: The core priority.
- **Phase 4 & 5 (Theme/Responsive)**: Can be worked on in parallel once the base page exists.

## Parallel Opportunities

- T001, T003 (Setup)
- T005, T006, T009, T011 (Foundational)
- T013, T014 (US1 UI components)
- US2 and US3 tasks can run in parallel after US1 page structure is ready.
