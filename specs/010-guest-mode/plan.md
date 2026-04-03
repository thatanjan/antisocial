# Implementation Plan: Guest Mode for Anonymous Users

**Branch**: `010-guest-mode` | **Date**: Thu Apr 02 2026 | **Spec**: [spec.md](../spec.md)

**Input**: Feature specification from `/specs/010-guest-mode/spec.md`

## Summary

Enable anonymous/guest authentication using Better Auth's anonymous plugin. Users can access the app without registration, browse content read-only, and convert to a permanent account later. The implementation adds the anonymous plugin, updates the database schema, creates a confirmation modal UI, and integrates the guest flow into the login page.

## Technical Context

**Language/Version**: TypeScript (strict mode)  
**Framework**: Next.js (App Router, latest stable)  
**Primary Dependencies**: Shadcn UI, React Hook Form, Zod, Better Auth  
**ORM**: Prisma  
**Storage**: PostgreSQL  
**Testing**: Not required unless explicitly requested  
**Target Platform**: Web (modern browsers)  
**Project Type**: Next.js web application  
**Performance Goals**: Guest session loads within 3 seconds  
**Constraints**: Guests have read-only access; restricted from creating content  
**Scale/Scope**: Individual user sessions, no additional backend services

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
specs/010-guest-mode/
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
├── app/                 # Next.js App Router pages
│   ├── (auth)/
│   │   └── login/       # Login page - add Guest button
│   └── (authenticated)/
│       ├── layout.tsx   # Update to show guest user
│       └── feed/        # Feed page - already works
├── components/          # Global reusable components
│   └── ui/              # Shadcn components
├── lib/
│   ├── auth.ts         # Add anonymous plugin
│   └── authClient.ts   # Add anonymous client plugin
├── features/
│   └── guest-mode/
│       ├── components/  # Guest modal, guest button
│       ├── hooks/      # useGuestSession hook
│       ├── types/      # Guest types
│       └── utils/      # Guest utilities
```

**Structure Decision**: Guest mode is a cross-cutting feature affecting auth, navigation, and UI. Code will be organized under `src/features/guest-mode/` with auth configuration in existing `src/lib/` files.

## Complexity Tracking

> No violations to justify. Standard implementation using Better Auth's anonymous plugin.

## Phase 0: Research

### Better Auth Anonymous Plugin

**Decision**: Use Better Auth's built-in anonymous plugin
**Rationale**: Already using Better Auth for authentication; anonymous plugin provides:
- Seamless integration with existing auth system
- Automatic account linking when user signs up
- Server and client-side API support
- Database schema support via isAnonymous flag

**Alternatives considered**:
- Custom session management: Rejected, would require significant custom code
- Third-party anonymous auth: Unnecessary since Better Auth provides this

### Implementation Approach

**Server-side**:
- Add `anonymous()` plugin to auth.ts with emailDomainName option
- Add `isAnonymous` field to User model in Prisma schema
- Run migration to update database

**Client-side**:
- Add `anonymousClient()` plugin to authClient.ts
- Create "Continue as Guest" button on login page
- Create confirmation modal with warning about 7-day inactivity deletion
- Add "Exit Guest Mode" option in profile menu

**UI Flow**:
1. User clicks "Continue as Guest" on login page
2. Modal appears with warning text about 7-day inactivity deletion
3. User confirms → anonymous sign-in via authClient.signIn.anonymous()
4. User redirected to feed as guest
5. Profile shows "Guest" as name with generic avatar
6. User can convert to permanent account via Google sign-up
7. User can exit guest mode via profile menu option

### Key Entities

- **AnonymousUser**: User record with isAnonymous=true flag
- **GuestSession**: Managed by Better Auth, persists via cookies

## Phase 1: Design

### Data Model Changes

Add to User model in prisma/schema.prisma:
- `isAnonymous Boolean @default(false)` - indicates anonymous user

### Interface Contracts

No external API contracts required. Internal only:
- authClient.signIn.anonymous() - client method
- authClient.deleteAnonymousUser() - delete guest account
- auth.api.deleteAnonymousUser() - server method

### Quickstart

1. Install anonymous plugin: Already part of better-auth
2. Update auth.ts: Add anonymous() to plugins
3. Update authClient.ts: Add anonymousClient() to plugins
4. Update Prisma schema: Add isAnonymous field
5. Run migration: npx prisma migrate
6. Create UI: Add guest button + modal to login page

### Agent Context Update

Run: `.specify/scripts/bash/update-agent-context.sh opencode`