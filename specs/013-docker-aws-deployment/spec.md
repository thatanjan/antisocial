# Feature Specification: Docker AWS Deployment

**Feature Branch**: `014-docker-aws-deployment`  
**Created**: 2026-07-10  
**Status**: Draft  
**Input**: User description: "want to deploy my nextjs app with docker and aws. use github actions to automate. want to use postgres with docker in aws as well"

**Note**: Docker is used only for production deployments. Local development uses `npm run dev` with a local PostgreSQL instance.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Containerize Next.js Application (Priority: P1)

Containerize the Next.js application using Docker so it can be deployed consistently across environments.

**Why this priority**: Containerization is the foundation for consistent deployment to any cloud provider including AWS. Without a working Docker image, deployment automation cannot proceed.

**Independent Test**: Can be tested by building the Docker image locally and running the container to verify the Next.js app serves correctly.

**Acceptance Scenarios**:

1. **Given** a Next.js project with a Dockerfile, **When** `docker build` is executed, **Then** the image builds successfully without errors
2. **Given** a built Docker image, **When** `docker run` is executed with proper environment variables, **Then** the Next.js application starts and serves on the configured port
3. **Given** the running container, **When** an HTTP request is made to the application port, **Then** the Next.js application responds with the expected content

---

### User Story 2 - Configure AWS Infrastructure for Deployment (Priority: P1)

Set up the necessary AWS infrastructure (ECR repository, ECS cluster, load balancer, etc.) to host the containerized Next.js application.

**Why this priority**: AWS infrastructure must be provisioning is required before any automated deployment can occur. This is a prerequisite for the CI/CD pipeline.

**Independent Test**: Can be tested by manually deploying the Docker image to the provisioned AWS infrastructure and verifying the application is accessible via the load balancer URL.

**Acceptance Scenarios**:

1. **Given** AWS credentials with appropriate permissions, **When** infrastructure is provisioned, **Then** an ECR repository exists for storing Docker images
2. **Given** provisioned infrastructure, **When** an ECS cluster is created, **Then** the cluster has sufficient capacity to run the Next.js container
3. **Given** the ECS service is deployed, **When** the load balancer health checks pass, **Then** the application is accessible via the load balancer DNS name

---

### User Story 3 - Automate Deployment with GitHub Actions (Priority: P1)

Create a GitHub Actions workflow that automatically builds the Docker image, pushes it to AWS ECR, and deploys to ECS on every push to the main branch.

**Why this priority**: Automation eliminates manual deployment steps, reduces human error, and enables continuous deployment. This is the core automation requirement.

**Independent Test**: Can be tested by pushing a commit to the main branch and verifying the GitHub Actions workflow completes successfully and the deployed application reflects the changes.

**Acceptance Scenarios**:

1. **Given** a push to the main branch, **When** the GitHub Actions workflow triggers, **Then** the Docker image is built and pushed to ECR with the correct tag
2. **Given** a successful image push to ECR, **When** the deployment step runs, **Then** the ECS service is updated with the new image
3. **Given** a successful deployment, **When** the application URL is accessed, **Then** the latest code changes are reflected in the running application
4. **Given** a failed build or deployment, **When** the workflow completes, **Then** the GitHub Actions run shows a clear failure status with actionable logs

---

### User Story 4 - Configure Environment-Specific Settings (Priority: P2)

Manage environment-specific configurations (database URLs, API keys, Next.js environment variables) securely across development, staging, and production environments.

**Why this priority**: Environment configuration is critical for security and proper application behavior in different environments. Can be implemented after core deployment works.

**Independent Test**: Can be tested by deploying to different environments and verifying each uses the correct configuration values.

**Acceptance Scenarios**:

1. **Given** different environments (staging, production), **When** the application is deployed, **Then** each environment uses its own database connection string and API keys
2. **Given** sensitive configuration values, **When** the application runs, **Then** secrets are not exposed in the Docker image or GitHub Actions logs
3. **Given** a new environment variable is added, **When** the deployment runs, **Then** the new variable is available to the application without code changes

---

### User Story 5 - Deploy PostgreSQL Database on AWS (Priority: P1)

Deploy a PostgreSQL database using Docker on AWS so the application has a persistent data store co-located with the application.

**Why this priority**: The Next.js application requires a PostgreSQL database. Running it on AWS with Docker ensures consistent deployment alongside the application and avoids external managed database costs for development/small-scale use.

**Independent Test**: Can be tested by connecting to the deployed PostgreSQL instance from the Next.js application container and verifying read/write operations.

**Acceptance Scenarios**:

1. **Given** a PostgreSQL Docker image configuration, **When** deployed to AWS, **Then** the database container starts and accepts connections on port 5432
2. **Given** the running PostgreSQL container, **When** the Next.js application connects using the internal DNS name, **Then** database migrations and queries execute successfully
3. **Given** container restart or deployment, **When** the database comes back online, **Then** existing data persists (via EBS volume or EFS)
4. **Given** the database deployment, **When** accessed from outside the VPC, **Then** connections are blocked (security group restricts to ECS tasks only)

---

### Edge Cases

- What happens when the Docker build fails due to missing dependencies or build errors?
- How does the system handle AWS credential rotation or expiration during deployment?
- What happens when the ECS deployment fails health checks - does it rollback automatically?
- How are database migrations handled during deployment?
- What happens if the GitHub Actions workflow times out during deployment?

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST build a production-optimized Docker image for the Next.js application using multi-stage builds
- **FR-002**: System MUST push the built Docker image to AWS Elastic Container Registry (ECR) with semantic version tags
- **FR-003**: System MUST deploy the Docker image to AWS ECS (Fargate) using a rolling update strategy
- **FR-004**: System MUST configure an Application Load Balancer to route traffic to the ECS service
- **FR-005**: System MUST trigger deployment automatically on push to the main branch via GitHub Actions
- **FR-006**: System MUST run database migrations as part of the deployment process before the new application version starts
- **FR-007**: System MUST configure health checks for the ECS service to enable zero-downtime deployments
- **FR-008**: System MUST store and inject environment-specific configuration (database URLs, API keys, Next.js env vars) securely using AWS Systems Manager Parameter Store or Secrets Manager
- **FR-009**: System MUST configure CloudWatch logging for the ECS service to capture application logs
- **FR-010**: System MUST send deployment notifications (success/failure) via GitHub Actions status and optionally to Slack/Discord
- **FR-011**: System MUST deploy a PostgreSQL database container on AWS ECS (Fargate) with persistent storage
- **FR-012**: System MUST configure PostgreSQL container with health checks and automatic restart on failure
- **FR-013**: System MUST provision persistent storage (EBS volume or EFS) for PostgreSQL data directory to survive container restarts
- **FR-014**: System MUST restrict PostgreSQL network access to only the Next.js ECS service via security groups
- **FR-015**: System MUST configure PostgreSQL credentials (username, password, database name) via AWS Secrets Manager and inject into both containers
- **FR-016**: System MUST run database initialization (create database, run migrations) on first PostgreSQL deployment

### Key Entities

- **Docker Image**: The containerized Next.js application artifact, tagged with version and stored in ECR
- **ECS Service**: The managed container service running the Next.js application on AWS Fargate
- **PostgreSQL ECS Service**: The managed container service running the PostgreSQL database on AWS Fargate
- **ECR Repository**: The private Docker registry in AWS for storing application images
- **GitHub Actions Workflow**: The CI/CD pipeline definition that orchestrates build, test, and deploy
- **Environment Configuration**: Per-environment secrets and configuration values (database, auth, API keys)
- **Persistent Storage**: EBS volume or EFS mount for PostgreSQL data persistence
- **Secrets Manager**: AWS service storing PostgreSQL credentials and application secrets

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Docker image builds successfully in under 5 minutes on GitHub Actions runners
- **SC-002**: End-to-end deployment (build → push → deploy) completes in under 10 minutes
- **SC-003**: Zero-downtime deployments achieved - no failed health checks during rolling updates
- **SC-004**: Application accessible via load balancer URL within 2 minutes of deployment completion
- **SC-005**: Failed deployments automatically rollback to the previous healthy version
- **SC-006**: All secrets and sensitive configuration are never exposed in build logs, Docker images, or GitHub Actions output
- **SC-007**: Application logs are aggregated in CloudWatch and queryable within 1 minute of generation

---

## Assumptions

- The Next.js application is already configured for standalone output (`output: 'standalone'` in next.config.js) or can be configured to do so
- AWS account has appropriate permissions to create ECR, ECS, ALB, IAM roles, CloudWatch, Systems Manager, EBS/EFS, and Secrets Manager resources
- GitHub repository has Actions enabled and can store AWS credentials as repository secrets
- The application uses Prisma ORM and requires `prisma migrate deploy` during deployment
- Domain name and SSL certificate management is handled separately (Route 53 + ACM) or is out of scope
- Team has basic familiarity with Docker, AWS, and GitHub Actions
- PostgreSQL will run as a container on ECS Fargate (not RDS) with persistent storage via EBS/EFS
- Database size is small-to-medium (suitable for containerized deployment; large scale would need RDS)

---

## Resolved: AWS Region and Account

**Decision**: Use AWS region **ap-south-1** (Mumbai) with existing team AWS account.

**Implications**: Leverages existing VPC, networking, and credentials. Requires AWS credentials stored as GitHub repository secrets.

## Resolved: Database Migration Strategy

**Decision**: Run `prisma migrate deploy` as a **GitHub Actions CI step before ECS deployment**, per [Prisma documentation](https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate#deploying-database-changes-using-github-actions).

**Implications**: 
- Migrations run in isolated CI environment (not in ECS)
- Only executes when `prisma/migrations/` directory changes
- `DATABASE_URL` provided via GitHub Actions secret
- Safe, auditable, and follows Prisma best practices
- Add migration safety check (e.g., pgfence) as pre-deploy step

## Resolved: Staging Environment

**Decision**: **Production-only deployment initially** (Option B).

**Implications**:
- Simpler pipeline, faster initial setup
- Single ECS service, single ECR repository
- Staging environment can be added later as a separate pipeline stage
- Direct deploy to production on main branch push

---

## Resolved: PostgreSQL Deployment Approach

**Decision**: **Option A — ECS Fargate + EBS volume (single AZ)** for learning purposes.

**Implications**:
- PostgreSQL runs as a containerized task on ECS Fargate (same platform as Next.js app)
- EBS volume provides persistent storage for database files
- Single AZ: lower cost, simpler setup, teaches container persistence patterns
- Self-managed: manual backups, no automated failover — acceptable for learning/dev
- Migration path to RDS (Option C) for production later
- Task definition includes volume mount, health checks, security group for app-to-DB access