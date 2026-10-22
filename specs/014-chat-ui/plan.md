# Implementation Plan: Chat UI

**Branch**: `014-chat-ui` | **Date**: 2026-10-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-chat-ui/spec.md`

## Summary

Build the authenticated chat page from the supplied desktop and mobile references. Keep the route and static shell server-rendered, and use one focused client workspace for the interactions that require browser state: conversation selection, search and category filters, in-session message sending, sample-contact conversation creation, and mobile list/chat navigation. Seed all UI data locally; do not add persistence, backend services, or real calls/attachments.

## Technical Context

**Language/Version**: TypeScript (strict), Next.js 16.1, React 19.2  
**Primary Dependencies**: Existing Next.js/React, installed shadcn UI primitives, `lucide-react`, Tailwind CSS 4 design tokens  
**Storage**: In-memory client state only; seeded sample data resets on page reload. No database or browser storage.  
**Testing**: User-led manual UI testing only; no automated test commands or suites are planned for this feature.  
**Target Platform**: Authenticated web application, desktop and narrow mobile browsers  
**Project Type**: Next.js App Router web application with a separate `(chat)` route group  
**Performance Goals**: Initial chat shell and seeded list render in the normal page load; local selection, filtering, and send interactions update immediately without a network request.  
**Constraints**: Server components by default; client boundary only for interactions needing browser state/events. Use existing shadcn components, Lucide, Tailwind utilities and tokens from `apps/web/src/app/globals.css`, or standard Tailwind colors where needed. No arbitrary Tailwind classes, new color tokens, inline styles, CDN assets/scripts, backend, or schema changes.  
**Scale/Scope**: One authenticated chat route, bundled sample conversations and contacts, text-only local sending, four list filters, desktop two-pane and narrow-screen list/chat navigation.

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
│       ├── layout.tsx                    # Dedicated chat layout group
│       └── chat/
│           └── page.tsx                  # Server route page at /chat
└── features/
    └── chat/
        ├── components/
        │   └── ChatWorkspace.tsx        # Client boundary for list and chat interactions
        ├── data/
        │   └── sample-conversations.ts  # Bundled contacts, conversations, and sample messages
        └── types/
            └── index.ts                # Conversation, Message, and Contact types

**Structure Decision**: The `/chat` page lives in its own `(chat)` App Router layout group, separate from the existing `(authenticated)` route group. Chat-specific components, data, and types remain under `apps/web/src/features/chat/`. The route page and shared/static shell are server components; one focused workspace handles browser-only interaction state. Use existing shadcn components (Button, Input, Dialog, Avatar) and Lucide icons; add no dependencies or shared/global components.

## Complexity Tracking

No constitution violations. No additional projects, services, models, or abstractions are introduced.
