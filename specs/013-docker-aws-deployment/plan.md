# Implementation Plan: Docker AWS Deployment

**Branch**: `014-docker-aws-deployment` | **Date**: 2026-07-13 | **Spec**: specs/013-docker-aws-deployment/spec.md
**Input**: Feature specification from `/specs/013-docker-aws-deployment/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Deploy the Next.js application to AWS using Docker containers orchestrated by ECS Fargate. The application will run as a containerized service behind an Application Load Balancer, with PostgreSQL running as a containerized task on ECS Fargate with EBS volume persistence (single AZ for learning). CI/CD via GitHub Actions: build Docker images, push to ECR, run Prisma migrations in CI, then deploy to ECS. Production-only deployment on main branch push. Docker is used only for production deployments; local development uses `npm run dev` with a local PostgreSQL instance.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js 20.x  
**Primary Dependencies**: Next.js 15 (App Router, standalone output), Prisma ORM, Better Auth, Zod, React Hook Form, Shadcn UI, Tailwind CSS  
**Storage**: PostgreSQL (containerized on ECS Fargate with EBS volume), Prisma migrations via GitHub Actions CI  
**Testing**: No test framework configured (skip unless requested)  
**Target Platform**: AWS ECS Fargate (ap-south-1), Docker containers, GitHub Actions CI/CD  
**Project Type**: Web application (Next.js full-stack with Server Components, Server Actions)  
**Performance Goals**: Sub-200ms p95 response time, container cold start <30s, zero-downtime deployments  
**Constraints**: 
- Single AZ deployment (learning mode, no HA)
- EBS volume for PostgreSQL persistence (manual backup/restore)
- Production-only pipeline initially (no staging)
- GitHub Actions secrets for AWS credentials and DATABASE_URL
- Next.js must output standalone for Docker
- Prisma migrations run in CI before ECS deploy
**Scale/Scope**: Single Next.js service + PostgreSQL container, ~10k users initial target, feature-based architecture per constitution

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Self-Documentation | ✅ Pass | TSDoc on exports, strict TS, arrow functions |
| II. KISS & DRY | ✅ Pass | Reuse existing Docker/ECS patterns |
| III. Component & Styling Standards | ✅ Pass | Shadcn UI, Tailwind tokens only |
| IV. Server-First Architecture | ✅ Pass | Server Components, Server Actions |
| V. Feature-Based File Structure | ✅ Pass | Feature modules under src/features/ |
| VI. Containerization Standards | ✅ Pass | Dockerfile exists for production; local dev uses npm run dev |
| VII. Database Migration Workflow | ✅ Pass | Migrations in CI with `--create-only`, user approval before apply |

All gates pass. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/013-docker-aws-deployment/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Next.js App Router structure (feature-based per Constitution V)
src/
├── app/                    # Next.js App Router pages
├── components/             # Global reusable components
│   └── ui/                 # Shadcn UI components
├── hooks/                  # Global reusable hooks
├── lib/                    # Third-party integrations (Prisma, Auth, etc.)
├── types/                  # Global types
├── utils/                  # Global utilities
└── features/               # Feature modules
    ├── auth/
    ├── posts/
    ├── users/
    └── ...

# Infrastructure (Docker, AWS, CI/CD)
├── Dockerfile              # Next.js standalone image (production only)
├── .github/
│   └── workflows/
│       ├── ci.yml          # CI: lint, typecheck, build, test
│       └── deploy.yml      # CD: migrations, docker build/push, ECS deploy
├── infra/
│   ├── ecs-task-def-app.json       # Next.js app task definition
│   ├── ecs-task-def-db.json        # PostgreSQL task definition
│   ├── alb-config.json             # ALB listener/target group
│   └── iam-policies.json           # IAM roles for ECS tasks
└── scripts/
    ├── deploy-ecs.sh       # ECS deployment script
    └── migrate-db.sh       # Prisma migration runner
```

**Structure Decision**: Existing Next.js feature-based structure (Constitution V) extended with infrastructure folder for AWS/ECS configs and GitHub Actions workflows. Docker files at root per Constitution VI.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | All principles satisfied | N/A |