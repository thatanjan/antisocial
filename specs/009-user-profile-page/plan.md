# Implementation Plan: User Profile Page

**Branch**: `009-user-profile-page` | **Date**: 2026-03-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-user-profile-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implement a user profile page that displays user information (avatar, name, username, bio, follower/following counts, join date) and user's posts with tab navigation (Posts, Shorts, Tags, Activity). The page reuses the existing three-column layout (LeftSidebar, main content, RightSidebar) with only the middle column changing to display profile-specific content. Design reference shows a cover image area, profile card with "Edit Profile" button (for own profile), and pinned posts support.

## Technical Context

**Language/Version**: TypeScript (strict mode)  
**Framework**: Next.js (App Router, latest stable)  
**Primary Dependencies**: Shadcn UI, React Hook Form, Zod, Better Auth  
**ORM**: Prisma  
**Storage**: PostgreSQL  
**Testing**: Not required unless explicitly requested  
**Target Platform**: Web (modern browsers)
**Project Type**: Next.js web application  
**Performance Goals**: Profile pages load within 2 seconds, support pagination for posts  
**Constraints**: Use existing app colors/fonts, no arbitrary Tailwind values, maintain feature-based structure  
**Scale/Scope**: Single user profile view with posts list, follow/unfollow functionality

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Shadcn components used (custom components require approval) - Will use existing Shadcn components (Card, Button, Avatar, Tabs)
- [x] Server Components by default (Client components require approval) - Profile page will be server component; Tabs may need client component
- [x] Server Actions for mutations (no route handlers unless approved) - Follow/unfollow actions already exist
- [x] TSDoc comments on all exports - Will add TSDoc to all new components
- [x] Colors defined as CSS variables - Using existing app colors from globals.css
- [x] KISS & DRY principles followed - Reusing existing PostList component
- [x] Feature-based file structure enforced - New feature in `src/features/user-profile/`

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

```text
src/
├── app/
│   └── (authenticated)/
│       ├── layout.tsx           # Existing - 3-column layout (UNCHANGED)
│       └── profile/
│           └── [username]/
│               └── page.tsx     # NEW - Profile page route
├── components/                  # Existing global components
├── features/
│   ├── navigation/              # Existing - LeftSidebar, RightSidebar
│   ├── create-post/             # Existing - PostList component (reused)
│   ├── follow/                  # Existing - follow actions (reused)
│   └── user-profile/            # NEW - Profile feature
│       ├── components/
│       │   ├── ProfileHeader.tsx
│       │   ├── ProfileTabs.tsx
│       │   └── ProfilePage.tsx
│       ├── utils/
│       │   └── format-user-stats.ts
│       └── types/
│           └── index.ts
└── lib/                         # Existing - prisma, auth
```

**Structure Decision**: New `user-profile` feature follows constitution's feature-based structure. Existing `layout.tsx` is NOT modified - only the middle column content changes via new route. Reuses existing `PostList` component and `follow` actions to follow DRY principle.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
