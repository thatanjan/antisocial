# Implementation Plan: Google Auth Page

**Branch**: `002-google-auth-page` | **Date**: 2026-01-23 | **Spec**: [specs/002-google-auth-page/spec.md](spec.md)
**Input**: Feature specification from `/specs/002-google-auth-page/spec.md`

## Summary

Build a responsive, mobile-first authentication page for the "antisocial" social media app. The page will exclusively use Google OAuth via Better Auth. The aesthetic will be driven by the "Notebook" theme (Architects Daughter font, hand-drawn look) from TweakCN, with a default dark mode.

## Technical Context

**Language/Version**: TypeScript (strict mode)  
**Framework**: Next.js (App Router, latest stable)  
**Primary Dependencies**: Shadcn UI, React Hook Form, Zod, Better Auth, next-themes  
**ORM**: Prisma  
**Storage**: PostgreSQL  
**Testing**: Not required  
**Target Platform**: Web (modern browsers)  
**Project Type**: Next.js web application  
**Performance Goals**: Session retrieval & redirect < 200ms  
**Constraints**: Google OAuth as only login option, strict color variable usage in `globals.css`  
**Scale/Scope**: MVP authentication flow  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Shadcn components used (custom components require approval)
- [x] Server Components by default (Client components require approval)
- [x] Server Actions for mutations (no route handlers unless approved)
- [x] TSDoc comments on all exports
- [x] Colors defined as CSS variables (referenced from `globals.css` per Constitution 1.3.0)
- [x] KISS & DRY principles followed
- [x] Feature-based file structure enforced

## Project Structure

### Documentation (this feature)

```text
specs/002-google-auth-page/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Research findings (Better Auth + Notebook theme)
├── data-model.md        # Prisma entities for Better Auth
├── quickstart.md        # Setup guide & env vars
└── contracts/
    └── auth.md          # Auth flow endpoints
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx       # ThemeProvider injection
│   ├── (auth)/          # Auth group
│   │   └── login/
│   │       └── page.tsx # Login page
│   └── api/
│       └── auth/
│           └── [...better-auth]/
│               └── route.ts
├── features/
│   └── auth/
│       ├── components/  # LoginForm (Server Component), GoogleButton, Logo
│       ├── actions/     # auth-actions.ts (Server Actions for signIn/signOut)
│       ├── types/       # Auth specific types
├── lib/
│   ├── auth.ts          # Server-side auth config
│   └── auth-client.ts   # Client-side auth config (existing)
└── components/
    └── dark-mode-toggle.tsx # Global theme switcher
```

**Structure Decision**: Using Server Actions in `src/features/auth/actions/` to handle authentication initiation and termination, as per Constitution Section IV. All authentication checks are performed server-side using `auth.api.getSession`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Phase 0: Research (Complete)
See [research.md](research.md) for details on Better Auth setup and Notebook theme application.

## Phase 1: Design (Complete)
- [data-model.md](data-model.md) defines Prisma schema compatibility.
- [contracts/auth.md](contracts/auth.md) defines the OAuth flow.
- [quickstart.md](quickstart.md) defines environmental requirements.

## Phase 2: Implementation (Pending)
Tasks will be generated in `tasks.md` following this plan.
