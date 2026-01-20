# Research: Project Setup

**Feature**: Project Setup (Docker, Next.js, Prisma, Better Auth)
**Status**: Complete

## Technology Decisions

### 1. Database & Docker Orchestration
- **Decision**: Use `docker-compose` to orchestrate both PostgreSQL and the Next.js App.
- **Rationale**: Mandated by Constitution v1.2.0 (Principle VI). Ensures zero-dependency dev environment.
- **Implementation**:
  - `postgres:15-alpine` image for DB.
  - Multi-stage `Dockerfile` (dev/prod target) for Next.js.
  - `docker-compose.yml` mounts code for hot-reloading in dev.

### 2. Authentication
- **Decision**: Install `better-auth` package but defer provider configuration (as per spec clarification).
- **Rationale**: User explicitly requested to "Ignore [Auth strategy] for now".
- **Implementation**: `npm install better-auth` and create basic `auth.ts` scaffolding to satisfy "installed" requirement.

### 3. File Structure
- **Decision**: Strict Feature-Based Architecture (`src/features`, `src/lib`, etc.).
- **Rationale**: Mandated by Constitution Principle V.

## Unknowns Resolved
- **Local DB**: Docker Compose (Resolved in Spec Clarification).
- **Auth Provider**: Deferred (Resolved in Spec Clarification).

## Best Practices Checklist
- [x] Docker: Use `.dockerignore` to block `node_modules`.
- [x] Docker: Use non-root user in production stage.
- [x] Next.js: Use `standalone` output for efficient Docker builds.
- [x] Prisma: Use `PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK=1` if strictly needed for Docker, but usually fine.
- [x] Git: Ensure `.env` is ignored but `.env.example` is committed.
