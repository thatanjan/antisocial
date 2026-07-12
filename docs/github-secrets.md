# GitHub Repository Secrets Configuration

This document lists all required GitHub repository secrets for the CI/CD pipeline to deploy to AWS.

## Required Secrets

### AWS Credentials
| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key with ECS/ECR/SecretsManager permissions | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret access key | `abc123...` |
| `AWS_REGION` | AWS region for deployment | `ap-south-1` |

### ECR Configuration
| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `ECR_REPOSITORY` | ECR repository name | `antisocial` |
| `ECR_REGISTRY` | ECR registry URL (account_id.dkr.ecr.region.amazonaws.com) | `123456789012.dkr.ecr.ap-south-1.amazonaws.com` |

### ECS Configuration
| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `ECS_CLUSTER` | ECS cluster name | `antisocial-cluster` |
| `ECS_SERVICE` | ECS service name | `antisocial-service` |
| `ECS_TASK_DEFINITION` | Task definition family name | `antisocial-task` |

### Database
| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string for migrations | `postgresql://user:pass@host:5432/db?schema=public` |

### Application Secrets
| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `NEXTAUTH_SECRET` | NextAuth.js secret (min 32 chars) | `generated-with-openssl-rand-base64-32` |
| `BETTER_AUTH_SECRET` | Better Auth secret (min 32 chars) | `generated-with-openssl-rand-base64-32` |
| `NEXT_PUBLIC_APP_URL` | Production app URL | `https://antisocial.example.com` |

### Optional: Notifications
| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `SLACK_WEBHOOK_URL` | Slack webhook for deployment notifications | `https://hooks.slack.com/services/...` |
| `DISCORD_WEBHOOK_URL` | Discord webhook for deployment notifications | `https://discord.com/api/webhooks/...` |

## Setting Up Secrets

### Via GitHub Web UI
1. Go to Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret from the tables above

### Via GitHub CLI (bulk)
```bash
# Set required secrets
gh secret set AWS_ACCESS_KEY_ID --body "AKIA..."
gh secret set AWS_SECRET_ACCESS_KEY --body "abc123..."
gh secret set AWS_REGION --body "ap-south-1"
gh secret set ECR_REPOSITORY --body "antisocial"
gh secret set ECR_REGISTRY --body "123456789012.dkr.ecr.ap-south-1.amazonaws.com"
gh secret set ECS_CLUSTER --body "antisocial-cluster"
gh secret set ECS_SERVICE --body "antisocial-service"
gh secret set ECS_TASK_DEFINITION --body "antisocial-task"
gh secret set DATABASE_URL --body "postgresql://user:pass@host:5432/db?schema=public"
gh secret set NEXTAUTH_SECRET --body "$(openssl rand -base64 32)"
gh secret set BETTER_AUTH_SECRET --body "$(openssl rand -base64 32)"
gh secret set NEXT_PUBLIC_APP_URL --body "https://your-domain.com"
```

## IAM Permissions Required

The AWS credentials need the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:CompleteLayerUpload",
        "ecr:InitiateLayerUpload",
        "ecr:PutImage",
        "ecr:UploadLayerPart",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:ListTaskDefinitions"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::*:role/ecs-task-execution-role"
    },
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "arn:aws:secretsmanager:ap-south-1:*:secret:antisocial/*"
    }
  ]
}
```

## Generating Secure Secrets

```bash
# Generate 32-character base64 secrets
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Environment-Specific Secrets (Future Staging)

When staging environment is added, prefix secrets with environment:
- `STAGING_AWS_ACCESS_KEY_ID`
- `STAGING_DATABASE_URL`
- `STAGING_NEXTAUTH_SECRET`
- etc.

GitHub Actions workflow will use environment-specific secrets when deploying to staging.