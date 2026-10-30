# Tasks: Chat UI (014-chat-ui)

**Input**: Design documents from `/specs/014-chat-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/chat-ui.md, quickstart.md

**Tests**: No test tasks. The feature specifies user-led manual UI testing only (see quickstart.md); no automated test suite is requested.

**Organization**: Tasks grouped by user story so each story is independently implementable, testable, and deliverable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Includes exact file paths in descriptions

## Path Conventions

This is a turborepo web app. Web source lives in `apps/web/src/`. Chat feature code in `apps/web/src/features/chat/`; routes in `apps/web/src/app/(chat)/`.

**Already complete (do not redo)**: The 16 UI components in `apps/web/src/features/chat/components/` (PascalCase: LeftIconRail, BottomTabBar, ChatsListHeader, SearchInput, FilterPills, RecentChatsStrip, ConversationListItem, ConversationsSidebar, MobileChatListScreen, ChatHeader, MessageStream, MessageBubble, DateSeparator, CallLogCard, MessageComposer, ChatScreen) and shared types in `apps/web/src/features/chat/types.ts` are implemented; typecheck and lint pass.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Route-group scaffold needed by all stories

- [x] T001 Add safe-area and dotted-canvas utilities (`pt-safe`, `pb-safe`, `chat-canvas`) to apps/web/src/app/globals.css `@layer utilities` if not already present
- [x] T002 [P] Verify chat feature components typecheck with `npm -w web run typecheck` and lint with `npx biome check apps/web/src/features/chat` as baseline before route work

**Checkpoint**: Feature components clean; ready to build routes.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Bundled sample data that all user stories consume

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create sample data module in apps/web/src/features/chat/data/sample-conversations.ts with typed exports matching `apps/web/src/features/chat/types.ts`: 5 conversations replicating the stitch-screen mocks (Mark, Emily Carter [unread thread with 7 messages + one call event], Clyde, AM Technology group [no avatar, initials tile], Design), sample contacts for the picker, and the sample current-user identity (avatarUrl + displayName) used by rail/tabs/header/composer
- [x] T004 Write TSDoc on sample module exports describing bundled-data reset-on-reload semantics per specs/014-chat-ui/data-model.md

**Checkpoint**: Stories 1-3 can all import one data source.

---

## Phase 3: User Story 1 - Browse and select a conversation (Priority: P1) 🎯 MVP

**Goal**: List renders from layout with search/filters; selecting a conversation navigates to `/chat/[id]` and shows its messages; back returns to `/chat`.

**Independent Test**: Open `/chat` (list left, empty right pane / full-screen list on mobile), filter and select Emily Carter, verify `/chat/[id]` shows her message history; Back returns to the list.

### Implementation for User Story 1

- [x] T005 [US1] Create server layout at apps/web/src/app/(chat)/layout.tsx: below md render MobileChatListScreen + BottomTabBar; at md+ render LeftIconRail + ConversationsSidebar; pass nav items with caller-supplied hrefs (Chats → /chat; others placeholder) and current-user sample identity from T003; right pane renders `children`
- [x] T006 [P] [US1] Create empty-right-pane page at apps/web/src/app/(chat)/page.tsx (desktop placeholder area; on narrow screens layout's MobileChatListScreen is the list view)
- [x] T007 [US1] Wire ConversationsSidebar + MobileChatListScreen list data in apps/web/src/app/(chat)/layout.tsx from sample-conversations.ts: search/filter state client-side via existing components; ConversationListItem links to `/chat/${id}` and highlights the active id from route param when on a conversation page
- [x] T008 [US1] Create server page at apps/web/src/app/(chat)/[id]/page.tsx that loads the conversation by `params.id` from sample data and renders ChatScreen (ChatHeader + MessageStream + MessageComposer) in the right pane; the layout's list stays visible beside it at desktop and is hidden on narrow screens per FR-002b; invalid id shows not-found message
- [x] T009 [US1] Render conversation messages in apps/web/src/features/chat/components/ChatScreen.tsx via MessageStream/MessageBubble/DateSeparator/CallLogCard variants from types.ts flags (deleted/starred/read/type:call); add peer/self avatar + composer wiring with caller-supplied callbacks per existing component props
- [x] T010 [US1] Add mobile Back control behavior in apps/web/src/features/chat/components/ChatHeader.tsx usage: Back on mobile navigates to /chat (matches stitch-screen mobile mocks)
- [x] T011 [US1] Manual verification per specs/014-chat-ui/quickstart.md steps 1-2: /chat list left + empty right at desktop; /chat/[id] shows selected chat beside list; layout-owned nav renders on both routes; mobile shows list full-screen then conversation-only with Back (user-led manual check, per tasking)

**Checkpoint**: US1 independently functional: browse, filter, select from URL routes.

---

## Phase 4: User Story 2 - Compose and send a local message (Priority: P1)

**Goal**: Typed non-empty text sends into the open conversation locally (composer cleared, preview updated); survives in-session conversation switches; disappears on reload.

**Independent Test**: On `/chat/[id]`, send "hello" — message appears as outgoing, composer clears; switch conversation and return and it remains; reload restores bundled sample data.

### Implementation for User Story 2

- [ ] T012 [US2] Add in-session message state at apps/web/src/app/(chat)/[id]/page.tsx (or client wrapper of ChatScreen): local useState keyed by conversation id; MessageComposer onSubmit trims, rejects whitespace-only, appends outgoing message, updates preview
- [ ] T013 [US2] Handle enter-to-send in MessageComposer usage (already supported by component): verify Enter submits and Shift+Enter does not per contract
- [ ] T014 [US2] Ensure switching to another conversation and back (via list) retains unsent-session messages from client state while session lives; reload resets to T003 sample data
- [ ] T015 [US2] Manual verification per specs/014-chat-ui/quickstart.md steps 4-5: send/update preview; empty/whitespace rejected; switch-and-return keeps message; reload resets

**Checkpoint**: US1 + US2 both work; local send flow complete.

---

## Phase 5: User Story 3 - Start a conversation from sample contacts (Priority: P2)

**Goal**: New-chat chooser offers sample contacts; picking one opens/creates a page-session conversation and navigates to it; cancel changes nothing.

**Independent Test**: Activate the ChatsListHeader plus action, pick a contact without a conversation, verify a new conversation opens in the list and routes; cancel leaves the list unchanged.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Create new-chat chooser client component in apps/web/src/features/chat/components/ using existing shadcn Dialog + sample contacts from the data module
- [ ] T017 [US3] Wire ChatsListHeader onNewChat in apps/web/src/app/(chat)/layout.tsx to open chooser; on select, reuse existing direct conversation by contact or append a new page-session conversation and navigate to its /chat/[id]
- [ ] T018 [US3] Manual verification per specs/014-chat-ui/quickstart.md step 6: picker opens, contact reuse dedupes, cancel no-ops

**Checkpoint**: All three user stories functional independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final quality gates across all stories

- [ ] T019 [P] Mark call, voice-memo, attachment controls inert-but-functional-looking documenting non-claims per FR-010 in apps/web/src/features/chat/components/MessageComposer.tsx caller wiring (no toasts/success reporting)
- [ ] T020 [P] A11y pass: verify accessible names and focus on rail/tabs/list/search/filter per FR-009 using components' existing aria-labels (spot-check in running app)
- [ ] T021 Manual end-to-end validation per specs/014-chat-ui/quickstart.md steps 1-8 including narrow-screen overflow and safe-area padding
- [ ] T022 [P] Verify permissions: confirm (chat) route group does NOT conflict with (authenticated) group's existing routes; adjust layout/paths if conflict appears
- [ ] T023 Format + lint sweep: `npx biome check apps/web/src/features/chat "apps/web/src/app/(chat)" && npm -w web run typecheck`

**Checkpoint**: Feature ready for user walkthrough.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Phase 1 checks; T003 blocks ALL stories (single data source)
- **US1 (Phase 3)**: Depends on Phase 2 — routes + layout + list wiring
- **US2 (Phase 4)**: Depends on US1 (needs open conversation + composer wired)
- **US3 (Phase 5)**: Depends on US1 (list + header wired); independent of US2
- **Polish (Phase 6)**: Depends on all stories

### User Story Dependencies

- US1 is the spine (layout + routes). US2 and US3 both hang off US1's layout/list; US2 and US3 do not depend on each other and can proceed in parallel after US1.

### Within Each Story

- Layout/pages before interaction wiring; sample data (T003) before any story consumption; manual verification last in each story.

### Parallel Opportunities

- T002 baseline check parallel with T001
- US2 (Phase 4) and US3 (Phase 5) run in parallel after US1
- T016 chooser component parallel to T017 wiring
- Polish tasks T019-T022 mutually parallel; T023 last

---

## Parallel Example: After US1

```bash
# Launch US2 and US3 concurrently (different files, no overlap):
Task: "T012-T015 in-memory send state wiring"
Task: "T016-T018 new-chat chooser"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. T001-T004 (setup + data)
2. T005-T011 (routes + list + layout)
3. STOP and validate: browse/select works end to end at both routes and breakpoints

### Incremental Delivery

- US1 → demo browse/select
- +US2 → demo local send
- +US3 → demo new chat from contact
- Polish → a11y + manual sweep

### Notes

- Components already exist: route/layout work composes them; do not reimplement list pane internals (T007 wires data via props)
- `pnpm`? No — run npm workspaces commands per AGENTS.md
- No DB/Prisma involvement; no migrations (constitution VII not triggered)
- The `(chat)` layout intentionally duplicates (authenticated) navigation-wise for its narrow set of nav items per plan.md; do not import from features/navigation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- This feature has NO automated tests: validation is the manual quickstart steps per story
- Stop at any checkpoint to validate the story independently
- Avoid: vague tasks, same-file conflicts, cross-story dependencies that break independence
