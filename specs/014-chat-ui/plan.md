# Implementation Plan: Chat UI

**Branch**: `014-chat-ui` | **Date**: 2026-10-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-chat-ui/spec.md`

## Summary

Build the authenticated chat feature from the supplied desktop and mobile references using the 16 components already implemented in `apps/web/src/features/chat/components/`. The `(chat)` route group owns the shared chrome: layout renders the left rail + conversation list (desktop) or mobile list + bottom tabs (narrow), per route. `/chat` shows an empty right pane; `/chat/[id]` renders the selected conversation. Sample data is bundled locally; no persistence, backend services, or real calls/attachments.

## Technical Context

**Language/Version**: TypeScript (strict), Next.js 16.1, React 19.2  
**Primary Dependencies**: Existing Next.js/React, installed shadcn UI primitives, `lucide-react`, Tailwind CSS 4 design tokens  
**Storage**: Bundled sample data module; in-memory client state for page-session changes; nothing persists across reload. No database.  
**Testing**: User-led manual UI testing only; no automated test commands or suites are planned for this feature.  
**Target Platform**: Authenticated web application, desktop and narrow mobile browsers  
**Project Type**: Next.js App Router `(chat)` route group with permanent list-side layout and per-id chat pages

## Route Structure

```text
apps/web/src/app/(chat)/
├── layout.tsx      # Server component. Desktop: LeftIconRail + ConversationsSidebar.
│                   # Narrow: MobileChatListScreen + BottomTabBar.
├── page.tsx        # /chat — empty right pane (desktop); list full-screen (mobile).
└── [id]/
    └── page.tsx    # /chat/[id] — ChatScreen for selected conversation id.
```

- The layout owns `LeftIconRail`, `BottomTabBar`, and the conversation list permanently; pages render only the right pane.
- Selection is URL-driven: conversation items link to `/chat/[id]`.
- Narrow screens: `/chat` renders the list full-screen and `/chat/[id]` renders only the conversation with Back (`/chat`), matching `chat-page-mobile.html` / `chat-page-mobile-chatlist.html`.
- Sample conversations/contacts/messages come from `apps/web/src/features/chat/data/sample-conversations.ts` (bundled mock data).

## Component Structure

Feature components in `apps/web/src/features/chat/components/` (PascalCase), mapped from `stitch-screen/` HTML (details in repo-root `chat-components.md`):

```text
apps/web/src/features/chat/
├── types.ts
├── data/sample-conversations.ts     # bundled mock conversations, contacts, messages
└── components/
    ├── LeftIconRail.tsx             # chat-page.html
    ├── BottomTabBar.tsx             # chat-page-mobile-chatlist.html
    ├── ChatsListHeader.tsx          # both list mocks
    ├── SearchInput.tsx              # both list mocks
    ├── FilterPills.tsx              # both list mocks
    ├── RecentChatsStrip.tsx         # both list mocks
    ├── ConversationListItem.tsx     # both list mocks
    ├── ConversationsSidebar.tsx     # chat-page.html (list pane composition)
    ├── MobileChatListScreen.tsx     # chat-page-mobile-chatlist.html
    ├── ChatHeader.tsx               # chat-page.html + chat-page-mobile.html
    ├── MessageStream.tsx            # both conversation mocks
    ├── MessageBubble.tsx            # both conversation mocks
    ├── DateSeparator.tsx            # both conversation mocks
    ├── CallLogCard.tsx              # both conversation mocks
    ├── MessageComposer.tsx          # both conversation mocks
    └── ChatScreen.tsx               # conversation pane composition
```

Layout composition (server): `(chat)/layout.tsx` → `LeftIconRail` + `ConversationsSidebar`/`MobileChatListScreen` + `BottomTabBar`. `[id]/page.tsx` → `ChatScreen` (client) for selection-local send/filter state; `page.tsx` renders the empty right pane placeholder.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|---|---|---|
| I. Code Quality & Self-Documentation | ✅ PASS | Strict TypeScript, descriptive types/state, document exported public APIs where present; no speculative interfaces. |
| II. KISS & DRY | ✅ PASS | One focused interaction boundary and simple in-memory state; no backend, cache, or persistence layer. |
| III. Component & Styling | ✅ PASS | Reuse installed shadcn primitives; Lucide icons; global semantic tokens or standard Tailwind colors; no arbitrary values or theme changes. |
| IV. Server-First Architecture | ✅ PASS | Route and static composition remain server components; only stateful interaction workspace is client-rendered, required for search, selection, composing, and responsive view state. No server actions or API routes are needed. |
| V. Feature-Based Structure | ✅ PASS | Shared chat feature data, types, and interactive workspace live under `apps/web/src/features/chat/`; the page route lives in the dedicated `apps/web/src/app/(chat)/` group. |
| VI. Containerization | ✅ PASS | No new services or environment requirements; use existing web app/container setup. |
| VII. Database Migration Workflow | ✅ PASS | No database model or schema change; migration workflow is not triggered. |

**Gate verdict**: ✅ PASS — no violations. The interactive client component is a deliberate, narrowly bounded requirement of the user-requested local frontend behavior. No complexity justification is needed.

## Project Structure

### Documentation (this feature)

```text
specs/014-chat-ui/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── chat-ui.md
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
apps/web/src/
├── app/
│   └── (chat)/
│       ├── layout.tsx                    # Shared chrome: rail + list (desktop), mobile list + tabs
│       ├── page.tsx                      # /chat — empty right pane
│       └── [id]/
│           └── page.tsx                  # /chat/[id] — selected conversation
└── features/
    └── chat/
        ├── types.ts                      # shared chat types
        ├── data/
        │   └── sample-conversations.ts   # Bundled contacts, conversations, and sample messages
        └── components/                   # 16 PascalCase components (see Component Structure)

**Structure Decision**: The chat surface lives in its own `(chat)` App Router layout group, separate from the existing `(authenticated)` route group. The layout permanently hosts `LeftIconRail`, `BottomTabBar`, and the conversation list; pages own only the right pane (`/chat` empty, `/chat/[id]` `ChatScreen` fed by id from `features/chat/data/sample-conversations.ts`). Shared chat types, mock data, and components remain under `apps/web/src/features/chat/`. Use existing shadcn components (Button, Input, Dialog, Avatar) and Lucide icons; add no dependencies or shared/global components.

## Complexity Tracking

No constitution violations. No additional projects, services, models, or abstractions are introduced.
