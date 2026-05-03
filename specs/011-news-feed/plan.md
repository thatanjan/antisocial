# Implementation Plan: News Feed

**Branch**: `news-feed` | **Date**: 2026-05-03 | **Spec**: [specs/011-news-feed/spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-news-feed/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a followees-only news feed using a hybrid cache strategy. Users see posts from people they follow in reverse chronological order. Redis sorted sets cache feed data with a 180-second TTL. Hot users (>1000 followers) trigger fan-out-on-write to pre-populate followers' caches. Normal users use fan-out-on-load. Server-side rendered, with graceful degradation when Redis is unavailable.

## Technical Context

**Language/Version**: TypeScript (strict mode)  
**Primary Dependencies**: @upstash/redis, Prisma, Next.js App Router  
**Storage**: PostgreSQL (via Prisma), Redis (via Upstash)  
**Testing**: None (per project guidelines)  
**Target Platform**: Web (Next.js)  
**Project Type**: Web application  
**Performance Goals**: 
- Initial feed load <2 seconds
- Pagination <1 second for up to 10,000 followees
- 95% success rate across all conditions

**Constraints**: 
- Graceful degradation when Redis unavailable (fallback to DB)
- Fan-out failures don't block post creation
- No new database migrations required

**Scale/Scope**: 
- Up to 10,000 followees per user
- Max 500 cached posts per user
- Hot user threshold: >1000 followers

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & TSDoc | PASS | All exports will have TSDoc |
| II. KISS & DRY | PASS | Reusable feed service functions |
| III. Shadcn UI | PASS | Use existing PostList component |
| IV. Server-First | PASS | Server Components, Server Actions |
| V. Feature Structure | PASS | src/features/feed/ |
| VI. Docker | PASS | Existing config, may need Redis service |
| VII. DB Migrations | N/A | No schema changes required |

## Project Structure

### Documentation (this feature)

```text
specs/011-news-feed/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── server-actions.md
└── tasks.md             # Phase 2 output
```

### Source Code

```text
src/
├── lib/
│   └── redis.ts                    # NEW: Redis client singleton
├── features/
│   ├── feed/
│   │   ├── lib/
│   │   │   └── feed-service.ts    # NEW: Feed logic functions
│   │   ├── actions/
│   │   │   ├── get-feed.ts        # NEW: Server action to fetch feed
│   │   │   └── invalidate-feed.ts # NEW: Cache invalidation
│   │   ├── components/
│   │   │   └── FeedList.tsx       # NEW: Feed UI component
│   │   └── types/
│   │       └── index.ts           # NEW: Type definitions
│   └── create-post/
│       └── actions/
│           └── index.ts           # MODIFY: Add fan-out call
├── app/
│   └── (authenticated)/
│       └── feed/
│           └── page.tsx           # MODIFY: Use getFeed action
```

**Structure Decision**: Feature-based directory under src/features/feed/ following constitution V. Redis client in src/lib/ for global singleton access.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | No violations | - |