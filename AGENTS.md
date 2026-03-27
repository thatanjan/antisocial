# AGENTS.md - Development Guidelines for antisocial

## Overview

This document provides guidelines for agents working on the antisocial codebase. It covers build commands, linting, code style, and project conventions.

## Commands

### Development

- `npm run dev` - Start Next.js development server (Turbopack)
- `npm run build` - Build the Next.js application
- `npm run start` - Start production server

### Linting & Formatting

- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome (writes changes)

### Database

- `npm run postinstall` - Auto-runs after `npm install` to generate Prisma client

### Note on Testing

No test framework is currently configured. Do not write test files unless explicitly requested.

---

## Code Style Guidelines

### TypeScript

- Use **strict mode** (enabled in tsconfig.json)
- Prefer `const` over `let`; only use `let` when reassignment is strictly necessary
- Use arrow functions: `const myFn = () => { ... }`
- Avoid `any`; use proper types or `unknown` where needed
- Add JSDoc/TSDoc comments for complex functions and public APIs

### Imports & Organization

- Use path aliases defined in `tsconfig.json`:
  - `@/` for `src/` (e.g., `@/components`, `@/lib/utils`)
  - `@/components/ui` for shadcn UI components
- Organize imports with Biome (auto-runs on save)
- Group imports: external libs → internal aliases → relative

### File Structure

Follow the feature-based architecture:

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
- Use named exports
- Always return `{ success: boolean; error?: string; ... }`
- Use Zod for input validation
- Example:

```ts
'use server'
import { z } from 'zod'

const Schema = z.object({ name: z.string() })

export async function myAction(data: z.infer<typeof Schema>) {
  const parsed = Schema.safeParse(data)
  if (!parsed.success) return { success: false, error: 'Invalid data' }
  // ... logic
  return { success: true }
}
```

### Client vs Server Components

- Default to **server components**
- Add `"use client"` only when needed (hooks, event handlers, interactive UI)
- Ask before converting server components to client components

### Error Handling

- Use `try/catch` with proper error logging (`console.error`)
- Display user-friendly errors via `sonner` toast: `toast.error("Message")`
- Return error objects from server actions, don't throw in production

### Styling (Tailwind + shadcn/ui)

**Follow the tailwind-shadcn-customization skill:**

1. **No arbitrary values** - Never use square bracket syntax:

   - ❌ `text-[14px]`, `w-[300px]`, `bg-[#1a1a1a]`
   - ✅ Use design tokens: `text-sm`, `w-72`, `bg-card`

2. **Foreground/Background contrast** - Every background needs matching text color:

   - ✅ `bg-primary text-primary-foreground`
   - ✅ `bg-card text-card-foreground`
   - ✅ Hover states: `hover:bg-primary hover:text-primary-foreground`

3. **Borders** - Use design tokens:

   - ✅ `border-border`, `border-input`
   - ❌ `border-[#ccc]`, `border-gray-300`

4. **Custom values** - Add to `@theme inline` in `globals.css`, not inline

5. **Use shadcn components** - Prefer existing components over custom ones
   - Install with: `npx shadcn@latest add <component>`
   - Ask before creating custom components

### Naming Conventions

- **Components**: PascalCase (e.g., `CommentList`, `PostCard`)
- **Files**: kebab-case (e.g., `post-card.tsx`, `toggle-like.ts`)
- **Functions/variables**: camelCase
- **Types/Interfaces**: PascalCase with `Type`/`Interface` suffix where helpful
- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase otherwise

### Database (Prisma)

- Use Prisma Client via `import { prisma } from "@/lib/prisma"`
- Follow Prisma naming conventions (singular model names)
- Run `npx prisma generate` after schema changes
- Use proper error handling for DB operations

### Authentication

- Use Better Auth via `@/lib/authClient`
- Use server-side auth checks in actions: `const session = await authClient.api.getSession({ headers: headers() })`

### Documentation

- When unsure about library/framework APIs or best practices, use the **Context7 MCP server** via `context7_resolve-library-id` and `context7_query-docs` tools
- Never guess or hallucinate API usage—always verify with official docs

### Code Readability

- Add blank lines between logical sections of code to improve readability
- Don't overdo it—avoid excessive blank lines that waste space
- Group related lines together and separate distinct blocks with single blank lines

### Miscellaneous

- Use Lucide React for icons
- Use `sonner` for toasts: `import { toast } from "sonner"`
- Use `date-fns` for date formatting
- Use Zod for all form validation
- Use React Hook Form with Zod resolver for forms

---

## Existing Agent Rules

### From ignore-prompts.md

1. Code quality and reusability
2. KISS, DRY principles
3. Add TSDoc comments
4. Self-explanatory code
5. Use shadcn components (ask before custom)
6. Use Tailwind + shadcn for styling
7. Use Tailwind colors, ask before custom colors
8. Use Next.js Cache components
9. Prefer server components (ask before client)
10. Use server actions, not route handlers

### From tailwind-shadcn-customization skill

- Enforce Tailwind CSS rules (no arbitrary values, foreground/background contrast)
- Use design tokens only
- Extend theme in globals.css for custom values
- See `.agents/skills/tailwind-shadcn-customization/SKILL.md` for full details

---

## Linter Configuration

Biome is configured in `biome.json`:

- ESLint-like rules for JS/TS
- Tailwind class sorting (useSortedClasses)
- Next.js and React recommended rules
- Ignores: node_modules, .next, dist, build, src/components/ui, src/generated

Run `npm run lint` before committing to catch issues.

## Active Technologies
- PostgreSQL (009-user-profile-page)

- TypeScript (strict mode) + Shadcn UI, React Hook Form, Zod, Better Auth (008-user-follow)

## Recent Changes

- 008-user-follow: Added TypeScript (strict mode) + Shadcn UI, React Hook Form, Zod, Better Auth
