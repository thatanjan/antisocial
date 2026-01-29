<!--
  ============================================================================
  SYNC IMPACT REPORT
  ============================================================================
  Version change: 1.3.0 → 1.5.0
  
  Updated Principles:
  - III. Component & Styling Standards (Strict color variable rules & NO arbitrary values)
  
  Previous:
  - III. Component & Styling Standards (Strict color variable rules)
  
  Templates requiring updates:
  - ✅ spec-template.md: No blocking conflicts
  
  Follow-up TODOs: None
  ============================================================================
-->
# Antisocial Constitution

## Core Principles

### I. Code Quality & Self-Documentation

All code MUST be self-explanatory through clear naming, logical structure, and TSDoc comments. Every exported function, type, interface, and class MUST have TSDoc documentation. Variable and function names MUST convey intent without requiring additional explanation.

**Non-Negotiables:**
- TSDoc comments on all public APIs
- Descriptive naming conventions (avoid abbreviations unless universally understood)
- No magic numbers or strings—use named constants
- Code MUST be readable without external documentation
- Always use arrow functions (`const myFn = () => { ... }`)
- Always use `const` for variables; use `let` ONLY if re-assignment is strictly necessary

### II. KISS & DRY

All implementations MUST follow Keep It Simple, Stupid (KISS) and Don't Repeat Yourself (DRY) principles. Complexity MUST be justified. Reusable code MUST be extracted into shared utilities or components.

**Non-Negotiables:**
- Prefer simple solutions over clever ones
- Extract repeated logic into reusable functions/components
- No premature abstraction—wait for the third occurrence
- Each piece of knowledge MUST have a single, authoritative representation

### III. Component & Styling Standards

All UI components MUST use Shadcn UI components. Install Shadcn components as needed. Custom components require explicit user approval before creation. All styling MUST use Tailwind CSS with Shadcn's design tokens.

**Non-Negotiables:**
- Shadcn UI components are the default choice—no exceptions without approval
- Custom components MUST be requested and approved by user before creation
- Tailwind CSS is the only styling solution (no inline styles, no CSS modules)
- **NO arbitrary Tailwind values** (e.g., `text-[10px]`, `max-w-[150px]`). Use standard Tailwind scales or define CSS variables in `globals.css` if custom tokens are required.
- Only use color variables defined in `src/app/globals.css`.
- If you need to add more colors, add variables first in `src/app/globals.css`.
- Variables MUST be mapped to Tailwind colors (e.g., `--product-card-shadow-color: var(--color-zinc-500);`).
- Custom colors MUST be requested and approved by user before creation

### IV. Server-First Architecture

All components MUST be React Server Components by default. Client components require justification and user approval. Route handlers MUST NOT be created unless explicitly instructed. Server Actions are the default for mutations.

**Non-Negotiables:**
- Default to React Server Components
- Client components (`"use client"`) require user approval before creation
- Server Actions for all data mutations (no route handlers unless explicitly requested)
- Use Next.js caching mechanisms (`cache`, `unstable_cache`, etc.)
- Leverage Next.js built-in caching at every opportunity

### V. Feature-Based File Structure

Code MUST be organized by feature with clear separation between global and feature-specific code. The directory structure is enforced.

**Non-Negotiables:**
```text
src/
├── components/    # Global reusable components
├── hooks/         # Global reusable hooks
├── utils/         # Global reusable utilities
├── types/         # Global reusable types
├── lib/           # Third-party integrations (Prisma, auth, etc.)
└── features/
    └── [feature-name]/
        ├── components/   # Feature-specific components
        ├── hooks/        # Feature-specific hooks
        ├── utils/        # Feature-specific utilities
        └── types/        # Feature-specific types
```

**Rules:**
- Global code goes in `src/components/`, `src/hooks/`, `src/utils/`, `src/types/`, `src/lib/`
- Feature-specific code goes in `src/features/[feature-name]/`
- No cross-feature imports without promoting to global
- Each feature MUST be self-contained

### VI. Containerization Standards

The entire application stack MUST be containerized using Docker. All development SHALL be possible via `docker-compose up` without requiring local installation of dependencies (other than Docker itself).

**Non-Negotiables:**
- A `Dockerfile` MUST exist for the Next.js application
- A `docker-compose.yml` MUST orchestrate the App, Database, and any other services
- `npm run dev` SHOULD work, but `docker-compose up` is the standard for full stack execution
- No implicit host dependencies (e.g., local Node version, local Postgres) should be assumed for production parity

## Technology Stack

The following technologies are mandated for this project:

| Category | Technology | Notes |
|----------|------------|-------|
| Framework | Next.js | Latest stable version, App Router |
| Language | TypeScript | Strict mode enabled |
| Styling | Tailwind CSS | With Shadcn UI design tokens |
| UI Components | Shadcn UI | Install components as needed |
| Database | PostgreSQL | Via Prisma ORM |
| ORM | Prisma | Type-safe database access |
| Authentication | Better Auth | Authentication library |
| Validation | Zod | Schema validation |
| Forms | React Hook Form | Form state management |
| Infrastructure | Docker | Dockerfile & Docker Compose |

**Documentation:**
- Use latest official documentation
- Use Context7 MCP server for latest docs when needed

## Development Workflow

### Before Implementation

1. Review feature requirements against this constitution
2. Confirm component approach (Shadcn or approved custom)
3. Confirm rendering strategy (Server or approved Client)
4. Plan file locations per feature structure

### During Implementation

1. Write self-documenting code with TSDoc
2. Use Shadcn components—request approval for custom components
3. Use Server Components—request approval for Client components
4. Use Server Actions for mutations—no route handlers unless approved
5. Define colors as CSS variables before using in Tailwind
6. Follow feature-based file structure strictly

### Code Review Checklist

- [ ] TSDoc comments on all exports
- [ ] KISS & DRY principles followed
- [ ] Shadcn components used (or custom approved)
- [ ] Server Components used (or Client approved)
- [ ] Server Actions for mutations (or route handlers approved)
- [ ] Colors defined as CSS variables
- [ ] Correct feature directory structure
- [ ] No testing code (unless explicitly requested)
- [ ] Docker configuration updated (if new services added)

## Governance

This constitution supersedes all other development practices for this project. All code contributions MUST verify compliance with these principles.

**Amendment Process:**
1. Propose change with justification
2. Document impact on existing code
3. Update constitution with new version
4. Propagate changes to dependent templates

**Versioning:**
- MAJOR: Principle removals or backward-incompatible changes
- MINOR: New principles or significant expansions
- PATCH: Clarifications, wording improvements

**Compliance:**
- All PRs MUST verify compliance with this constitution
- Violations require documented justification
- Repeated violations trigger constitution review

**Version**: 1.5.0 | **Ratified**: 2026-01-20 | **Last Amended**: 2026-01-27
