# Implementation Plan: Like Post

**Branch**: `006-like-post` | **Date**: 2026-02-22 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/006-like-dislike-post/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature enables users to "Like" posts. It uses **Next.js Server Actions** for backend mutations and the **`useOptimistic` hook** for instantaneous UI feedback. Users can toggle a Like by clicking the heart icon. Self-liking is prohibited.

## Technical Context

**Language/Version**: TypeScript (strict mode)  
**Framework**: Next.js (App Router, latest stable)  
**Primary Dependencies**: Shadcn UI, Lucide React, Better Auth  
**ORM**: Prisma  
**Storage**: PostgreSQL  
**Testing**: Not required unless explicitly requested  
**Target Platform**: Web (modern browsers)
**Project Type**: Next.js web application  
**Performance Goals**: Optimistic UI update in < 100ms.  
**Constraints**: 
- Users cannot like their own posts.
- One like per user-post pair.
**Scale/Scope**: Feature-based implementation under `src/features/likes`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Shadcn components used (custom components require approval)
- [x] Server Components by default (Client components require approval)
- [x] Server Actions for mutations (no route handlers unless approved)
- [x] TSDoc comments on all exports
- [x] Colors defined as CSS variables
- [x] KISS & DRY principles followed
- [x] Feature-based file structure enforced

## Project Structure

### Documentation (this feature)

```text
specs/006-like-dislike-post/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
└── features/
    └── likes/
        ├── components/  # LikeButton
        ├── types/       # Like types
        └── actions/     # toggleLikeAction
```

**Structure Decision**: A dedicated `likes` feature directory. `PostCard` will be updated to use the `LikeButton`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Client Components | Required for interactive LikeButton and `useOptimistic`. | Server-only would not provide the instant feedback requested. |
