# Tasks: Docker AWS Deployment

**Input**: Design documents from `/specs/013-docker-aws-deployment/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: OPTIONAL - No test framework configured in project (skip test tasks)

**Organization**: Tasks grouped by user story (P1 → P2) for independent implementation and testing.

**Note**: Docker is used only for production deployments. Local development uses `npm run dev` with a local PostgreSQL instance.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1-US5) - required for story phases
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize project structure and configuration for Docker AWS deployment

- [X] T001 Create infra/ directory structure for AWS configs at `infra/`
- [X] T002 Create scripts/ directory for deployment scripts at `scripts/`
- [X] T003 [P] Configure .dockerignore for Next.js standalone output at `.dockerignore`
- [X] T004 [P] Add Docker build dependencies to package.json if needed at `package.json`
- [X] T005 [P] Verify next.config.ts has `output: 'standalone'` at `next.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create multi-stage Dockerfile for Next.js app at `Dockerfile`
- [ ] T007 ~~Create docker-compose.yml for local development~~ (removed - Docker only for production)
- [ ] T008 Create .env.example with required environment variables at `.env.example`
- [x] T009 [P] Create scripts/migrate-db.sh for Prisma migrations at `scripts/migrate-db.sh`
- [x] T010 [P] Create scripts/deploy-ecs.sh for ECS deployment at `scripts/deploy-ecs.sh`
- [x] T011 Make scripts executable at `scripts/migrate-db.sh scripts/deploy-ecs.sh`
- [x] T012 Configure GitHub repository secrets documentation at `docs/github-secrets.md`

**Checkpoint**: Foundation ready - Dockerfile builds production image, scripts executable, secrets documented

---

## Phase 3: User Story 1 - Containerize Next.js Application (Priority: P1) 🎯 MVP

**Goal**: Build production-optimized Docker image for Next.js app using multi-stage builds

**Independent Test**: `docker build -t antisocial . && docker run -p 3000:3000 --env-file .env.local antisocial` serves app on localhost:3000

### Implementation for User Story 1

- [ ] T013 [US1] Create multi-stage Dockerfile with base, builder, runner stages at `Dockerfile`
- [ ] T014 [US1] Configure Dockerfile for Next.js standalone output with node:20-alpine base at `Dockerfile`
- [ ] T015 [US1] Add non-root user and security hardening in Dockerfile at `Dockerfile`
- [ ] T016 [US1] Optimize Dockerfile layer caching for dependencies at `Dockerfile`
- [ ] T017 [US1] Test Docker build locally and verify standalone output at `Dockerfile`
- [ ] T018 [US1] Verify health check endpoint in Dockerfile (HEALTHCHECK) at `Dockerfile`

**Checkpoint**: User Story 1 complete - Docker image builds and runs Next.js app locally

---

## Phase 4: User Story 2 - Configure AWS Infrastructure for Deployment (Priority: P1)

**Goal**: Provision AWS infrastructure (ECR, ECS, ALB, VPC, Security Groups, Secrets Manager, EBS) via manual setup or IaC

**Independent Test**: AWS Console shows ECR repo, ECS cluster, ALB, VPC, SG, Secrets Manager secrets, EBS volume

### Implementation for User Story 2

- [ ] T019 [US2] Create ECR repository for Next.js app at `infra/ecr-repo.json` (doc) + AWS Console/CLI
- [ ] T020 [US2] Create ECS cluster (Fargate) at `infra/ecs-cluster.json` (doc) + AWS Console/CLI
- [ ] T021 [US2] Create VPC with public/private subnets (single AZ for learning) at `infra/vpc-config.json` (doc) + AWS Console/CLI
- [ ] T022 [US2] Create Application Load Balancer with target group at `infra/alb-config.json` (doc) + AWS Console/CLI
- [ ] T023 [US2] Create security groups: ALB SG (80/443), App SG (from ALB), DB SG (from App SG only) at `infra/security-groups.json` (doc) + AWS Console/CLI
- [ ] T024 [US2] Create IAM roles: ECS task execution role, ECS task role at `infra/iam-roles.json` (doc) + AWS Console/CLI
- [ ] T025 [US2] Create Secrets Manager secrets: DATABASE_URL, NEXTAUTH_SECRET, BETTER_AUTH_SECRET at `infra/secrets.json` (doc) + AWS Console/CLI
- [ ] T026 [US2] Create EBS volume for PostgreSQL persistence at `infra/ebs-volume.json` (doc) + AWS Console/CLI
- [ ] T027 [US2] Create CloudWatch log groups for app and db at `infra/cloudwatch-logs.json` (doc) + AWS Console/CLI
- [ ] T028 [US2] Document all resource ARNs and names for GitHub Actions at `infra/aws-resources.md`

**Checkpoint**: User Story 2 complete - All AWS infrastructure provisioned and documented

---

## Phase 5: User Story 3 - Automate Deployment with GitHub Actions (Priority: P1)

**Goal**: CI/CD pipeline that builds, pushes to ECR, runs migrations, deploys to ECS on main branch push

**Independent Test**: Push to main triggers workflow → ECR image pushed → ECS service updated → app accessible via ALB URL

### Implementation for User Story 3

- [ ] T029 [US3] Create GitHub Actions CI workflow at `.github/workflows/ci.yml`
- [ ] T030 [US3] Add lint, typecheck, build steps to CI workflow at `.github/workflows/ci.yml`
- [ ] T031 [US3] Create GitHub Actions CD workflow at `.github/workflows/deploy.yml`
- [ ] T032 [US3] Add ECR login and Docker build/push steps to CD workflow at `.github/workflows/deploy.yml`
- [ ] T033 [US3] Add Prisma migrate deploy step before ECS deploy at `.github/workflows/deploy.yml`
- [ ] T034 [US3] Add ECS service update step with new image tag at `.github/workflows/deploy.yml`
- [ ] T035 [US3] Add deployment status notification (GitHub Actions summary) at `.github/workflows/deploy.yml`
- [ ] T036 [US3] Configure GitHub Actions secrets: AWS credentials, ECR repo, ECS cluster, service names at `.github/workflows/deploy.yml` (references)
- [ ] T037 [US3] Test full pipeline with test commit to main branch

**Checkpoint**: User Story 3 complete - Automated deployment works end-to-end

---

## Phase 6: User Story 5 - Deploy PostgreSQL Database on AWS (Priority: P1)

**Goal**: Run PostgreSQL as containerized ECS Fargate task with EBS volume persistence (single AZ)

**Independent Test**: Connect to DB from ECS task via internal DNS, run migrations, data persists after task restart

### Implementation for User Story 5

- [ ] T038 [US5] Create PostgreSQL ECS task definition with EBS volume mount at `infra/ecs-task-def-db.json`
- [ ] T039 [US5] Configure PostgreSQL container: postgres:16-alpine, port 5432, healthcheck at `infra/ecs-task-def-db.json`
- [ ] T040 [US5] Mount EBS volume to /var/lib/postgresql/data in task definition at `infra/ecs-task-def-db.json`
- [ ] T041 [US5] Create ECS service for PostgreSQL (desired count: 1, placement: single AZ) at `infra/ecs-service-db.json` (doc) + AWS Console/CLI
- [ ] T042 [US5] Configure DB security group: allow inbound 5432 from App SG only at `infra/security-groups.json` (doc) + AWS Console/CLI
- [ ] T043 [US5] Inject DATABASE_URL from Secrets Manager into PostgreSQL task at `infra/ecs-task-def-db.json`
- [ ] T044 [US5] Create init script for database creation on first run at `scripts/init-db.sh`
- [ ] T045 [US5] Test database connectivity from Next.js app container at `scripts/test-db-connection.sh`

**Checkpoint**: User Story 5 complete - PostgreSQL runs on ECS with persistent storage

---

## Phase 7: User Story 4 - Configure Environment-Specific Settings (Priority: P2)

**Goal**: Securely manage per-environment configs (secrets, env vars) via AWS Systems Manager/Secrets Manager

**Independent Test**: Deploy to production uses production secrets; no secrets in Docker image or GitHub logs

### Implementation for User Story 4

- [ ] T046 [US4] Create Next.js app ECS task definition with secrets injection at `infra/ecs-task-def-app.json`
- [ ] T047 [US4] Map Secrets Manager secrets to container environment variables at `infra/ecs-task-def-app.json`
- [ ] T048 [US4] Configure task definition for CloudWatch logging at `infra/ecs-task-def-app.json`
- [ ] T049 [US4] Create ECS service for Next.js app (desired count: 2 for rolling updates) at `infra/ecs-service-app.json` (doc) + AWS Console/CLI
- [ ] T050 [US4] Configure ALB target group health check path (/api/health or /) at `infra/alb-config.json` (doc) + AWS Console/CLI
- [ ] T051 [US4] Add environment-specific config documentation at `docs/environment-config.md`
- [ ] T052 [US4] Verify no secrets in Docker image (scan with docker history) at `Dockerfile`

**Checkpoint**: User Story 4 complete - Environment configs managed securely, no leaks

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting multiple user stories, validation, documentation

- [ ] T053 [P] Run quickstart.md validation (manual deploy test) at `specs/013-docker-aws-deployment/quickstart.md`
- [ ] T054 [P] Document rollback procedure in `docs/rollback-procedure.md`
- [ ] T055 [P] Document backup/restore procedure for PostgreSQL EBS at `docs/db-backup-restore.md`
- [ ] T056 [P] Add cost estimation document for AWS resources at `docs/cost-estimation.md`
- [ ] T057 [P] Create migration guide to RDS (Option C) for production at `docs/migration-to-rds.md`
- [ ] T058 [P] Update AGENTS.md with new feature reference at `.specify/feature.json` (update to this spec)
- [ ] T059 Run `npm run lint` and `npm run format` on any modified source files
- [ ] T060 Verify all GitHub Actions workflows pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1, US2, US5 can start in parallel after Foundational
  - US3 depends on US1 (Docker image) + US2 (AWS infra) + US5 (DB)
  - US4 depends on US2 (AWS infra) + US5 (DB secrets)
- **Polish (Phase 8)**: Depends on all desired user stories complete

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (Containerize) | Foundational | Phase 2 complete |
| US2 (AWS Infra) | Foundational | Phase 2 complete |
| US3 (GitHub Actions) | US1 + US2 + US5 | US1, US2, US5 done |
| US4 (Env Config) | US2 + US5 | US2, US5 done |
| US5 (PostgreSQL) | Foundational | Phase 2 complete |

### Within Each User Story

- Infrastructure docs → AWS resource creation → Task definitions → Service creation → Validation
- Parallel tasks marked [P] have no file conflicts

---

## Parallel Opportunities

### Phase 1 (Setup): All [P] tasks can run together
```
T003 .dockerignore  |  T004 package.json  |  T005 next.config.ts
```

### Phase 2 (Foundational): All [P] scripts can run together
```
T009 migrate-db.sh  |  T010 deploy-ecs.sh  |  T012 github-secrets.md
```

### Phase 3-7 (User Stories): After Foundational, these can run in parallel
```
Team A: US1 (T013-T018)          Team B: US2 (T019-T028)          Team C: US5 (T038-T045)
```
Then: US3 (T029-T037) + US4 (T046-T052) after dependencies met

### Phase 8 (Polish): All [P] tasks can run together
```
T053-T058 documentation tasks in parallel
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 + 5 + 3)
1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete US1: Containerize Next.js app
4. Complete US2: AWS Infrastructure (manual/IaC)
5. Complete US5: PostgreSQL on ECS with EBS
6. Complete US3: GitHub Actions CI/CD
7. **STOP and VALIDATE**: Push to main → full deploy → app accessible via ALB

### Incremental Delivery
1. Foundation ready → Deploy infrastructure (US2)
2. Add containerized app (US1) → Test locally
3. Add database (US5) → Test connectivity
4. Add automation (US3) → Test pipeline
5. Add env config hardening (US4) → Security review

### Parallel Team Strategy
With 3 developers:
- Dev A: US1 (Containerize)
- Dev B: US2 (AWS Infra) + US5 (PostgreSQL)
- Dev C: Wait for US1/US2/US5 → US3 (CI/CD) + US4 (Env Config)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- No test framework configured - test tasks omitted per spec
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies breaking independence