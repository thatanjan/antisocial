# AGENTS.md - Dev Guidelines for antisocial

## Overview

Guidelines for agents on antisocial codebase. Covers build commands, linting, code style, project conventions.

## Commands

### Linting & Formatting

- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome (writes changes)

### Database

- `npm run postinstall` - Auto-runs after `npm install` to generate Prisma client
- `npx prisma migrate dev --create-only` - Generate migration file **without applying**
- `npx prisma migrate dev` - Apply pending migrations (only after user approval)

### Note on Testing

No test framework. Skip tests unless requested.

---

## Code Style Guidelines

### TypeScript

- **strict mode** (tsconfig.json)
- Prefer `const` over `let`; `let` only when reassignment needed
- Arrow functions: `const myFn = () => { ... }`
- Arrow functions for components.
- Avoid `any`; use proper types or `unknown`
- JSDoc/TSDoc for complex functions and public APIs

### Imports & Organization

- Path aliases from `tsconfig.json`:
  - `@/` for `src/` (e.g., `@/components`, `@/lib/utils`)
  - `@/components/ui` for shadcn UI components
- Group imports: external libs → internal aliases → relative

### File Structure

Follow feature-based architecture:

```
src/
├── components/     # Global reusable components
├── hooks/          # Global hooks
├── lib/            # Utilities, auth client, etc.
├── types/          # Global types
├── features/       # Feature modules
│   └── feature-name/
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       ├── types/
│       └── actions/    # Server actions
└── app/            # Next.js app router pages
```

### Server Actions

- Place in `features/*/actions/*.ts`
- Named exports
- Return `{ success: boolean; error?: string; ... }`
- Zod for input validation
- Example:

```ts
'use server'
import { z } from 'zod'

const Schema = z.object({ name: z.string() })

export const myAction = async (data: z.infer<typeof Schema>) => {
  const parsed = Schema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid data' }
  // ... logic
  return { success: true }
}
```

### Client vs Server Components

- Default to **server components**
- `"use client"` only when needed (hooks, event handlers, interactive UI)
- Ask before converting server to client components

### Error Handling

- `try/catch` with `console.error`
- User-friendly errors via `sonner` toast: `toast.error("Message")`
- Return error objects from server actions, don't throw in production

### Styling (Tailwind + shadcn/ui)

**Follow tailwind-shadcn-customization skill:**

1. **No arbitrary values** - Never use square bracket syntax:

   - ❌ `text-[14px]`, `w-[300px]`, `bg-[#1a1a1a]`
   - ✅ Design tokens: `text-sm`, `w-72`, `bg-card`

2. **Foreground/Background contrast** - Every background needs matching text color:

   - ✅ `bg-primary text-primary-foreground`
   - ✅ `bg-card text-card-foreground`
   - ✅ Hover states: `hover:bg-primary hover:text-primary-foreground`

3. **Custom values** - Add to `@theme inline` in `globals.css`, not inline

4. **Use shadcn components** - Prefer existing over custom
   - Ask before creating custom components

### Naming Conventions

- **Components**: PascalCase (e.g., `CommentList`, `PostCard`)
- **Files**: kebab-case (e.g., `post-card.tsx`, `toggle-like.ts`)
- **Functions/variables**: camelCase
- **Types/Interfaces**: PascalCase with `Type`/`Interface` suffix where helpful
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase otherwise

### Database (Prisma)

- Prisma Client via `import { prisma } from "@/lib/prisma"`
- Follow Prisma naming conventions (singular model names)
- Handle DB errors properly

**Migration Workflow (MUST follow):**

1. After any `schema.prisma` change, run `npx prisma migrate dev --create-only` to generate migration file **without applying**.
2. **Do NOT run `npx prisma migrate dev`** until user explicitly approves.
3. Present migration SQL to user for review.
4. Only after user approval, run `npx prisma migrate dev` to apply migration.
5. Run `npx prisma generate` to regenerate Prisma Client after migration.

### Authentication

- Better Auth via `@/lib/authClient`
- Server-side auth checks in actions: `const session = await authClient.api.getSession({ headers: headers() })`

### Documentation

- Unsure about API? Ask me.
- If I approve, use **Context7 MCP server** via `context7_resolve-library-id` and `context7_query-docs` tools
- Never hallucinate API usage - verify with official docs

### Code Readability

- Blank lines between logical sections
- Avoid excessive blank lines
- Group related lines, separate distinct blocks with single blank lines

### Miscellaneous

- Lucide React for icons
- `sonner` for toasts: `import { toast } from "sonner"`
- `date-fns` for date formatting
- Zod for all form validation
- React Hook Form with Zod resolver for forms

---

## Existing Agent Rules

### From tailwind-shadcn-customization skill

- Enforce Tailwind CSS rules (no arbitrary values, foreground/background contrast)
- Design tokens only
- Extend theme in globals.css for custom values
- See `.agents/skills/tailwind-shadcn-customization/SKILL.md` for full details

---

## Active Technologies

- PostgreSQL (009-user-profile-page)
- PostgreSQL (010-guest-mode)

- TypeScript (strict mode) + Shadcn UI, React Hook Form, Zod, Better Auth (008-user-follow)

## Recent Changes

- 008-user-follow: Added TypeScript (strict mode) + Shadcn UI, React Hook Form, Zod, Better Auth

<!-- SPECKIT START -->

Additional context about technologies, project structure,
shell commands, other important info - read current plan:

- **News Feed (011)**: [specs/011-news-feed/plan.md](./specs/011-news-feed/plan.md)
  - Hybrid Redis cache strategy with sorted sets
  - Fan-out-on-write for hot users (>1000 followers)
  - Server actions for feed fetching and cache invalidation
  - Graceful degradation when cache unavailable
- **News Feed Customization (012)**: [specs/012-news-feed-customization/plan.md](./specs/012-news-feed-customization/plan.md)
  - Fixed sidebars (replace sticky with fixed positioning)
  - Remove Requests section from right sidebar
  - Disable Explore/My Favorites/Direct/Stats with "coming soon" tooltip
  <!-- SPECKIT END -->