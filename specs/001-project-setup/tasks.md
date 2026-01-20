---
description: "Task list for Project Setup (Docker, Next.js, Prisma, Auth)"
---

# Tasks: Project Setup

**Input**: Design documents from `/specs/001-project-setup/`
**Prerequisites**: plan.md, spec.md, research.md
**Tests**: None (User requested no testing code)
**Organization**: Features grouped by "Developer Environment" User Story

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: [US1] = Developer Environment Initialization

## Phase 1: Docker & Next.js Initialization (Setup)

**Purpose**: Get the containerized application running with minimal Next.js boilerplate.

- [ ] T001 [P] Initialize Next.js app with TypeScript in `src/` (Clean install with `--biome`)
- [x] T002 [P] Create `Dockerfile` in root (Base: alpine, Output: standalone)
- [ ] T003 [P] Create `.dockerignore` in root (Exclude node_modules, .env)
- [ ] T004 Create `docker-compose.yml` in root (App: 3000, DB: 5432, Volume: pgdata)
- [ ] T005 [P] Create `.env.example` with standard keys (DATABASE_URL, BETTER_AUTH_SECRET)
- [ ] T006 Update `next.config.js` for standalone output mode

**Checkpoint**: `docker-compose up` should start a basic Next.js app and Postgres DB.

---

## Phase 2: Foundational Structure & Tools (Blocking)

**Purpose**: Enforce the Constitution's file structure and install core libraries.

- [ ] T007 [P] Create directory structure: `src/features`, `src/lib`, `src/components`, `src/hooks`, `src/utils`, `src/types`
- [ ] T008 [P] Install and init Tailwind CSS (Globals in `src/app/globals.css`)
- [ ] T009 [P] Install and init Shadcn UI (Config in `components.json`, assets in `src/components/ui`)
- [ ] T010 [P] Install Zod and React Hook Form libraries
- [ ] T011 Install Prisma and init schema in `prisma/schema.prisma`
- [ ] T012 Install pinned Node.js version in `package.json` (engines: v20)

---

## Phase 3: User Story 1 - Developer Environment (Priority: P1)

**Goal**: Complete the specialized setup for Auth, Logging, and Observability.

- [ ] T013 [P] [US1] Install Better Auth package in `package.json`
- [ ] T014 [US1] Create basic Better Auth client instance in `src/lib/auth-client.ts`
- [ ] T015 [US1] Install Pino/Winston and create logger utility in `src/lib/logger.ts`
- [ ] T016 [US1] Create health check endpoint in `src/app/api/health/route.ts`
- [ ] T017 [US1] Verify Shadcn theme (Slate) is applied in `src/app/layout.tsx`
- [ ] T018 [US1] Update `README.md` with Docker quickstart instructions

**Checkpoint**: Full dev environment is ready. `npm run dev` and `docker-compose up` both work.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Docker/Next)**: Independent start.
- **Phase 2 (Structure)**: Depends on T001 (Next.js init).
- **Phase 3 (US1)**: Depends on Phase 2 structure.

### Parallel Opportunities
- Docker config (T002-T005) can be done while waiting for Next.js install (T001).
- Library installs (T008-T012) can run in parallel.
- US1 tasks (T013-T018) are mostly independent of each other.

## Implementation Strategy

1. **Bootstrapping**: Run T001-T006 to get "Green Build" in Docker.
2. **Structuring**: Run T007-T012 to comply with Constitution.
3. **Refining**: Run T013-T018 to add specific feature requirements (Auth, Logger).
4. **Final Check**: Verify `docker-compose up` behaves exactly as described in `quickstart.md`.
