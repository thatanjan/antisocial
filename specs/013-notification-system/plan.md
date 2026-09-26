# Implementation Plan: Notification System

**Branch**: `013-notification-system` | **Date**: 2026-07-28 | **Spec**: [spec.md](./spec.md)

## Summary

Add in-app notification system that creates notifications when a user follows, likes, or comments on another user's content. Notifications are viewed in a chronological list with read/unread state, persist for 30 days, then are automatically cleaned up via a scheduled cron job.

## Technical Context

**Language/Version**: TypeScript (strict), Next.js 16.1, React 19.2  
**Primary Dependencies**: Prisma (PostgreSQL), date-fns, lucide-react, sonner  
**Storage**: PostgreSQL via Prisma ORM — new `Notification` model  
**Scheduling**: GitHub Actions scheduled workflow → calls API route  

**Target Platform**: Web (Dockerized Next.js app + PostgreSQL)  
**Project Type**: Web application (Next.js App Router, Server Components + Server Actions)  
**Performance Goals**: Notification creation <500ms p95 from trigger action; notification list load <2s; cleanup job finishes within 5min for 1M records  
**Constraints**: No pg_cron in Docker Postgres; notifications stored in same PostgreSQL DB; cleanup must not impact user-facing performance  
**Scale/Scope**: Single Postgres instance, up to 1M notification rows, 10k+ daily active users

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance | Notes |
|-----------|-----------|-------|
| I. Code Quality & Self-Documentation | ✅ PASS | TSDoc on all exports, clear naming |
| II. KISS & DRY | ✅ PASS | Simple notification model, no over-engineering. |
| III. Component & Styling | ✅ PASS | Use shadcn Sheet/Dialog for notification panel, design tokens only |
| IV. Server-First Architecture | ✅ PASS | All mutations via server actions; notification list as server component |
| V. Feature-Based Structure | ✅ PASS | `src/features/notifications/` — actions, components, types |
| VI. Containerization | ✅ PASS | No Docker changes needed — GitHub Actions is external |
| VII. Database Migration | ✅ PASS | Follow `--create-only` → user approval → apply workflow |

**Gate verdict**: ✅ PASS — no violations. No complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/013-notification-system/
├── plan.md              # This file
├── research.md          # Phase 0 research decisions
├── data-model.md        # Notification schema design
├── quickstart.md        # Validation guide
├── contracts/           # Server action contracts
└── tasks.md             # Phase 2 task breakdown (created by /speckit.tasks)
```

### Source Code (repository root)

```text
.github/
└── workflows/
    └── cleanup-notifications.yml      # Scheduled GH Actions workflow

src/
├── features/
│   └── notifications/
│       ├── actions/
│       │   ├── get-notifications.ts    # Fetch notification list
│       │   ├── mark-read.ts           # Mark single notification read
│       │   ├── mark-all-read.ts       # Mark all notifications read
│       │   └── cleanup-notifications.ts  # Cron cleanup action
│       ├── components/
│       │   ├── notification-bell.tsx  # Bell icon with unread count badge
│       │   ├── notification-panel.tsx # Dropdown/sheet notification list
│       │   ├── notification-item.tsx  # Single notification row
│       │   └── notification-toast.tsx # In-app toast for new notifications
│       ├── types/
│       │   └── index.ts              # Notification type defs
│       └── utils/
│           ├── create-notification.ts # Shared notification creation helper
│           └── notification-lib.ts    # Formatting, grouping helpers
└── app/
    └── api/
        └── cron/
            └── cleanup-notifications/
                └── route.ts           # Cron trigger route (called by GH Actions)
```

**Structure Decision**: Standard Next.js feature-based architecture per constitution V. Notifications are a new feature with its own directory under `src/features/`. A shared `create-notification` utility is extracted to avoid duplication across follow/like/comment actions. The cleanup cron uses a GitHub Actions workflow that calls a Next.js API route.

## Complexity Tracking

No constitution violations — Complexity Tracking section is N/A.
