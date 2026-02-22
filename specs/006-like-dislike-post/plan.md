# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  Technical context for this Next.js project as defined in the constitution.
-->

**Language/Version**: TypeScript (strict mode)  
**Framework**: Next.js (App Router, latest stable)  
**Primary Dependencies**: Shadcn UI, React Hook Form, Zod, Better Auth  
**ORM**: Prisma  
**Storage**: PostgreSQL  
**Testing**: Not required unless explicitly requested  
**Target Platform**: Web (modern browsers)
**Project Type**: Next.js web application  
**Performance Goals**: [Domain-specific or NEEDS CLARIFICATION]  
**Constraints**: [Domain-specific or NEEDS CLARIFICATION]  
**Scale/Scope**: [Domain-specific or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] Shadcn components used (custom components require approval)
- [ ] Server Components by default (Client components require approval)
- [ ] Server Actions for mutations (no route handlers unless approved)
- [ ] TSDoc comments on all exports
- [ ] Colors defined as CSS variables
- [ ] KISS & DRY principles followed
- [ ] Feature-based file structure enforced

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

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
