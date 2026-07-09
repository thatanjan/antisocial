# Implementation Plan: News Feed Final Customization

**Branch**: `012-news-feed-customization` | **Date**: 2026-06-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/012-news-feed-customization/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Fix left and right sidebars to stay fixed on scroll (removing internal ScrollArea wrappers), remove the Requests section from the right sidebar, and disable the Explore/My Favorites/Direct/Stats nav items with a "coming soon" title tooltip on hover.

## Technical Context

**Language/Version**: TypeScript (strict mode) — Next.js App Router  
**Primary Dependencies**: Next.js, Tailwind CSS, Shadcn UI, Lucide React  
**Storage**: N/A — no database changes  
**Testing**: No test framework configured (skip per project conventions)  
**Target Platform**: Web (responsive: desktop sidebars, mobile sheet drawer)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: N/A — UI-only changes, no backend logic  
**Constraints**: Sidebars must stay fixed on scroll while main content scrolls independently; disabled items must not navigate; tooltip must appear on hover  
**Scale/Scope**: 3 existing components to modify (LeftSidebar, RightSidebar, NavLinkItem), 1 type to extend (NavItem)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Assessment | Pass? |
|---|-----------|------------|-------|
| I | Code Quality & Self-Documentation | Existing NavLinkItem and sidebar components have TSDoc; modifications will maintain the same standard | ✅ |
| II | KISS & DRY | Changes are minimal and straightforward — remove JSX, adjust CSS, add disabled state to one component | ✅ |
| III | Component & Styling Standards | Changes use existing Shadcn UI patterns. Native HTML `title` attribute used for tooltips. No arbitrary Tailwind values; design tokens used throughout | ✅ |
| IV | Server-First Architecture | Sidebar components are already client components (usePathname in NavLinkItem) — this is established precedent; no new client components needed | ✅ |
| V | Feature-Based File Structure | All changes are within `src/features/navigation/components/` — existing feature directory | ✅ |
| VI | Containerization | No Docker changes needed | ✅ |
| VII | Database Migration Workflow | No database changes needed | ✅ |

**Gate Result**: ALL GATES PASS — no violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/012-news-feed-customization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
└── features/
    └── navigation/
        ├── components/
        │   ├── LeftSidebar.tsx      # [MODIFY] Remove ScrollArea, fix positioning
        │   ├── RightSidebar.tsx     # [MODIFY] Remove ScrollArea, remove Requests section, fix positioning
        │   ├── NavLinkItem.tsx      # [MODIFY] Support disabled state + title tooltip
        │   └── MobileNav.tsx        # [MODIFY] Remove Requests section, disable nav items
        ├── types/
        │   └── index.ts             # [MODIFY] Add disabled field to NavItem
        └── utils/
            └── mock-data.ts         # [MODIFY] Mark Explore/Favorites/Direct/Stats as disabled
```

**Structure Decision**: Single web application — all changes are within `src/features/navigation/` feature directory, following the existing feature-based structure.

## Complexity Tracking

No constitution violations — no complexity tracking needed.
