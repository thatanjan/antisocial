# Implementation Plan: User Follow System

**Branch**: `008-user-follow` | **Date**: March 21, 2026 | **Spec**: specs/008-user-follow/spec.md
**Input**: Feature specification from `/specs/008-user-follow/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

User Follow System enabling users to follow each other with constraints: no self-follows, no duplicates. Database designed for scalability with partitioning, indexes, and denormalized counts in user profile.

## Technical Context

**Language/Version**: TypeScript (strict mode)  
**Framework**: Next.js (App Router, latest stable)  
**Primary Dependencies**: Shadcn UI, React Hook Form, Zod, Better Auth  
**ORM**: Prisma  
**Database**: PostgreSQL  
**Caching**: Redis (future - not in initial implementation)  
**Testing**: Not required unless explicitly requested  
**Target Platform**: Web (modern browsers)  
**Project Type**: Next.js web application  
**Scale/Scope**: Millions to billions of follow relationships (partitioned table design)

### Implementation Requirements (from user input)

- **Partitioning**: Follows table must be partitioned for scalability (millions to billions)
- **Indexes**: Add indexes for faster query performance
- **Denormalization**: Store total followers and followees count in user profiles table
- **Caching**: Redis cache planned for future (not in initial implementation)

## Constitution Check

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
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  MANDATORY: This project follows a feature-based file structure as defined in the constitution.
  All new code MUST follow this layout.
-->

```text
src/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── [routes]/
├── components/          # Global reusable components (Shadcn + custom approved)
├── hooks/               # Global reusable hooks
├── utils/               # Global reusable utilities
├── types/               # Global reusable types
├── lib/                 # Third-party integrations (prisma, auth, etc.)
└── features/
    └── [feature-name]/
        ├── components/  # Feature-specific components
        ├── hooks/       # Feature-specific hooks
        ├── utils/       # Feature-specific utilities
        ├── types/       # Feature-specific types
        └── actions/     # Feature-specific server actions
```

**Structure Decision**: Follow feature-based structure at `src/features/follow/` with:
- `actions/` - Server actions (follow-user, unfollow-user, get-followers, get-following)
- `components/` - Follow button, followers/following lists
- `types/` - TypeScript interfaces for Follow entity
- `utils/` - Helper functions

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
